import numeral from 'numeral';
import pako from 'pako';
import CryptoJS from 'crypto-js';
export const baseUrl = 'https://api.starqueen.top/api/v1/';
export const websocketOkex = process.env.NODE_ENV == 'production' ? 'wss://www.starqueen.top/okex' : 'ws://47.244.233.224/okex';
export const websocketODIN = 'wss://ws.deerdex.com/ws/quote/v1';
export const encryptStr = '_coolguy';
const encryptKey = 'tlysxb';

// DES加密
export function encryptByDES(message){
  var keyHex = CryptoJS.enc.Utf8.parse(encryptKey);
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}

//DES解密
export function decryptByDES(ciphertext){
  var keyHex = CryptoJS.enc.Utf8.parse(encryptKey);
  var decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  var result_value = decrypted.toString(CryptoJS.enc.Utf8);
  return result_value.split('_')[0];
}

export function getCookie(key) {
  const name = key + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// 设置cookie,默认是12小时
export function setCookie(key, value) {
  const d = new Date();
  d.setTime(d.getTime() + (12 * 1 * 60 * 60 * 1000));
  const expires = "expires=" + d.toGMTString();
  document.cookie = key + "=" + value + "; " + expires;
}

export function removeCookie(name) {  
  setCookie(name, "", -1);  
}

export function filterRate(number) {
  return number = numeral(number).format('0.00%');
}

export function filterPoint(number, n) {
  const number2 =  Math.pow(10, n);
  number = Math.floor(Number(number) * number2) / number2
  number = Number(number).toFixed(n); //补足位数
  return number;
}


export function filterDigit(type) {
  let digit = 0;
  if (type.indexOf('BTC') > -1) {
    digit = 2;
  } else if (type.indexOf('ETH') > -1) {
    digit = 2;
  } else if (type.indexOf('EOS') > -1) {
    digit = 3;
  } else if (type.indexOf('ODIN') > -1) {
    digit = 6;
  } else if (type.indexOf('BU') > -1) {
    digit = 6;
  }
  return digit;
}

export function filterOptionDigit(type) {
  let digit = 0;
  if (type.indexOf('ETH') > -1) {
    digit = 3;
  } if (type.indexOf('USDT') > -1) {
    digit = 2;
  }
  return digit
}

export function filterDigitPoundage(type) {
  let digit = 0;
  if (type.indexOf('USDT') > -1) {
    digit = 2
  } else if (type.indexOf('(') > -1) {
    digit = 2;
  } else if (type.indexOf('BTC') > -1 || type.indexOf('ETH') > -1) {
    digit = 6;
  } else {
    digit = 2;
  }
  return digit;
}

export function filterInputDigit(type) {
  let reg = /^(\-)*(\d+)\.(\d\d).*$/;
  if (type.indexOf('BTC') > -1) {
    reg = /^(\-)*(\d+)\.(\d\d).*$/;
  } else if (type.indexOf('ETH') > -1) {
    reg = /^(\-)*(\d+)\.(\d\d).*$/;
  } else if (type.indexOf('EOS') > -1) {
    reg = /^(\-)*(\d+)\.(\d\d\d).*$/;
  } else if (type.indexOf('ODIN') > -1) {
    reg = /^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/;
  } else if (type.indexOf('BU') > -1) {
    reg = /^(\-)*(\d+)\.(\d\d\d\d\d\d).*$/;
  }
  return reg;
}

export function filterRecType(recType) {
  let contText;
  const lang = localStorage.getItem('lang') || 'zh';
  switch (recType) {
  case 1:
    contText = lang === 'en' ? 'openMore' : '开多';
    break;
  case 0:
    contText = lang === 'en' ? 'openEmpty' : '开空';
    break;
  case 11: 
    contText = lang === 'en' ? 'flatMore' : '平多';
    break;
  case 10: 
    contText = lang === 'en' ? 'flatEmpty' : '平空';
    break;
  default: 
    break
  }
  return contText
}

export function unzip(key) {
  var charData = key.split('').map(function (x) { return x.charCodeAt(0); });
  var binData = new Uint8Array(charData);
  var data = pako.inflateRaw(binData);
  key = String.fromCharCode.apply(null, new Uint16Array(data));
  return unescape(key);
}