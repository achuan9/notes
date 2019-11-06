/**
 * @param {number[]} height
 * @return {number}
 */
var sortArray1 = function(arr) {
  let counter = 0;
  for(var j = arr.length; j > 0; j--) {
    console.log('-----------');
    for(var i = 0; i < j - 1; i++) {
      counter++
      if(arr[i] > arr[i + 1]) {
        const temp = arr[i];
        arr[i] = arr[i+1]
        arr[i+1] = temp;
      }
    }
  }
  console.log('sort1: ' + counter);
  return arr;
};
var sortArray2 = function(arr) {
  let counter = 0;
  for (let i = 1; i < arr.length; i++) {
    console.log('-----------');
    for (let j = 0; j < arr.length - i; j++) {
      counter++
      const cur = arr[j];
      const next = arr[j + 1];
      if (cur > next) {
        const temp = cur;
        arr[j] = next;
        arr[j + 1] = temp;
      }
    }
  }
  console.log('sort2: ' + counter);
  return arr;
};

ready(function() {
  const arr = [1, 8, 6, 2, 5, 4, 8, 3, 7, 8, 7, 9];
  const result1 = sortArray1(arr);
  const result2 = sortArray2(arr);
  msg(result1);
  msg(result2);
});

function msg(msg, tag) {
  tag = tag || 'p';
  const wrapper = document.querySelector('.wrapper');
  const dom = document.createElement(tag);
  dom.innerText = msg;
  wrapper.appendChild(dom);
}

function ready(callback) {
  window.addEventListener('DOMContentLoaded', event => {
    callback && callback();
  });
}
