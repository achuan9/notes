/**
 * 解析url参数
 * @example ?id=123&s=1
 * @return Object {id:123,s:1}
 */
export default (target = 'search') => {
  let url = window.location[target];
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
      arr.forEach((item) => {
          let tempArr = item.substring(1).split('=');
          let key = decodeURIComponent(tempArr[0]);
          let val = decodeURIComponent(tempArr[1]);
          obj[key] = val;
      });
  }
  return obj;
}