
/**
 * 解决键盘挡住输入框指令
 * 
 * @example
 *  main.js
 *    import Vue from 'vue'
 *    import keyBoard from '@/plugins/key-board'
 *    Vue.use(keyBoard);
 * 
 *  组件中
 *    <input type="text" v-keyBoard/>
 *  
 */
function install(Vue, options) {
  Vue.directive('keyBoard', { 
    inserted: function (el) {
      const oHeight = document.body.clientHeight;
      window.addEventListener('resize', function (params) {
        if (oHeight > document.body.clientHeight) { //键盘弹出
          el.scrollIntoView(false);
        }
      }, false);
    }
  })
}

export default install;