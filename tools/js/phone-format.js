function formatPhoneNum(phoneNum) {//过滤手机号中间四位为 *
  return String(phoneNum).replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
}