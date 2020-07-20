const phone = /^1[3456789]\d{9}$/;
const email = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
const idCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
const password = /^[A-Za-z0-9]{6,11}$/; // 密码(6-11位) 登录密码
const registerNewPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,18})$/;  // 8~16位数字字母组合的密码
const number = /^\d{6,8}$/;  //只能输入数字(6-8位)(资金密码)
const point = /^[0-9]+(.[0-9]{2})?$/  //只能有两位小数
const passport = /^[a-zA-Z0-9]{5,17}$/; //护照正则表达式
export default {
  phone,
  email,
  idCard,
  password,
  number,
  point,
  passport,
  registerNewPassword
};
