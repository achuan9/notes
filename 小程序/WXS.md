
# 模块


## `.wxs`文件

### 导出一个模块
```js
// /pages/tools.wxs

var foo = "'hello world' from tools.wxs";
var bar = function (d) {
  return d;
}
module.exports = {
  FOO: foo,
  bar: bar,
};
module.exports.msg = "some msg";
```
### 引用一个模块

```js
// /pages/logic.wxs

var tools = require("./tools.wxs");

console.log(tools.FOO);
console.log(tools.bar("logic.wxs"));
console.log(tools.msg);
```


## `<wxs>`标签
属性：  
- `module{String}`: 当前 <wxs> 标签的模块名。必填字段。
- `src{String}`：引用 .wxs 文件的相对路径。仅当本标签为单闭合标签或标签的内容为空时有效。
  > 引用的时候，要注意如下几点：
  > - 只能引用 .wxs 文件模块，且必须使用相对路径。
  > - wxs 模块均为单例，wxs 模块在第一次被引用时，会自动初始化为单例对象。多个页面，多个地方，多次引用，使用的都是同一个 wxs 模块对象。
  > - 如果一个 wxs 模块在定义之后，一直没有被引用，则该模块不会被解析与运行。
### 标签内模块

```html
<!-- page/index/index.wxml -->

<wxs module="foo">
  var some_msg = "hello world"; 
  module.exports = { msg : some_msg, }
</wxs>
<view>{{foo.msg}}</view>
```

### 引用一个模块

```html
<!-- page/index/index.wxml -->

<wxs src="./../tools.wxs" module="tools" />

<view>{{tools.msg}}</view>
<view>{{tools.bar(tools.FOO)}}</view>
```

