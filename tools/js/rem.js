(function (document, window) {
  /**
   * 7.5=设计稿尺寸/100
   * css元素尺寸=设计稿元素尺寸/100;
   */
  var change = 'orientationchange' in window ? 'orientationchange' : 'resize';


  function calculate() {
  var deviceWidth = document.documentElement.clientWidth;
      if (deviceWidth < 320) {
          deviceWidth = 320;
      } else if (deviceWidth > 750) {
          deviceWidth = 750;
      }
  document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
  
      window.rem2px = function(rem) {
          rem = parseFloat(rem);
          return rem * deviceWidth / 7.5;
      }
  };
window.addEventListener(change, calculate, false);
document.addEventListener('DOMContentLoaded', calculate, false);
calculate();


})(document, window);