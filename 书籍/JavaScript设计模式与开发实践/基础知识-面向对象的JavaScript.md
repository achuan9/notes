# 原型模式与基于原型继承的 JavaScript 对象系统

原型模式不单是一种设计模式，也被称为一种编程范型。原型模式又一个重要的特性就是，当对象无法响应某个请求时，就会把该请求委托给它的原型。

## 使用克隆的原型模式

从设计模式的角度讲，原型模式是用于创建对象的一种模式，如果我们想要创建一个对象，一种方法是先指定它的类型，然后通过类来创建这个对象。原型模式选择了另一种方式，不再关心对象的类型，而是找到一个对象，然后通过克隆来创建一个一摸一样的对象。  
但原型模式的真正目的并非在于需要得到一个一摸一样的对象，而是提供一种便捷的方式去创建某个类型的对象，克隆只是创建这个对象的过程和手段。

### Object.create

ECMAScript 5 提供了[Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)来克隆一个对象，严格来说是创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。

```js
const Coder = function() {
  this.name = 'Ashin';
  this.age = 18;
  this.gender = 'male';
};

const cloneCoder = Object.create(Coder);

console.log(cloneCoder);
console.log(cloneCoder.name);
console.log(cloneCoder.age);
console.log(cloneCoder.gender);
```

手动实现 `Object.create`:

```js
const objCreate = function(obj) {
  const F = function() {};
  F.prototype = obj;
  return new F();
};

const cloneCoder = objCreate(Coder);

console.log(cloneCoder);
console.log(cloneCoder.name);
console.log(cloneCoder.age);
console.log(cloneCoder.gender);
```

<!--
下面是一种 __不提倡__ 的做法：
```js

const objCreate2 = function(obj) {
  return {
    __proto__: obj
  }
}

```
> 警告: 由于现代 JavaScript 引擎优化属性访问所带来的特性的关系，更改对象的 [[Prototype]]在各个浏览器和 JavaScript 引擎上都是一个很慢的操作。其在更改继承的性能上的影响是微妙而又广泛的，这不仅仅限于 obj.__proto__ = ... 语句上的时间花费，而且可能会延伸到任何代码，那些可以访问任何[[Prototype]]已被更改的对象的代码。如果你关心性能，你应该避免设置一个对象的 [[Prototype]]。相反，你应该使用 Object.create()来创建带有你想要的[[Prototype]]的新对象。 -->


## `Object.prototype`

事实上，JavaScript 中的根对象是 `Object.prototype` 对象，它是一个空对象。我们在 JavaScript 遇到的每个对象，都是从 `Object.prototype` 对象克隆而来的， `Object.prototype` 对象就是它们的原型。

```js
const o1 = new Object();
const o2 = {};

// 用 ES5 提供的 Object.getPrototypeOf 来查看两个对象的原型
console.log(Object.getPrototypeOf(o1) === Object.prototype); // true
console.log(Object.getPrototypeOf(o2) === Object.prototype); // true
```

## `new` 运算符

运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。new 关键字会进行如下的操作：

1. 创建一个空的简单 JavaScript 对象（即{}）；
2. 链接该对象（即设置该对象的构造函数）到另一个对象 ；
3. 将步骤 1 新创建的对象作为 this 的上下文 ；
4. 如果该函数没有返回对象，则返回 this。

先看一段代码：

```js
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  return this.name;
};

const p = new Person('Ashin');

console.log(p); // Person {name: 'Ashin'}
console.log(p.name); // Ashin
console.log(p.getName()); // Ashin
console.log(Object.getPrototypeOf(p) === Person.prototype); // true
```

强调一下，在 JavaScript 中没有类的概念。这里的 `Person` 并不是类，而是函数构造器。当使用 `new` 运算符调用函数时，此时的函数就是一个构造器。用 `new` 运算符来创建对象的过程，是通过克隆 `Object.prototype` 来得到新的对象（但实际上并不是每次都真正地克隆了一个新的对象），再进行一些其他的额外操作的过程。

写一个函数实现 `new` 的功能：

```js
const _new = function() {
  const Constructor = [].shift.call(arguments); // 获取构造器，也就是 Person
  const obj = Object.create(Constructor.prototype); // 创建一个新对象，并将原型(__proto__) 指向构造器的原型 (Constructor.prototype)。
  const ret = Constructor.apply(obj, arguments); // 将新建的对象作为this的上下文执行构造器
  return typeof ret === 'object' ? ret : obj; // 如果构造器没有返回对象则返回新建的对象
};

const p2 = _new(Person, 'Ashin');

console.log(p2); // Person {name: 'Ashin'}
console.log(p2.name); // Ashin
console.log(p2.getName()); // Ashin
console.log(Object.getPrototypeOf(p2) === Person.prototype); // true
```

## （原型）继承

先来看一段典型的“原型风格”：

```js
function Parent(name) {
    this.name = name;
}

Parent.prototype.showInfo = function() {
    console.log(this.name);
}


function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

// 注意!下面执行后没有 Bar.prototype.constructor 了 
// 如果你需要这个属性的话可能需要手动修复一下它
Child.prototype = Object.create(Parent.prototype);

// 多态
Child.prototype.showInfo = function() {
    Parent.prototype.showInfo.call(this);
    console.log(this.age);
}

Child.prototype.dance = function() {
    console.log(this.name + ' dance');
}

var tom = new Child('Tom', 10);
tom.showInfo()
tom.dance()
console.log(tom)

```

# 参考
[曾探. JavaScript设计模式与开发实践 (图灵原创) (Chinese Edition) ](https://book.douban.com/subject/26382780/)  
[你不知道的JavaScript（上卷）](https://book.douban.com/subject/26351021/)  
[MDN Web 文档](https://developer.mozilla.org)  

