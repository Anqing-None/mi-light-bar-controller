/**
 * 参考以下链接的Python代码实现
 * reference: https://github.com/Squachen/micloud/blob/master/micloud/miutils.py
 */
import crypto from 'node:crypto';
import CryptoJS from 'crypto-js';

export function getNonce() {
  // 生成64位随机数
  const rand64 = crypto.randomBytes(8);
  const rand64Int = BigInt('0x' + rand64.toString('hex')) - BigInt(2 ** 63);
  const b = Buffer.alloc(8);
  b.writeBigInt64BE(rand64Int);

  // 获取当前时间的毫秒数，并转换为分钟数
  const millis = Date.now();
  const part2 = Math.floor(millis / 60000);
  const part2Buffer = Buffer.alloc(4); // 分配足够的空间来存储这个整数
  part2Buffer.writeInt32BE(part2);

  // 合并两个Buffer
  const combined = Buffer.concat([b, part2Buffer]);

  // 返回Base64编码的字符串
  return combined.toString('base64');
}

export function signNonce(ssecret: string, nonce: string) {
  // 创建一个SHA-256哈希对象
  const hash = crypto.createHash('sha256');

  // 使用Buffer.from()将base64字符串转换为字节码
  const decodedSsecret = Buffer.from(ssecret, 'base64');
  const decodedNonce = Buffer.from(nonce, 'base64');

  const buffer = hash.update(decodedSsecret).update(decodedNonce).digest();

  // 返回Base64编码的签名
  return buffer.toString('base64');
}

export function generateEncParams(url: string, method: string, signedNonce: string, nonce: string, params, ssecurity: string) {
  const rc4Hash = genEncSignature(url, method, signedNonce, params);

  const newParams = { ...params, rc4_hash__: rc4Hash };

  Object.keys(newParams).forEach((key) => {
    newParams[key] = encryptRc4(signedNonce, newParams[key]);
  });

  Object.assign(newParams, {
    signature: genEncSignature(url, method, signedNonce, newParams),
    ssecurity,
    _nonce: nonce,
  });

  return newParams;
}

export function genEncSignature(url: string, method: string, signed_nonce: string, params) {
  const signatureParams = [method.toUpperCase(), url.split('com')[1].replace('/app/', '/')];

  for (const [k, v] of Object.entries(params)) {
    signatureParams.push(`${k}=${v}`);
  }

  signatureParams.push(signed_nonce);
  const signatureString = signatureParams.join('&');

  const sha1 = crypto.createHash('sha1');
  const digest = sha1.update(signatureString).digest();

  return digest.toString('base64');
}

export function encryptRc4(password: string, payload: string) {
  const decodePassword = CryptoJS.enc.Base64.parse(password);

  const empty = Buffer.alloc(1024).toString('hex');
  const payloadHex = Buffer.from(payload).toString('hex');

  const rc4Encryptor = CryptoJS.algo.RC4.createEncryptor(decodePassword);

  rc4Encryptor.process(CryptoJS.enc.Hex.parse(empty));

  const ret = rc4Encryptor.finalize(CryptoJS.enc.Hex.parse(payloadHex)).toString(CryptoJS.enc.Base64);
  return ret;
}

export function decryptRc4(password: string, payload: string) {
  const decodePassword = CryptoJS.enc.Base64.parse(password);
  const decodePayload = CryptoJS.enc.Base64.parse(payload);

  const empty = Buffer.alloc(1024).toString('hex');

  const rc4Decryptor = CryptoJS.algo.RC4.createDecryptor(decodePassword);

  rc4Decryptor.process(CryptoJS.enc.Hex.parse(empty));

  const ret = rc4Decryptor.finalize(decodePayload).toString(CryptoJS.enc.Utf8);
  return Buffer.from(ret);
}

export function getUserAgent() {
  const letters = 'ABCDEF';
  let userAgentId = '';

  for (let i = 0; i < 13; i++) {
    userAgentId += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  const useragent = 'Android-7.1.1-1.0.0-ONEPLUS A3010-136-' + userAgentId + ' APP/xiaomi.smarthome APPV/62830';

  return useragent;
}

export function getRandomString(length: number) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return str;
}
