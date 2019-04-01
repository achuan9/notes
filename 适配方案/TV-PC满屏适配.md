# TV/PC满屏适配
- 业务场景： 当一个pc页面设计稿1920x1080，适配其它不同尺寸屏幕。  
- 实现逻辑：页面元素单位还是用px开发，最后通过css3的scale对body进行缩放，再调整定位。
- 代码：
```javascript
    var resizePage = function() {
        var clientH = $(window).height();
        var bi = clientH/$('body').height();

        $('body').css({
            width: 1920,
            height: 1080,
            overflow:'hidden'
        });
        $('body').css('transform','scale('+bi+')');
        $('body').css('transform-origin','left top 0');

        var marginLeft = (parseFloat(document.documentElement.clientWidth) - parseFloat($('body').css('width'))*bi)/2;
        $('body').css('margin-left',marginLeft+'px');

        // $('html').height(clientH*bi);
    };
    resizePage();
    $(window).resize(resizePage);
```