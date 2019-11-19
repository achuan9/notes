# html

## IE 判断

```html
<!--[if !IE]>除IE外都可识别 <![endif]-->
<!--[if IE]> 所有的IE可识别 <![endif]-->
<!--[if IE 8]> 仅IE8可识别 <![endif]-->
<!--[if lt IE 8]> IE8以及IE8以下版本可识别 <![endif]-->
<!--[if gte IE 8]> IE8以及IE8以上版本可识别 <![endif]-->

<!-- 举例 -->

<!--[if !IE]>
  <link rel="stylesheet" type="text/css" href="./css/base.css" />
<![endif]-->

<!--[if IE]>
  <link rel="stylesheet" type="text/css" href="./css/base.css" />
<![endif]-->
```

## 不支持的标签

`<section>`, `<main>`, `<header>`, `<footer>` 等 `HTML5` 新增的标签。  
 使用 [html5shiv](https://github.com/aFarkas/html5shiv) 解决

## 不支持的属性

- `<a>`标签的 `href` 属性设置为 mailto: xxxx（邮箱），浏览器会将 `<a>` 的 `innerText` 替换成 href 属性。
  ```html
  <a href="mailto:service@163.com">咨询</a>
  <!-- 最终渲染成下面这样 -->
  <a href="mailto:service@163.com">mailto:service@163.com</a>
  ```
- 输入框的 `placeholder`。  
  使用 `jquery.placeholder.js`

## 不支持的 API

- 视频播放器  
  jplayer 插件。

# CSS

## 不支持的选择器

- `:last-child`, `:not()`
- 除`<a>`以外元素的 `:hover` 伪类选择器。

  利用 JavaScript 的 `mouseenter`, `mouseleave` 事件来更改样式

## 不支持的属性

- `border-radius`

  1. 下载一个`PIE.htc`文件到项目中，与 `css` 文件同目录。
  2. 写样式的时候添加 `behavior:url(pie.htc);`

  ```css
  .box {
    width: 250px;
    height: 250px;
    background-color: #34538b;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
    -ms-behavior: url(pie.htc);
    behavior: url(pie.htc);
  }
  ```

* `background-size`

  1. 下载一个`PIE.htc`文件到项目中，与 `css` 文件同目录。
  2. 写样式的时候添加 `behavior:url(pie.htc);`

  ```css
  .box {
    background-image: url(/images/background.jpg);
    background-repeat: no-repeat;
    background-position-x: -580px;
    background-position-y: 0;
    -o-background-size: auto 100%;
    background-size: auto 100%;
    /* 兼容background-size */
    -ms-behavior: url(pie.htc);
    behavior: url(pie.htc);
  }
  ```

* `box-shadow`
  1. 下载一个`PIE.htc`文件到项目中，与 `css` 文件同目录。
  2. 写样式的时候添加 `behavior:url(pie.htc);`
  ```css
  .box {
    width: 250px;
    height: 250px;
    background-color: #34538b;
    -moz-box-shadow: 1px 3px 3px #666;
    -webkit-box-shadow: 1px 3px 3px #666;
    box-shadow: 1px 3px 3px #666;
    behavior: url(pie.htc);
  }
  ```

- `line-height`

  ```css
  line-height: 32px;
  line-height: 32px\9; /*IE8*/
  *line-height: 32px; /* IE7支持 */
  _line-height: 32px; /* IE6支持 */
  -ms-line-height: 32px; /*IE9+支持*/
  -webkit-line-height: 32px; /*chrome safair*/
  -moz-line-height: 32px; /*火狐*/
  ```

- `rgb()` 或者 `rgba()`。

  ```css
  background-color: rgba(102, 102, 102, 0.2);
  filter: alpha(opacity=20); /*support iE8*/
  ```

- `calc()`
- `media` 媒体查询
  1. 下载一个 `respond.min.js`
  2. 在 `html` 文件添加：
  ```html
  <!--[if lte IE 9]>
  <link rel="stylesheet" type="text/css" href="./css/base.css" />
  <script type="text/javascript" src="./js/respond.min.js"></script>
  <![endif]-–>
  ```

# JS

- 获取滚动距离
  ```js
  document.documentElement.scrollTop || document.body.scrollTop;
  ```

* 获取网页可视区域

  ```js
  window.innerHeight || document.documentElement.clientHeight;

  window.innerWidth || document.documentElement.clientWidth;
  ```

- 获取样式
  ```js
  function getStyle(dom, styleName) {
    return dom.currentStyle ? dom.currentStyle[styleName] : getComputedStyle(dom)[styleName];
  }
  ```

- 事件监听

  ```js
  if(document.all){
    dom.attactEvent(“onclick”, fn);
  } else {
    dom.addEventListener(“click”, fn);
  }
  ```

* 事件目标对象
  ```js
  var t = event.target || event.srcElement;
  ```

* 事件对象
  ```js
  evt = evt || window.event;
  ```

- 阻止事件冒泡
  ```js
  event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
  ```

* 阻止默认行为
  ```js
  evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
  ```

# 其它

- 用 `echarts2`。
- 对象的最后一个属性不要带 `,` （逗号）

# Edge 浏览器

- 中文乱码
  1. 使用转码工具对中文字符进行转码
  2. 利用 JS 的 API `charCodeAt()`:
   ```js
    var str = '中'
    str = '\u' + str.charCodeAt(0).toString(16)
   ```