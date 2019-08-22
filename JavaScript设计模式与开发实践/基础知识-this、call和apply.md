# this
跟别的语言大相径庭的是，JavaScript的this总是指向一个对象，而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的，而非函数被声明时的环境。

## this 的指向

除去不常用的with和eval的情况，具体到实际应用中，this的指向大致可以分为以下4种：
- 作为对象的方法调用。
- 作为普通函数调用。
- 构造器调用。
- Function.prototype.call或Function.prototype.apply调用。

### 作为对象的方法调用
当函数作为对象的方法被调用时，`this` 指向该对象：
```js
const obj = {
  name: 'Ashin',
  showInfo: function() {
    console.log(this.name)
  }
}
obj.showInfo(); // Ashin
```

### 作为普通函数调用
当函数作为对象的方法被调用时，`this` 通常指向该全局对象，在浏览器环境也就是 `window` 对象（ECMAScript 5的strict模式下是 `undefined`）：
```js
window.name = "Ashin";

const showInfo = function() {
  console.log(this.name)
}

showInfo(); // Ashin
```
```js
window.name = "GlobalAshin";

const obj = {
  name: 'Ashin',
  showInfo: function() {
    console.log(this.name)
  }
}

const showInfo = obj.showInfo;
showInfo(); // GlobalAshin
```
```js

window.id = 'globalId'

document.getElementById('btn').onclick = function() {
  console.log(this.id) // btn
  const callback = function() {
    console.log(this.id) // globalId
  }
  callback()
}

```

### 构造器调用

当用 `new` 操作符调用函数时，该函数总会返回一个对象，通常情况下，构造器里的 `this` 就指向返回的这个对象：
```js
const MyClass = function() {
  this.name = 'Ashin'
}
const obj = new MyClass()
console.log(obj.name) // Ashin
```
需要注意的是，如果构造器显式地返回一个对象，那么 `new` 操作符的运算结果就是这个对象：
```js
const MyClass = function() {
  this.name = 'Ashin'
  return {
    name: 'new Ashin'
  }
}
const obj = new MyClass()
console.log(obj.name) // new Ashin
```

### Function.prototype.call 和 Function.prototype.apply

```js
const obj1 = {
  name: 'Ashin',
  showInfo: function() {
    console.log(this.name)
  }
}

const obj2 = {
  name: 'Sean'
}

console.log(obj1.showInfo()); // Ashin
console.log(obj1.showInfo.call(obj2)); // Sean
```

## 丢失的 `this`




