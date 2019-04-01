# 定义函数
## 函数声明
函数的声明可以被提升(出现在调用语句之后)
```javascript
square()

function square(number) {
  return number * number;
}
```
## 函数表达式
```javascript
console.log(square); // square is hoisted with an initial value undefined.
console.log(square(5)); // TypeError: square is not a function

var square = function (number) {
  return number * number;
}

var factorial = function fac(n) {
  return n<2 ? 1 : n*fac(n-1)
};

```
# 作用域和函数堆栈

## 递归
一个函数可以指向并调用自身。有三种方法可以达到这个目的：
- 函数名
- arguments.callee
- 作用域下的一个指向该函数的变量名
 
例如，思考一下如下的函数定义：
```javascript
var foo = function bar() {
   // statements go here
};
```
在这个函数体内，以下的语句是等价的：  
  1. `bar()`
  2. `arguments.callee()`
  3. `foo()`   

## 函数堆栈
```javascript
function foo(i) {
  if (i < 0)
    return;
  console.log('begin:' + i);
  foo(i - 1);
  console.log('end:' + i);
}
foo(3);

// 输出:

// begin:3
// begin:2
// begin:1
// begin:0
// end:0
// end:1
// end:2
// end:3


function fac(n) {
  return n<2 ? 1 : n*fac(n-1)
};

console.log(fac(3)); // 输出：6  => 3 * 2 * 1
```

## 嵌套函数和闭包
你可以在一个函数里面嵌套另外一个函数。嵌套（内部）函数对其容器（外部）函数是私有的。它自身也形成了一个闭包。一个闭包是一个可以自己拥有独立的环境与变量的的表达式（通常是函数）。

既然嵌套函数是一个闭包，就意味着一个嵌套函数可以”继承“容器函数的参数和变量。换句话说，内部函数包含外部函数的作用域。

由于内部函数形成了闭包，因此你可以调用外部函数并为外部函数和内部函数指定参数：

```javascript
function outside(x) {
  function inside(y) {
    return x + y;
  }
  return inside;
}
fn_inside = outside(3); // Think of it like: give me a function that adds 3 to whatever you give it
result = fn_inside(5); // returns 8

result1 = outside(3)(5); // returns 8
```

注意到上例中 inside 被返回时 x 是怎么被保留下来的。一个闭包必须保存它可见作用域中所有参数和变量。因为每一次调用传入的参数都可能不同，每一次对外部函数的调用实际上重新创建了一遍这个闭包。只有当返回的 inside 没有再被引用时，内存才会被释放。

这与在其他对象中存储引用没什么不同，但是通常不太明显，因为并不能直接设置引用，也不能检查它们。


# 闭包

闭包是 JavaScript 中最强大的特性之一。JavaScript 允许函数嵌套，并且内部函数可以访问定义在外部函数中的所有变量和函数，以及外部函数能访问的所有变量和函数。但是，外部函数却不能够访问定义在内部函数中的变量和函数。这给内部函数的变量提供了一定的安全性。此外，由于内部函数可以访问外部函数的作用域，因此当内部函数生存周期大于外部函数时，外部函数中定义的变量和函数将的生存周期比内部函数执行时间长。当内部函数以某一种方式被任何一个外部函数作用域访问时，一个闭包就产生了。

```javascript
var createPet = function(name) {
  var sex;
  
  return {
    setName: function(newName) {
      name = newName;
    },
    
    getName: function() {
      return name;
    },
    
    getSex: function() {
      return sex;
    },
    
    setSex: function(newSex) {
      if(typeof newSex == "string" 
        && (newSex.toLowerCase() == "male" || newSex.toLowerCase() == "female")) {
        sex = newSex;
      }
    }
  }
}

var pet = createPet("Vivie");
pet.getName();                  // Vivie

pet.setName("Oliver");
pet.setSex("male");
pet.getSex();                   // male
pet.getName();                  // Oliver
```

在上面的代码中，外部函数的name变量对内嵌函数来说是可取得的，而除了通过内嵌函数本身，没有其它任何方法可以取得内嵌的变量。内嵌函数的内嵌变量就像内嵌函数的保险柜。它们会为内嵌函数保留“稳定”——而又安全——的数据参与运行。而这些内嵌函数甚至不会被分配给一个变量，或者不必一定要有名字。

```javascript
var getCode = (function(){
  var secureCode = "0]Eal(eh&2";    // A code we do not want outsiders to be able to modify...
  
  return function () {
    return secureCode;
  };
})();

getCode();    // Returns the secret code
```
尽管有上述优点，使用闭包时仍然要小心避免一些陷阱。如果一个闭包的函数用外部函数的变量名定义了同样的变量，那在外部函数域将再也无法指向该变量。
```javascript
var createPet = function(name) {  // Outer function defines a variable called "name"
  return {
    setName: function(name) {    // Enclosed function also defines a variable called "name"
      name = name;               // ??? How do we access the "name" defined by the outer function ???
    }
  }
}
```

# 预定义函数
JavaScript语言有好些个顶级的内建函数：  
### `eval()`
eval()方法会对一串字符串形式的JavaScript代码字符求值。

### `uneval()`
uneval()方法创建的一个Object的源代码的字符串表示。

### `isFinite()`
isFinite()函数判断传入的值是否是有限的数值。 如果需要的话，其参数首先被转换为一个数值。

### `isNaN()`
  isNaN()函数判断一个值是否是NaN。注意：isNaN函数内部的[强制转换规则](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN#Description)。
   
  通过`ECMAScript 6 `中定义`Number.isNaN(x)`来检测变量`x`是否是一个`NaN`将会是一种可靠的做法。然而，在缺少`Number.isNaN`函数的情况下, 通过表达式`(x != x)` 来检测变量`x`是否是`NaN`会更加可靠。

  一个isNaN的 polyfill 可以理解为（这个polyfill利用了NaN自身永不相等于自身这一特征 ）：
  ```javascript
  var isNaN = function(value) {
    var n = Number(value);
    return n !== n;
  };
  ```

### `parseFloat()`
parseFloat() 函数解析字符串参数，并返回一个浮点数。

### `parseInt()`
parseInt() 函数解析字符串参数，并返回指定的基数（基础数学中的数制）的整数。

### `decodeURI()`
decodeURI() 函数对先前经过encodeURI函数或者其他类似方法编码过的字符串进行解码。

### `decodeURIComponent()`
decodeURIComponent()方法对先前经过encodeURIComponent函数或者其他类似方法编码过的字符串进行解码。

### `encodeURI()`
encodeURI()方法通过用以一个，两个，三个或四个转义序列表示字符的UTF-8编码替换统一资源标识符（URI）的某些字符来进行编码（每个字符对应四个转义序列，这四个序列组了两个”替代“字符）。

### `encodeURIComponent()`
encodeURIComponent() 方法通过用以一个，两个，三个或四个转义序列表示字符的UTF-8编码替换统一资源标识符（URI）的每个字符来进行编码（每个字符对应四个转义序列，这四个序列组了两个”替代“字符）。

