# 总体印象

Vue 更倾向于模版化，优点在于更语义化、语法糖实现，学习曲线平缓
React 更接近传统 JS 编程，很多事情交给用户来实现

# 插槽 & 组合

Vue 中是用插槽
React 中没有插槽的概念，组合实现类似的功能

# Context
React 中有 [Context](https://zh-hans.reactjs.org/docs/context.html) 的概念，Vue中没有。

# 状态提升

Vue 中子组件修改 `props` ：

- 子组件触发自定义事件 `this.$emit('update', newValue)` ，父组件监听该事件来修改
- 父组件绑定属性的时候添加 `sync` 修饰符，子组件通过 `this.$emit('update:name', newValue)`

React 中子组件修改 `props`:
直接通过属性绑定回调函数，子组件调用该回调函数

# 事件回调

Vue 中可以直接通过 `@click="callback"` 的形式直接绑定 `methods` 里边定义的方法
React 中与传统 `html` 类似，只是：

- 在 React 中事件的命名采用小驼峰式（camelCase），而不是纯小写
- 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。
- 在绑定前要绑定 `this` ，或者使用箭头函数之类的方法（但是不推荐）
  ```html
  <button onClick="{activateLasers}">
    Activate Lasers
  </button>
  ```

# 表单

- Vue 中存在`v-model` 实现双向绑定的语法糖。React 中交给用户自己实现
- Vue 给 `value` 属性绑定了值依然可以输入。React 中交给用户自己实现，如果给`value`绑定了非`null`、`undefined`的值则不可以输入。


