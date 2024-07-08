import fetch from 'node-fetch';
import crypto from 'node:crypto';
import { getNonce, signNonce, generateEncParams, getUserAgent, getRandomString, decryptRc4 } from './utils';

class MiLogin {
  username: string = '';
  password: string = '';
  sign: string = '';
  ticket: string = '';
  ssecurity: string = '';
  userId: string = '';
  serviceToken: string = '';
  passToken: string = '';
  cUserId: string = '';
  headers: Headers = new Headers({
    'User-Agent': getUserAgent(),
  });
  cookies = {
    sdkVersion: '3.8.6',
    deviceId: getRandomString(6),
  };

  getCookieString() {
    return Object.keys(this.cookies)
      .map((c) => `${c}=${this.cookies[c]}`)
      .join(';');
  }

  constructor() {}

  /**
   * step 1: 获取签名
   */
  async getSign() {
    const url = 'https://account.xiaomi.com/pass/serviceLogin?sid=xiaomiio&_json=true';
    this.headers.set('Cookie', this.getCookieString());

    const res = await fetch(url, {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow',
    });

    const text = await res.text();

    const str = text.replace('&&&START&&&', '');
    const data = JSON.parse(str);

    this.sign = data._sign;
  }

  /**
   * step 2: 获取二维码
   * @returns
   */
  async getQRCode() {
    const timeStamp = Date.now();

    const query = {
      _qrsize: 240,
      qs: '%3Fsid%3Dxiaomiio',
      bizDeviceType: '',
      callback: 'https://sts.api.io.mi.com/sts',
      theme: '',
      sid: 'xiaomiio',
      needTheme: false,
      showActiveX: false,
      serviceParam: JSON.stringify({ checkSafePhone: false, checkSafeAddress: false, lsrp_score: 0.0 }),
      _locale: 'zh_CN',
      _sign: this.sign,
      _dc: timeStamp,
    };
    const url = new URL('https://account.xiaomi.com/longPolling/loginUrl');
    Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));

    const res = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    const text = await res.text();

    const str = text.replace('&&&START&&&', '');
    const data = JSON.parse(str);

    const { lp, loginUrl } = data;
    this.listenScanState(lp);

    return loginUrl;
  }

  /**
   * step 3: 登录
   */
  async login() {
    const url = 'https://account.xiaomi.com/pass/serviceLoginAuth2';
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.set('Cookie', this.getCookieString());

    // 将密码转换为md5
    const hash = crypto.createHash('md5').update(this.password).digest('hex').toUpperCase();
    const postBody = new URLSearchParams();
    postBody.append('sid', 'xiaomiio');
    postBody.append('hash', hash);
    postBody.append('callback', 'https://sts.api.io.mi.com/sts');
    postBody.append('qs', '%3Fsid%3Dxiaomiio%26_json%3Dtrue');
    postBody.append('user', this.username);
    postBody.append('_json', 'true');
    postBody.append('_sign', this.sign);

    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: postBody,
    });

    const text = await res.text();

    const str = text.replace('&&&START&&&', '');
    const data = JSON.parse(str);
    const { cUserId, nonce, passToken, ssecurity, userId, location } = data;
    Object.assign(this, { cUserId, userId, passToken, ssecurity, nonce });
    this.getServiceToken(location);
  }

  /**
   * step 3: 监听扫码结果
   * @param url
   */
  async listenScanState(url: string) {
    const res = await fetch(url, {
      method: 'GET',
      headers: { ...this.headers, Cookie: this.getCookieString() },
    });

    const text = await res.text();

    const str = text.replace('&&&START&&&', '');
    const data = JSON.parse(str);
    console.log('扫码成功', data);

    const { cUserId, nonce, passToken, ssecurity, userId, location } = data;

    Object.assign(this, { cUserId, userId, passToken, ssecurity, nonce });

    this.getServiceToken(location);
  }

  /**
   * step 4: 获取serviceToken
   * @param url
   */
  async getServiceToken(url: string) {
    // handle cookies
    Object.assign(this.cookies, {
      passToken: this.passToken,
      cUserId: this.cUserId,
      userId: this.userId,
      passInfo: 'login-end',
    });

    this.headers.set('Cookie', this.getCookieString());
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const res = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    const cookies = res.headers.raw()['set-cookie'] || [];
    const serviceTokenStr = cookies.find((cookie) => cookie.includes('serviceToken')) || 'serviceToken=false;Path=/';
    const serviceTokenCookie = serviceTokenStr.split(';')[0] || '';
    const serviceToken = serviceTokenCookie.replace('serviceToken=', '');

    this.serviceToken = serviceToken;

    this.getDeviceList();
  }

  /**
   * step 5: 获取设备列表
   */
  async getDeviceList() {
    const url = 'https://api.io.mi.com/app/home/device_list';

    const params = {
      data: JSON.stringify({ getVirtualModel: true, getHuamiDevices: 1, get_split_device: false, support_smart_home: true }),
    };

    const nonce = getNonce();
    const signed_nonce = signNonce(this.ssecurity, nonce);

    // 加密后的数据
    const postData = generateEncParams(url, 'POST', signed_nonce, nonce, params, this.ssecurity);

    const myHeaders = new Headers();
    myHeaders.append('x-xiaomi-protocal-flag-cli', 'PROTOCAL-HTTP2');
    myHeaders.append('MIOT-ENCRYPT-ALGORITHM', 'ENCRYPT-RC4');
    myHeaders.append('User-Agent', 'Android-7.1.1-1.0.0-ONEPLUS A3010-136-DAAABCCDDCAEF APP/xiaomi.smarthome APPV/62830');
    myHeaders.append('Cookie', `userId=2295685283;yetAnotherServiceToken=${this.serviceToken};serviceToken=${this.serviceToken};locale=zh_CN;timezone=GMT+08:00;is_daylight=0;dst_offset=0;channel=MI_APP_STORE`);
    myHeaders.append('content-type', 'application/x-www-form-urlencoded');
    myHeaders.append('Accept', '*/*');
    myHeaders.append('Host', 'api.io.mi.com');
    myHeaders.append('Connection', 'keep-alive');

    Object.assign(this.cookies, {
      userId: this.userId,
      yetAnotherServiceToken: this.serviceToken,
      serviceToken: this.serviceToken,
      channel: 'MI_APP_STORE',
    });

    const postBody = new URLSearchParams();
    Object.keys(postData).forEach((key) => postBody.append(key, postData[key]));

    const res = await fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: postBody,
      redirect: 'follow',
    });
    const text = await res.text();

    const decryptedData = decryptRc4(signed_nonce, text);
    const data = JSON.parse(decryptedData.toString('utf-8'));

    console.log(data);
    return data.result.list;
  }
}

export default MiLogin;
