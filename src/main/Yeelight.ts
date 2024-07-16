import dgram from 'node:dgram';
import crypto from 'node:crypto';

class Yeelight {
  ip: string = '';
  token: string = '';

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

  constructor() {
    this.socket.on('listening', () => {
      this.socket.setBroadcast(true);
      const address = this.socket.address();
      console.log(`socket is listening ${address.address}:${address.port}`);
    });

    this.socket.on('message', (msg, _remoteInfo) => {
      this.handleMessage(msg);
    });

    this.socket.bind();
  }

  setDevice(IP: string, token: string) {
    this.ip = IP;
    this.token = token;
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

    return await this.sendMessageAndWaitResponse(newPacket, 54321, this.ip);
  }

  async turn(state: 'on' | 'off') {
    const command = {
      id: 1,
      method: 'set_power',
      params: [state],
    };

    return await this.sendCommand(command);
  }

  handleMessage(msg: Buffer) {
    const buf = Buffer.from(msg);
    const deviceId = buf.readUInt32BE(8);
    const stamp = buf.readUInt32BE(12);

    this.deviceId = deviceId;
    this.stamp = stamp;
    // hello packet length is 32，other packet length is message
    if (msg.length === 32) {
      return { id: 1, result: ['ok'] };
    } else {
      const decipher = this.decipher;
      const decrypted = Buffer.concat([decipher.update(buf.slice(32)), decipher.final()]);
      const resObj = JSON.parse(decrypted.toString());
      console.log(resObj);
      return resObj;
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

  async sendMessageAndWaitResponse(buf: Buffer, port: number, ip: string, timeout: number = 3000) {
    const sendAndWait = async (): Promise<any> => {
      const res = await this.send(buf, port, ip);
      if (res) {
        return new Promise((resolve, _) => {
          this.socket.once('message', (msg, _remoteInfo) => {
            const ret = this.handleMessage(msg);
            resolve(ret);
          });
        });
      } else {
        return new Promise((resolve, _) => resolve(false));
      }
    };

    const timing = (): Promise<any> => {
      return new Promise((resolve, _) => {
        setTimeout(() => {
          const timeoutErr = { id: 1, error: { message: 'timeout', code: -1 } };
          resolve(timeoutErr);
        }, timeout);
      });
    };

    return await Promise.race([sendAndWait(), timing()]);
  }

  destory() {
    this.socket.close();
  }
}

export default Yeelight;
