/**
 * session
 * 
 * @example
 *  main.js
 *    import Vue from 'vue'
 *    import session from '@/plugins/session'
 *    Vue.use(session);
 * 
 *  组件中
 *    this.$session.set('key', value)
 *    this.$session.get('key')
 *    this.$session.remove('key')
 *    this.$session.clear()
 *  
 */

function install(Vue, options) {
  Vue.prototype.$session = { //sessionStorage封装
    get(key) {
      try {
        return JSON.parse(sessionStorage.getItem(key))
      } catch (error) {
        return null
      }
    },
    set(key, val) {
      sessionStorage.setItem(key, JSON.stringify(val));
    },
    remove(key) {
      sessionStorage.removeItem(key);
    },
    clear() {
      sessionStorage.clear();
    }
  }
}
export default install