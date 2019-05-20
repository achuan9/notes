export const PHONE = /^1[3-9][0-9]{9}$/; // 手机号
export const POSITIVE_INT = /^\+?[1-9]\d*$/; // 正整数
export const PWD = /^(?![a-zA-Z]+$)(?!\\\\D+$).{8,16}$/; // 密码为8-16位数字字母组合
export const NON_CHINESE = /^[^\u4e00-\u9fa5]+$/; // 不含有中文字符
export const LICENSE_NUM = /^[A-Z]{2}$/; // 车牌号首字母为2位大写字母
// 身份证号
export const ID_CARD = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;