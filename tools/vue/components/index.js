
/**
 * 需要注册为全局组件就在这里引入，并添加到 components 对象中，不用操作其它地方。
 * 
 * 例如：在这里引入了 BaseButton 在页面中就可以直接用  <base-button>按钮</base-button>
 * 
 */

import BaseButton from './button/BaseButton'
import BaseHeader from './header/BaseHeader'
import HeaderFacade from './header/HeaderFacade'
import BaseTab from './tab/BaseTab'
import TabBottom from './tab/TabBottom'
import Swipeout from './swipeout/Swipeout'
import EchartsLine from './echarts/EchartsLine'
import EchartsBarHori from './echarts/EchartsBarHori'

const components = {
  BaseButton,
  BaseHeader,
  HeaderFacade,
  BaseTab,
  TabBottom,
  Swipeout,
  EchartsLine,
  EchartsBarHori
}





function install(Vue) {
  
  if (install.installed) {
    return
  }

  install.installed = true

  for (const key in components) {
    if (components.hasOwnProperty(key)) {
      Vue.component(key, components[key])
    }
  }
}
  
export default install
