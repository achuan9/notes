[TOC]

# WXML

全称是 WeiXin Markup Language

# 属性

  | 属性名 | 类型 | 描述 | 注解 |
  |:-------:|:-------:|:-------:|:-------:|
  |id|String|组件的唯一标识|整个页面唯一|
  |class|String|组件的样式类|在对应的 WXSS 中定义的样式类|
  |style|String|组件的内联样式|可以动态设置的内联样式|
  |hidden|Boolean|组件是否显示|所有组件默认显示|
  |data-*|Any|自定义属性|组件上触发的事件时，会发送给事件处理函数|
  |bind*/catch*|EventHandler|组件的事件|-|

# 数据绑定

```html
<!--
{ a: 1,  b: 2, c: 3 }
-->
<text>{{"hello world"}}</text>
<!-- 输出 hello world -->
<text>a的值是: {{a}}</text>
<!-- 输出 a的值是: 1 -->
<text data-a="{{a}}">hello world</text>
<!-- 输出 hello world -->
<text>{{ a === 1 ? "变量 a 等于1": "变量 a 不等于1"}}</text>
<!-- 输出 变量 a 等于1 -->
<view> {{a + b}} + {{c}} + d </view>
<!-- 输出 3 + 3 + d -->
<view>{{"hello " + a}}</view>
<!-- 输出 hello 1 -->
<text>{{ [1,2,3] }}</text>
<!-- 输出 1,2,3 -->
```

# 条件逻辑

```html
<view wx:if="{{length > 5}}"> 1 </view>
<view wx:elif="{{length > 2}}"> 2 </view>
<view wx:else> 3 </view>

<block wx:if="{{true}}">
  <view> view1 </view>
  <view> view2 </view>
</block>
```

# 循环

数组的当前项的下标变量名默认为 `index`，数组当前项的变量名默认为 `item`。
如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态（如 `<input/>` 中的输入内容， `<switch/>` 的选中状态），需要使用 `wx:key`来指定列表中项目的唯一的标识符。  
`wx:key` 的值以两种形式提供：

- 字符串，代表在`for`循环的`array`中`item`的某个`property`，该`property`的值需要是列表中唯一的字符串或数字，且不能动态改变。
- 保留关键字`this`代表在`for`循环中的`item`本身，这种表示需要`item`本身是一个唯一的字符串或者数字，如：当数据改变触发渲染层重新渲染的时候，会校正带有`key`的组件，框架会确保他们被重新排序，而不是重新创建，以确保使组件保持自身的状态，并且提高列表渲染时的效率。

```html
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
  {{idx}}: {{itemName.message}}
</view>

<!--
  {
    objectArray: [
      {id: 5, unique: 'unique_5'},
      {id: 4, unique: 'unique_4'},
      {id: 3, unique: 'unique_3'},
      {id: 2, unique: 'unique_2'},
      {id: 1, unique: 'unique_1'},
      {id: 0, unique: 'unique_0'},
    ],
    numberArray: [1, 2, 3, 4]
  }
  -->
<switch wx:for="{{objectArray}}" wx:key="unique"> {{item.id}} </switch>
<switch wx:for="{{numberArray}}" wx:key="*this"> {{item}} </switch>
```

# 模版

**_定义模版：_** 使用 name 属性，作为模板的名字。然后在 `<template/>` 内定义代码片段  
**_使用模版：_** 使用 `is` 属性，声明需要的使用的模板，然后将模板所需要的 `data` 传入

```html
<!--
list: [
  { index: 0, msg: 'this is a template-0', author: 'author-0' },
  { index: 1, msg: 'this is a template-1', author: 'author-1' },
  { index: 2, msg: 'this is a template-2', author: 'author-2' },
  { index: 3, msg: 'this is a template-3', author: 'author-3' }
]
-->
<template name="oddItem">
  <view>
    <text> oddItem </text>
    <text> {{msg}}, this index is {{index}} </text>
    <text> this author is {{author}} </text>
  </view>
</template>
<template name="evenItem">
  <view>
    <text> evenItem </text>
    <text> {{index}}: {{msg}} </text>
    <text> author: {{author}} </text>
  </view>
</template>
<block wx:for="{{list}}" wx:key="item.index">
  <template is="{{ item.index % 2 === 0 ? 'evenItem' : 'oddItem'}}" data="{{ ...item }}"></template>
</block>
```

# 引用
## ___import___ 可以在该文件中使用目标文件定义的 `template`
需要注意的是 import 有作用域的概念，即只会 import 目标文件中定义的 template，而不会 import 目标文件中 import 的 template，简言之就是 import 不具有递归的特性。



```html
<!-- item.wxml -->
<template name="item">
  <text>{{text}}</text>
</template>
<!-- index.wxml -->
<import src="item.wxml">
<template is="item" data="{{text: 'Hello'}}"></template>
````

## ___include___ 可以将目标文件中除了 `<template/> <wxs/>` 外的整个代码引入，相当于是拷贝到 include 位置

```html
<!-- header.wxml -->
<view>Header</view>

<!-- footer.wxml -->
<view>Footer</view>

<!-- index.wxml -->
<include src="header.wxml"></include>
<view>Body</view>
<include src="footer.wxml"></include>

```

