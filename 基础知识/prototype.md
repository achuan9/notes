# 构造函数（constructor）
```js
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.meow = function () {
    console.log('喵喵');
  };
}

var cat1 = new Cat('大毛', '白色');
var cat2 = new Cat('二毛', '黑色');

cat1.meow === cat2.meow // false
```

由于meow方法是通过构造函数生成在每个实例对象上面，所以两个实例就生成了两次。这种做法不提倡，因为所有meow方法都是同样的行为，应该共享。

# 原型对象（prototype）
JavaScript 规定，每个函数都有一个`prototype`属性，指向一个对象。
```js
function foo() {}
typeof foo.prototype // "object"
```
原型对象的作用，就是定义所有实例对象共享的属性和方法。这也是它被称为原型对象的原因，而实例对象可以视作从原型对象衍生出来的子对象。前面的例子通过使用`prototype`修改后：
```js
function Cat(name, color) {
  this.name = name;
  this.color = color;
}

Cat.prototype.meow = function () {
  console.log('喵喵');
};

var cat1 = new Cat('大毛', '白色');
var cat2 = new Cat('二毛', '黑色');

cat1.meow === cat2.meow // true
```

注意：
- 原型对象的属性不是实例对象自身的属性。只要修改原型对象，变动就立刻会体现在所有实例对象上。
- 如果实例对象自身就有某个属性或方法，它就不会再去原型对象寻找这个属性或方法

# 原型链（prototype chain）
JavaScript 规定，每个函数都有一个`prototype`属性，指向一个对象。一方面，任何一个对象，都可以充当其他对象的原型；另一方面，由于原型对象也是对象，所以它也有自己的原型。因此，就会形成一个“原型链”（prototype chain）：对象到原型，再到原型的原型……
原型链的最顶端是`Object.prototype`，即`Object`构造函数的`prototype`属性。__`Object.prototype`的原型是`null`__(好像这个才是最顶层哈...)。`null`没有任何属性和方法，也没有自己的原型。





