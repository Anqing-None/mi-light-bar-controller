import dgram from 'node:dgram';
import crypto from 'node:crypto';

class Yeelight {
  ip: string = '';
  token: string = '';

  isActive: boolean = false;
  socket: dgram.Socket = dgram.createSocket('udp4');
  deviceId: number = 0;
  stamp: number = 0;

  get bufferToken() {
    return Buffer.from(this.token, 'hex');
  }

  get tokenKey() {
    return crypto.createHash('md5').update(this.bufferToken).digest();
  }

  get tokenKeyIV() {
    return crypto.createHash('md5').update(this.tokenKey).update(this.bufferToken).digest();
  }

  get cipher() {
    return crypto.createCipheriv('aes-128-cbc', this.tokenKey, this.tokenKeyIV);
  }

  get decipher() {
    return crypto.createDecipheriv('aes-128-cbc', this.tokenKey, this.tokenKeyIV);
  }

  constructor(ip: string, token: string) {
    if (ip === '' || token === '') {
      throw Error('ip or token is empty');
    }

    this.ip = ip;
    this.token = token;

    this.socket.on('listening', () => {
      this.socket.setBroadcast(true);
      const address = this.socket.address();
      console.log(`socket is listening ${address.address}:${address.port}`);
    });

    this.socket.on('message', (msg, remoteInfo) => {
      this.handleMessage(msg, remoteInfo);
    });

    this.socket.bind();

    this.hello().then((res: boolean) => {
      this.isActive = res;
      console.log('isActive', this.isActive);
    });
  }

  async hello() {
    const helloBuffer = Buffer.alloc(2 + 2 + 4 + 4 + 4 + 16);
    helloBuffer[0] = 0x21;
    helloBuffer[1] = 0x31;
    helloBuffer[2] = 0x00;
    helloBuffer[3] = 0x20;
    for (let i = 4; i < 32; i++) {
      helloBuffer[i] = 0xff;
    }

    const ret = await this.sendMessageAndWaitResponse(helloBuffer, 54321, this.ip);

    return ret;
  }

  async sendCommand(command) {
    /**
     * miio协议
     * https://github.com/OpenMiHome/mihome-binary-protocol/blob/master/doc/PROTOCOL.md
     */
    const header = Buffer.alloc(2 + 2 + 4 + 4 + 4 + 16);
    header[0] = 0x21;
    header[1] = 0x31;

    // device id
    header.writeInt32BE(this.deviceId, 8);

    // stamp
    header.writeInt32BE(this.stamp, 12);

    // md5 checksum
    for (let i = 16; i < 32; i++) {
      header[i] = 0xff;
    }

    const commandBuffer = Buffer.from(JSON.stringify(command));
    const cipher = this.cipher;
    const encrypted = Buffer.concat([cipher.update(commandBuffer), cipher.final()]);

    // set length
    const length = encrypted.byteLength + 32;
    header.writeUInt16BE(length, 2);

    // md5 header[0,16] + token(buffer) + encrypted(buffer)
    const digest = crypto.createHash('md5').update(header.slice(0, 16)).update(this.bufferToken).update(encrypted).digest();
    digest.copy(header, 16);

    const newPacket = Buffer.concat([header, encrypted]);

    return await this.send(newPacket, 54321, this.ip);
  }

  async getInitState() {
    const command = {
      id: 1,
      method: 'set_power',
      params: ['power', 'bright', 'CT'],
    };

    return await this.sendCommand(command);
  }

  async turn(state: 'on' | 'off') {
    const command = {
      id: 1,
      method: 'set_power',
      params: [state],
    };

    return await this.sendCommand(command);
  }

  handleMessage(msg: Buffer, remoteInfo: dgram.RemoteInfo) {
    // console.log('get message from ', remoteInfo.address, remoteInfo.port, msg.toString());
    const buf = Buffer.from(msg);
    const header = Buffer.from(msg);
    const deviceId = header.readUInt32BE(8);
    const stamp = header.readUInt32BE(12);

    this.deviceId = deviceId;
    this.stamp = stamp;
    console.log(msg.toString('hex'));

    if (msg.length !== 32) {
      const decipher = this.decipher;
      const decrypted = Buffer.concat([decipher.update(buf.slice(32)), decipher.final()]);
      console.log(decrypted.toString());
      const resObj = JSON.parse(decrypted.toString());
      const result = resObj.result;
      console.log(result);
    }
  }

  async send(buf: Buffer, port: number, ip: string) {
    return new Promise((resolve, reject) => {
      this.socket.send(buf, port, ip, (err) => {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  async sendMessageAndWaitResponse(buf: Buffer, port: number, ip: string, timeout: number = 5000) {
    const sendAndWait = async (): Promise<boolean> => {
      const res = await this.send(buf, port, ip);
      if (res) {
        return new Promise((resolve, _) => {
          this.socket.once('message', (msg, remoteInfo) => {
            this.handleMessage(msg, remoteInfo);
            resolve(true);
          });
        });
      } else {
        return new Promise((resolve, _) => resolve(false));
      }
    };

    const timing = (): Promise<boolean> => {
      return new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(false);
        }, timeout);
      });
    };

    return await Promise.race([sendAndWait(), timing()]);
  }
}

export default Yeelight;
