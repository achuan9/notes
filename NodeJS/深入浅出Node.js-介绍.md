[深入浅出Node.js](https://book.douban.com/subject/25768396/)读书笔记

> Node.js 是一个基于 Chrome V8 引擎的 JavaScript __运行环境__。   
> Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。  
> —— [Node.js中文网](http://nodejs.cn/)

# 特点

## 异步 I/O
在Web端，过去大多数是同步的方式编写程序，这种串行调用下层应用数据的过程中充斥着串行的等待时间，如果采用多线程来解决这种串行等待，又或多或少地显得小题大做。在Node中，语言层面即可天然并行的特性在这种场景中显得十分有效。
例如读取文件。

```js
var fs = require('fs');
fs.readFile('/etc/passwd1', (err, data) => {
  if (err) throw err;
  console.log('passwd1: ' + data);
});
fs.readFile('/etc/passwd2', (err, data) => {
  if (err) throw err;
  console.log('passwd2: ' + data);
});
```

对于同步I/O而言，它们的耗时是两个任务耗时之和，而对于异步I/O来说，耗时取决最慢的那个文件读取时间。

## 事件与回调函数

因为在 JavaScript 中，函数是一等公民，可以将函数作为对象传递给方法作为实参进行调用。

```js
var http = require('http');
var querystring = require('querystring');

http
  .createServer(function(req, res) {
    var postData = '';
    req.setEncoding('utf8');

    req.on('data', function(trunk) {
      postData += trunk;
    });

    req.on('end', function() {
      res.end(postData);
    });
  })
  .listen(8080);
console.log('服务器启动􏻞成');
```

## 单线程

优点是不用像多线程那样处处在意共享状态的问题，没有死锁的存在，也没有线程上下文交换所带来的性能上的开销。  
缺点是无法利用多核 CPU，错误会引起整个应用推出（应用的健壮性值得考验），大量计算占用 CPU 导致无法继续调用异步 I/O。

HTML5 定制了 Web Workers 的标准，Web Workers 能够创建工作线程来进行计算，以解决 JavaScript 大计算阻塞 UI 渲染的问题，工作线程为了不阻塞主线程，通过消息传递的方式来传递运行结果，这也使得工作线程不能访问到主线程中的 UI。  

Node 采用了与 Web Workers 相同思路来解决单线程中大计算量的问题：child_process。子进程的出现，意味着 Node 可以从容地应对单线程在健壮性和无法利用多核 CPU 方面的问题。Node还可以通过编写C/C++扩展的方式更高效地利用CPU，将一些V8不能做到性能极致的地方通过C/C++实现。

## 跨平台
兼容Windows和*nix平台主要得益于Node在架构层面的改动，它在操作系统与Node上层模块系统之间构建了一层平台层架构，即libuv。

