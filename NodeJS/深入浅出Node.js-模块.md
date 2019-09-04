模块分为 **核心模块** 和 **文件模块** ：

**核心模块** 是 Node 提供的模块。在 Node 源代码的编译过程中，编译进了二进制执行文件。在 Node 进程启动时，部分核心模块就被直接加载进内存中，所以这部分核心模块引入时，文件定位和编译执行这两个步骤可以省略掉，并且在路径分析中优先判断，所以它的加载速度是最快的。核心模块又分为 _JavaScript 模块_ 和 _C/C++核心模块_ 。

**文件模块** 是用户编写的模块。在运行时动态加载，需要完整的路径分析、文件定位、编译执行过程，速度比核心模块慢。文件模块又分为 _JavaScript 模块_ 和 _C/C++扩展模块_ 。

在模块中，上下文提供`require()`方法来引入外部模块，提供`exports`对象用于导出变量或方法，还存在一个`module`对象，它代表模块自身，而`exports`是`module`的属性，因此`exports` 只能以 `exports.a = 1; exports.b = 2;`不能以 `exports = { key: value }` 的形式导出，通过 `module.exports` 则两种方式都可以。导出的同名属性或函数，后面的覆盖前面。

```js
// math.js
exports.add = function() {
  var sum = 0,
    i = 0,
    args = arguments,
    l = args.length;
  while (i < l) {
    sum += args[i++];
  }
  return sum;
};

// index.js
var math = require('./math');

var result = math.add(2, 3);
console.log(result); // 5
```

# 模块加载（文件模块）

## 缓存

与前端浏览器会缓存静态脚本文件以提高性能一样，Node 对引入过的模块都会进行缓存，以减少二次引入时的开销。不通的地方在于，浏览器仅仅就缓存文件，而 Node 缓存的是编译和执行后的对象。

不论是核心模块还是文件模块， `require()` 方法对相同模块的二次加载都一律采用缓存优先的方式，这是第一优先级的。不同之处在于核心模块的检查先于文件模块的缓存检查。

## 路径分析

`require()` 接收一个标识符作为参数，在 Node 实现中，正是基于这也一个标识符进行模块查找，主要分为以下几类：

1. `http`、`path`、`file` 这种核心模块。核心模块的优先级仅次于缓存加载，它在 Node 的源代码编译过程中已经编译为二进制代码，其加载速度最快。

2. `.` 、 `..` 或者 `/` 开始的路径文件模块。首次引入后将编译执行后的结果存放到缓存中。加载速度次于核心模块。

3. 非路径形式的自定义文件模块。通过模块路径查找，这种方式是最耗时的。

   > 模块路径是 Node 在定位文件模块的具体文件时制定的查找策略，具体表现为一个路径组成的数组，与 JavaScript 的原型链或作用域链的查找方式十分相似。生成规则如下：
   >
   > 1. 当前目录下的 `node_modules` 目录
   > 2. 父目录下的 `node_modules` 目录
   > 3. 父目录的父目录下的 `node_modules` 目录
   > 4. 逐级递归，直到根目录下的 `node_modules` 目录

## 文件定位

在第一次引入文件模块的时候有下面两个细节需要注意：

- 文件扩展名分析  
  当没有指定扩展名，Node 按照 `.js`、`.json`、`.node` 的次序尝试补足扩展名。在尝试过程中，需要调用`fs`模块同步阻塞式的判断文件是否存在。因为 Node 是单线程的，所以这里是一个会引起性能问题的地方。所以除了`.js`文件，都最好是加上文件扩展名。

- 目录分析和包  
  读取`package.json`文件，通过`main`属性指定的文件进行定位（如果文件名缺少扩展名，将会进入扩展名分析的步骤），如果`main`属性指定的文件名错误，或者没有`package.json`文件，将会依次查找`index.js`、`index.json`、`index.node`。

## 编译执行

编译执行是引入文件模块的最后一个阶段。根据上面的步骤定位到具体文件后，Node 会新建一个模块对象，然后根据路径载入并编译（对于不同的文件扩展名，其载入的方法也有所不同）。每一个编译成功的模块，都会将其文件路径作为索引（将编译执行后的结果作为值）缓存在`Module._cache`对象上，以提高二次引入的性能。

- `.js`文件通过`fs`模块同步读取文件后编译执行。
- `.json`文件通过`fs`模块同步读取后，用`JSON.parse()`解析返回结果。
- `.node`文件是用 C/C++编写的扩展文件，Node 调用`process.dlopen()`方法进行加载和执行。

# 前后端共用模块

Node 中模块的引入都是同步的，这在服务端是无伤大雅的，因为是从磁盘中加载模块。但是对于浏览器端来说，是要通过 HTTP 请求获取的，这在 UI 初始化过程中需要花费很多时间来等待脚本加载完成。所以其实 CommonJS 规范不太适用于前端的应用场景。经过一段争执后，AMD 规范最终在前端应用场景胜出，全称 Asynchronous Module Definition，即 “异步模块定义”，除了 AMD 还有玉伯定义的 CMD 规范。

## AMD 规范
```js
/**
 *
 * @example define(id?, dependencies?, factory);
 *
 * @param { string } id 模块id
 * @param { string[] } dependencies 依赖的模块
 * @param { function } factory 模块工厂函数
 *
 **/

define(function() {
  var exports = {};
  exports.sayHello = function() {
    alert('Hello from module: ' + module.id);
  };
  return exports;
});
```

## CMD 规范

```js
define(function(require, exports, module) {
  // code
});
```

## 兼容三种模式的模块

```js
(function(name, definition) {
  // 检测上下文环境是否为AMD或CMD
  var hasDefine = typeof define === 'function',
    // 检查上下文环境是否为Node
    hasExports = typeof module !== 'undefined' && module.exports;
  if (hasDefine) {
    // AMD环境或CMD环境 
    define(definition);
  } else if (hasExports) {
    // 定义为普通Node模块 
    module.exports = definition();
  } else {
    // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象 
    this[name] = definition();
  }
})('hello', function() {
  var hello = function() {};
  return hello;
});
```

# 来源

[深入浅出 Node.js](https://book.douban.com/subject/25768396/)
