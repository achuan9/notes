/**
 * 重写链接参数
 * 
 * 项目中客户端会通过链接给我们传递一些公共参数。但是他们都习惯于在链接的最后面传。
 * 例如；http://devgw.vpclub.cn/umall/web/app/#/list?userId=1&orgId=2
 * 这样会出现一个问题（以上面链接说明）：
 *  假如这是分享到微信的，用户点击list页面跳转到detail页面。此时后面的参数都没有了，如果在detail页面通过微信再次分享，是不是这些参数就会丢失。
 * 此工具函数的目的就是解决这个问题，将公共参数放到location.search上，私有参数依然放在后面（location.hash）。
 *
 * @module setUrl
 * 
 * @param    {Array<String>}  keys  公共参数的key
 * @returns  {Object} 返回公共参数组成的对象
 * 
 * @version  1.0
 * @date     2018-03-27
 * @author   shengchuang<sheng.chuang@vpclub.cn>
 * @example 
 *    src/config/index.js
 *      import setSearchData from "@/utils/setSearchData";
 *      const CLIENT = setSearchData(['userid', 'orgid']);
 * 
 */
export default (keys = []) => {
  let [searchObj, hashObj, searchArr, hashArr, returnObj] = [urlParse(), urlParse('hash'), [],
    [], {}
  ];
  const hashPath = location.hash.split('?')[0];
  for (const item of keys) {
    if (hashObj[item] && !searchObj[item]) {
      returnObj[item] = searchObj[item] = hashObj[item];
      delete hashObj[item]
    }
  }
  for (const key in searchObj) {
    searchArr.push(`${key}=${searchObj[key]}`)
  }
  for (const key in hashObj) {
    hashArr.push(`${key}=${hashObj[key]}`)
  }
  history.replaceState(null, "", `?${searchArr.join('&')}${hashPath}?${hashArr.join('&')}`);
  return returnObj
}

/**
 * 
 * @module 解析url参数
 *
 * @param    {String}  [target='search']  要解析的内容  默认值是search, 可传hash
 * @returns  {Object} 返回将目标内容解析后的对象
 */
function urlParse(target = 'search') {
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