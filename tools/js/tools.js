
/**
 * 判断数据类型
 * @param {*} 需要判断的目标
 * @return {String} 返回目标的类型字符串 ["Number", "Object", "RegExp", "String", "Boolean", "Array", "Window", "Constructor"]
 */
const getClass = object => Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];

/**
 * 获取当前设备类型
 * @returns Object 
 */
const getDevice = (function () {
  const ua = navigator.userAgent
  return {
    isAndroid: /(Android);?[\s/]+([\d.]+)?/.test(ua),
    isIpad: /(iPad).*OS\s([\d_]+)/.test(ua),
    isIpod: /(iPod)(.*OS\s([\d_]+))?/.test(ua),
    isIphone: !isIpad && /(iPhone\sOS)\s([\d_]+)/.test(ua),
    isWechat: /micromessenger/i.test(ua),
    isAlipay: /alipayclient/i.test(ua)
  }
})()

/**
 * 格式化时间
 * @param {Date} date 时间
 * @param {String} fmt 'YYYY-MM-DD HH:mm:ss' 需要的格式
 * @returns {String} 格式化后的字符串
 */

 const timeFmt = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  var o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 友好显示时间 刚刚、1分钟前、*分钟前、1小时前等等
 * @param {*} time 要比较的时间
 * @returns {String} 与当前时间比较后的时间
 * 
 */
const timeFriendly = (time) => {
  let date = (typeof time === 'number') ? new Date(time) : new Date((time || '').replace(/-/g, '/'))
  let diff = (((new Date()).getTime() - date.getTime()) / 1000)
  let dayDiff = Math.floor(diff / 86400)

  let isValidDate = Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())

  if (!isValidDate) {
    console.error('not a valid date')
  }
  const formatDate = function (date) {
    let today = new Date(date)
    let year = today.getFullYear()
    let month = ('0' + (today.getMonth() + 1)).slice(-2)
    let day = ('0' + today.getDate()).slice(-2)
    let hour = today.getHours()
    let minute = today.getMinutes()
    let second = today.getSeconds()
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return formatDate(date)
  }

  return dayDiff === 0 && (
      diff < 60 && '刚刚' ||
      diff < 120 && '1分钟前' ||
      diff < 3600 && Math.floor(diff / 60) + '分钟前' ||
      diff < 7200 && '1小时前' ||
      diff < 86400 && Math.floor(diff / 3600) + '小时前') ||
    dayDiff === 1 && '昨天' ||
    dayDiff < 7 && dayDiff + '天前' ||
    dayDiff < 31 && Math.ceil(dayDiff / 7) + '周前'
}
/**
 * 格式化链为对象
 * @param {String} target [search, hash]要格式化的链接目标，例如vue的项目有时候只需要解析#后面的就传hash
 * @return {Object} 返回一个对象，如果没有值就是空对象
 */
const urlParse = (target = 'search') => {
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

/**
 * 简单的手机号加密解密（比较适用于连接上分享带手机号）
 * 
 * phoneEncr.rule
 *  @description 这是加/解密规则，你也可以修改，但是同一个字符不能重复
 * 
 * phoneEncr.encrypt(phone) 
 *  @param {Number | String} phone 要加密的手机号
 *  @returns {String} 加密后的字符串
 * 
 * phoneEncr.decrypt(encryptStr) 
 *  @param {String} encryptStr 用encrypt加密的字符串
 *  @returns {String} 解密后的电话号码
 */
const phoneEncr = {
  rule: ['l', 'a', 'o', 's', 'h', 'e', 'n', 'g',  'b', 'u', 'd'],
  encrypt: function(phone) {//加密
    let str = ''
    for (const item of `${phone}`) {
      str += this.rule[item * 1]
    }
    return str
  },
  decrypt: function(encryptStr) {//解密
    let str = ''
    for (const item of encryptStr) {
      const i = this.rule.indexOf(item);
      str += i > -1 ? i+'' : ''
    }
    return str
  }
}

/**
 * 微信分享
 * @param {Object} configData 微信配置的参数，appId, timestamp, nonceStr, signature
 * @param {Object} shareData 分享的数据，title, desc, link, imgUrl
 */
const wxShare = (configData = {}, shareData = {}) => {
  if (!configData.appId) throw '缺少appId'
  if (!configData.timestamp) throw '缺少timestamp'
  if (!configData.nonceStr) throw '缺少nonceStr'
  if (!configData.signature) throw '缺少signature'

  if (!shareData.title) throw '缺少title'
  if (!shareData.desc) throw '缺少desc'
  if (!shareData.link) throw '缺少link'
  if (!shareData.imgUrl) throw '缺少imgUrl'
  wx.config({
    debug: false,
    appId: configData.appId,
    timestamp: configData.timestamp,
    nonceStr: configData.nonceStr,
    signature: configData.signature,
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
  });
  wx.ready(function () {
    wx.onMenuShareTimeline(shareData);
    wx.onMenuShareAppMessage(shareData);
    wx.onMenuShareQQ(shareData);
    wx.onMenuShareWeibo(shareData);
    wx.onMenuShareQZone(shareData);
  });
  wx.error(function (res) {
    
  });
}

export {
  getClass,
  getDevice,
  timeFmt,
  timeFriendly,
  urlParse,
  phoneEncr
}