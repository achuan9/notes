// 修复微信软键盘收起页面不回弹
import device from './get-device'
;(function() {
  if (device.isIphone && device.isWechat) {
    let timeout = null
    document.body.addEventListener('focusin', () => {
      clearTimeout(timeout)
    })
    document.body.addEventListener('focusout', () => {
      clearTimeout(timeout)
      timeout = setTimeout(function() {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }, 200)
    })
  }
})()
