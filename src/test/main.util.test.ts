import { expect, test } from 'vitest';
import { encryptRc4, dcryptRc4, signNonce, genEncSignature, generateEncParams } from '..//main/utils';
import RC4 from 'crypto-js/rc4';
import Base64 from 'crypto-js/enc-base64';
import CryptoJS from 'crypto-js';

test('signNonce', () => {
  const ssecret = 'VRHcqyosWYjavGwK2QQ5Vw=='
  const nonce = 'PBuoxlp7Lo4BtZIM'

  const ret = signNonce(ssecret, nonce);

  expect(ret).toBe('/sadP1KglGhfNbOIpQ7P/FOuL30H4saa8y9cR4enBlY=');
});

test('genEncSignature', () => {
  const ssecret = 'VRHcqyosWYjavGwK2QQ5Vw=='
  const nonce = 'PBuoxlp7Lo4BtZIM'

  const ret = signNonce(ssecret, nonce);

  expect(ret).toBe('/sadP1KglGhfNbOIpQ7P/FOuL30H4saa8y9cR4enBlY=');
});

test('encryptRc4', () => {
  const password = 'W8X1VntTMFuyrXw98v0TYhlg5RtRhc6mNvkS4B+VqIc=';
  const payload = '{"getVirtualModel":true,"getHuamiDevices":1,"get_split_device":false,"support_smart_home":true}';

  const ret = encryptRc4(password, payload);

  expect(ret).toBe('Ds33fYtRCW45TZk4SXWkHb4O+YrXsv2ArZ9TtyOwHeAAC4vMuqMYN2mSX6RH501CaBSkEIND5ieBQgrxQICAxIfqdFMKZSIfHp/qwS8YMhWI/thMhKgNhrkIqsirqOM=');
});

test('dcryptRc4', () => {
  const password = 'wlMu4wu8cPUcvchc1IZgrEsU/2i7zBVzl7rAQitMa9s=';
  const payload =
    'XVqO8VBlov3OMxNT2tsZ8cK0eftb7sPLQvg3LHvv0nFErxvuFchW0XLFAeThbFzvUa3nVqrnsnHCn4udHz1bFwEdTXt3sv0d4iGyFRBZDxgz3fes/MK5mB2SI2dJEtgj1Z9ksop7g0H1W2Wv7X5fCILKXc9LD4CRNvAmXCGXI1KELlNsvHWNb59Tob4Ei6s8tNvxpNAyqYuZTgECKhR52UtRpqQnV04xwyEW8u+hazanxLrfJW0N699H0Pqae4407juos6wBvwmsiJDs0gr86H0XCkWPgkkEJS5zTw==';

  const ret = dcryptRc4(password, payload);

  const text = Buffer.from(ret).toString('utf-8');

  expect(text).toBe('{"code":0,"message":"ok","result":{"list":[],"virtualModels":[{"model":"zhimi.airpurifier.m1","state":0,"url":""},{"model":"yunmi.waterpurifier.v2","state":0,"url":""},{"model":"zimi.powerstrip.v2","state":0,"url":""}]}}');
});

test('generateEncParams', () => {
  const url = 'https://api.io.mi.com/app/home/device_list';
  const method = 'POST';
  const signedNonce = 'h8qMGpMrWQHwqKawgEYdWHxf/hIfEQwbHsmm3ULaiSI=';
  const nonce = 'dgWBmBFa4x4BtZCl';
  const params = { data: '{"getVirtualModel":true,"getHuamiDevices":1,"get_split_device":false,"support_smart_home":true}' };
  const ssecurity = 'US71EEetQpk1u5DcBS5LUg==';

  const ret = generateEncParams(url, method, signedNonce, nonce, params, ssecurity);

  expect(ret).toEqual({
    data: 'LSzc1aOaSgaHr1hfSkPsIbbuFxxescbEUfVaJk/qNFQJkWBU+Shii3/MexpyThdG2pZbQKaUY6WkpZ8G4iVdV/849Yc5r0rUDI/sJsZ4ifrNpLGUJW50erE/1dbRR4I=',
    rc4_hash__: 'EGzK47m0FRipnUh0cwfwKe6YbzIa8MyZNfRQbw==',
    signature: 'vK3VpMtd+j5fjmH9Zqjn2iImODs=',
    ssecurity: 'US71EEetQpk1u5DcBS5LUg==',
    _nonce: 'dgWBmBFa4x4BtZCl',
  });
});

test('request', async () => {

  const serviceToken = '2v5Zt0+X1BM2bty4YMPkMvuPF94iWiQV5MuzYVlH63l8xo6hmPSapqGhbxSJ258zdkD5vEMvz0zSxFku3A/Fc7DPhCCdObhN44nDWW0MshXrBNmuCIYk7pQgUJsMEDgih5lUjW4+nBIwflLEya0Jise8YuOxmYoCj4t6St+MMqU'

  const rightToken = 'CPAhi1uq42Z6vOzHlhGYHRLTf1Stk/FJCVLBfPYfCjmEHcGMot9zKqU7nfaTs9/MmQJJbcFK3xMKpAFVjO87CzTakJYUcXj7m/SqqB74nR89Pq04SfZ/mxu3N6qN4s3PX0tbmH3pF/nu9xDIXMtbiSKL5rjXUca3hE0sKe2wAPw='

  var myHeaders = new Headers();
  myHeaders.append('x-xiaomi-protocal-flag-cli', 'PROTOCAL-HTTP2');
  myHeaders.append('MIOT-ENCRYPT-ALGORITHM', 'ENCRYPT-RC4');
  myHeaders.append('User-Agent', 'Android-7.1.1-1.0.0-ONEPLUS A3010-136-DAAABCCDDCAEF APP/xiaomi.smarthome APPV/62830');
  myHeaders.append(
    'Cookie',
    `userId=2295685283;yetAnotherServiceToken=${rightToken};serviceToken=${rightToken};locale=en_US;timezone=GMT+08:00;is_daylight=0;dst_offset=0;channel=MI_APP_STORE`,
  );
  myHeaders.append('content-type', 'application/x-www-form-urlencoded');
  myHeaders.append('Accept', '*/*');
  myHeaders.append('Host', 'api.io.mi.com');
  myHeaders.append('Connection', 'keep-alive');

  var urlencoded = new URLSearchParams();
  urlencoded.append('data', 'fjlARCINPkQLySi7PoOPMjEonfV5QkW7flwiOYSJdbr/6+gZ9Qj1GJD6FnaF2VJUSXcNMvHylBg0Z2QQuiN34dWnupyTrN/u2OYK3RXxE1pnQUJQM/wGMJisC+0WBfM=');
  urlencoded.append('rc4_hash__', 'TlNDeBwZJVcq5nGcQY2TLho8jOMzXRXvbwMOcA==');
  urlencoded.append('signature', 'KVyGV5D8neJcK8Pvj4aYylQUVko=');
  urlencoded.append('ssecurity', 'RM7HRCtdr/6tEaxqCDiEJw==');
  urlencoded.append('_nonce', 'C/AmGyzmxhkBtZHy');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };

  const res = await fetch('https://api.io.mi.com/app/home/device_list', requestOptions);
  const texg = await res.text();

  console.log(texg);

  let a;
  // .then((response) => response.text())
  // .then((result) => {
  //   console.log(result)
  // })
  // .catch((error) => console.log('error', error));
});
