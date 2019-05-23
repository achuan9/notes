# `WXSS` 样式

全称是 WeiXin Style Sheets

# 选择器

  | 选择器 | 类型 | 样例 | 样例描述 |
  |:-------:|:-------:|:-------:|:-------:|
  |.class|类选择器|.intro|选择所有拥有 class="intro" 的组件
  |#id   |id选择器|#firstname|选择拥有 id="firstname" 的组件
  |element|元素选择器|view checkbox|选择所有文档的 view 组件和所有的 checkbox 组件
  |::before|伪元素选择器|view::before|在 view 组件前边插入内容
  |::after|伪元素选择器|view::after|在 view 组件后边插入内容

  ___权重：___   
  ![](./images/selector.png)


# 尺寸单位 `rpx（responsive pixel）`

小程序编译后，rpx会做一次px换算。换算是以375个物理像素为基准，也就是在一个宽度为375物理像素的屏幕下，1rpx = 1px。

举个例子：iPhone6屏幕宽度为375px，共750个物理像素，那么1rpx = 375 / 750 px = 0.5px。

# `WXSS` 引用
同sass一样引入。由于WXSS最终会被编译打包到目标文件中，用户只需要下载一次，在使用过程中不会因为样式的引用而产生多余的文件请求。
```css
@import './test_0.wxss'
```

# 内联样式
```html
<!-- index.wxml -->
<view style="width: 100rpx; color: red; font-size: 48rpx;"></view>

<!--
{
  viewWidth: '100rpx',
  viewColor: 'red',
  viewFont: '48rpx'
}
-->
<view style="width: {{viewWidth}}; color: {{viewColor}}; font-size: {{viewFont}};"></view>

<!-- 👇👇👇🙅‍🙅‍🙅‍ 下面这样不行 -->
<!--
{
  styles: {
   width: '100rpx',
   color: 'red',
   fontSize: '48rpx'
  }
}
-->
<view style="{{styles}}"></view>


```