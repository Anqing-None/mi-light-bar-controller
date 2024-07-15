import { expect, test } from 'vitest';
import { encryptRc4, signNonce, generateEncParams, decryptRc4 } from '..//main/utils';

test('signNonce', () => {
  const ssecret = 'VRHcqyosWYjavGwK2QQ5Vw==';
  const nonce = 'PBuoxlp7Lo4BtZIM';

  const ret = signNonce(ssecret, nonce);

  expect(ret).toBe('/sadP1KglGhfNbOIpQ7P/FOuL30H4saa8y9cR4enBlY=');
});

test('genEncSignature', () => {
  const ssecret = 'VRHcqyosWYjavGwK2QQ5Vw==';
  const nonce = 'PBuoxlp7Lo4BtZIM';

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

  const ret = decryptRc4(password, payload);

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
  const serviceToken = '2v5Zt0+X1BM2bty4YMPkMvuPF94iWiQV5MuzYVlH63l8xo6hmPSapqGhbxSJ258zdkD5vEMvz0zSxFku3A/Fc7DPhCCdObhN44nDWW0MshXrBNmuCIYk7pQgUJsMEDgih5lUjW4+nBIwflLEya0Jise8YuOxmYoCj4t6St+MMqU';

  const rightToken = 'CPAhi1uq42Z6vOzHlhGYHRLTf1Stk/FJCVLBfPYfCjmEHcGMot9zKqU7nfaTs9/MmQJJbcFK3xMKpAFVjO87CzTakJYUcXj7m/SqqB74nR89Pq04SfZ/mxu3N6qN4s3PX0tbmH3pF/nu9xDIXMtbiSKL5rjXUca3hE0sKe2wAPw=';

  var myHeaders = new Headers();
  myHeaders.append('x-xiaomi-protocal-flag-cli', 'PROTOCAL-HTTP2');
  myHeaders.append('MIOT-ENCRYPT-ALGORITHM', 'ENCRYPT-RC4');
  myHeaders.append('User-Agent', 'Android-7.1.1-1.0.0-ONEPLUS A3010-136-DAAABCCDDCAEF APP/xiaomi.smarthome APPV/62830');
  myHeaders.append('Cookie', `userId=2295685283;yetAnotherServiceToken=${rightToken};serviceToken=${rightToken};locale=en_US;timezone=GMT+08:00;is_daylight=0;dst_offset=0;channel=MI_APP_STORE`);
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

  const res = await fetch('https://api.io.mi.com/app/home/device_list', {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  });
  const text = await res.text();
  expect(text).toBe(
    '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',
  );
});
