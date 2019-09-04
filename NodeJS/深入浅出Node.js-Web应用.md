# Cookie

在一个 Web 应用中，我们通常需要保存用户状态（例如如何标识和认证一个用户），但是 HTTP 是一个无状态的协议，Cookie 就是解决方案之一。

Cookie 的处理分为如下几步：

- 服务端向客户端发送 Cookie。
- 浏览器讲 Cookie 保存。
- 之后每次浏览器都会将 Cookie 发向服务器。

## 发送 Cookie

服务器使用 Set-Cookie 响应头部向用户代理（一般是浏览器）发送 Cookie 信息。一个简单的 Cookie 可能像这样：

> Set-Cookie: <cookie 名>=<cookie 值>

例如在 Node.JS 中：

```js
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```

### 会话期 Cookie

最简单的 Cookie，即浏览器关闭之后就会被删除。

### 持久性 Cookie

`Expires` 指定一个有效时间，是一个 UTC 格式的时间字符串。指定 Cookie 的`Expires`，是与客户端的事件匹配而不是服务器，当服务器与客户端时间有差异时，用`Expires`就存在偏差。

`Max-Age` 指定有效期，单位为秒。是 HTTP1.1 支持的，当 `Expires` 与 `Max-Age` 同时存在，`Max-Age` 优先级更高

> Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;

### Cookie 的 Secure 和 HttpOnly 标记

`Secure` 标记的 Cookie 只会在 HTTPS 协议加密过的请求发送给服务端。从 Chrome 52 和 Firefox 52 开始，不安全的站点（http:）无法使用 Cookie 的 `Secure` 标记。

`HttpOnly` 标记的 Cookie，客户端无法通过 `Document.cookie` API 访问，但不影响传输。有效避免 XSS 攻击。

> Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly

### Cookie 的作用域

`Domain` 指定哪些主机可以接受 Cookie（包含子域名），默认为当前文档的主机（**不包含子域名**）

`Path` 指定主机下哪些路径可以接受 Cookie，以字符 `%x2F` ("/") 作为路径分隔符，子路径也会被匹配。

### SameSite Cookies （试验性）

`SameSite` Cookie 允许服务器要求某个 cookie 在跨站请求时不会被发送，从而可以阻止跨站请求伪造攻击（CSRF）。

## Cookie 的性能影响

由于 Cookie 的实现机制，每次客户端请求都会带上 Cookie，一旦设置的 Cookie 过多，就会导致报头较大，而大多数 Cookie 并不是每次都需要，就造成带宽的部分浪费。

因为静态组件几乎不关心状态，所以可以为静态组件使用不同的域名，有效的避免 Cookie 带来的性能影响。

# Session

前面提到 Cookie 可以实现浏览器与服务器的状态记录，但是缺点也很明显，例如：体积过大造成带宽浪费，浏览器端可以自行修改导致的安全性问题等。  
为了解决 Cookie 敏感数据的问题，Session 应运而生：

- 保存在服务器，更安全
- 无须在报头中传输，节省带宽

## Session 实现方式：

### 1. 基于 Cookie 来实现用户和数据的映射

步骤如下：

- 在服务端生成口令放在 Cookie 中传给客户端

```js
var key = 'session_id';
var EXPIRES = 20 * 60 * 1000; // 普遍设置Session的有效期为20分钟
var generate = function() {
  var session = {};
  session.id = new Date().getTime() + Math.random();
  session.cookie = {
    expire: new Date().getTime() + EXPIRES
  };
  sessions[session.id] = session;
  return session;
};
```

- 收到客户端的请求，检查 Cookie 中的口令与服务端的数据

```js
function (req, res) {
  var id = req.cookies[key];
  if (!id) {
    req.session = generate();
  } else {
    var session = sessions[id];
    if (session) {
      if (session.cookie.expire > (new Date()).getTime()) {
        // 更新超时时间
        session.cookie.expire = (new Date()).getTime() + EXPIRES;
        req.session = session;
      } else {
        // 超时重新生成
        delete sessions[id];
        req.session = generate();
      }
    } else {

      req.session = generate();
    }
  }
  handle(req, res);
}
```

```js
var writeHead = res.writeHead;
res.writeHead = function() {
  var cookies = res.getHeader('Set-Cookie');
  var session = serialize('Set-Cookie', req.session.id);
  cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
  res.setHeader('Set-Cookie', cookies);
  return writeHead.apply(this, arguments);
};
```

```js
var handle = function(req, res) {
  if (!req.session.isVisit) {
    res.session.isVisit = true;
    res.writeHead(200);
    res.end('欢迎第一次来');
  } else {
    res.writeHead(200);
    res.end('欢迎您再来');
  }
};
```

### 2. 基于 查询字符串 来实现用户和数据的映射

思路与基于 Cookie 的类似：
查询请求的查询字符串来判断是否存在口令，如果不存在或者过期就生成 Session 并返回`302`状态码和`Location`报头，否则更新超时时间。

```js
var getURL = function(_url, key, value) {
  var obj = url.parse(_url, true);
  obj.query[key] = value;
  return url.format(obj);
};

function (req, res) {
  var redirect = function(url) {
    res.setHeader('Location', url);
    res.writeHead(302);
    res.end();
  };
  var id = req.query[key];
  if (!id) {
    var session = generate();
    redirect(getURL(req.url, key, session.id));
  } else {
    var session = sessions[id];
    if (session) {
      if (session.cookie.expire > new Date().getTime()) {
        // 更新超时时间
        session.cookie.expire = new Date().getTime() + EXPIRES;
        req.session = session;
        handle(req, res);
      } else {
        // 超时，删除就数据并重新生成session
        delete sessions[id];
        var session = generate();
        redirect(getURL(req.url, key, session.id));
      }
    } else {
      // session过期或口令不对，重新生成
      var session = generate();
      redirect(getURL(req.url, key, session.id));
    }
  }
}
```

## Session 与安全

尽管 Session 的实现是将数据保存在服务端，但是口令还是保存在客户端的，存在口令被盗用的情况。我们可以对口令通过私钥加密进行签名，使得伪造成本较高（当然理论上是有机会命中的）：

```js
// 将值通过私钥签名，由 . 分割原值和签名
var sign = function(val, secret) {
  return (
    val +
    '.' +
    crypto
      .createHmac('sha256', secret)
      .update(val)
      .digest('base64')
      .replace(/\=+$/, '')
  );
};

var val = sign(req.sessionID, secret);
res.setHeader('Set-Cookie', cookie.serialize(key, val));
```

接受请求时，检查签名：

```js
var unsign = function(val, secret) {
  var str = val.slice(0, val.lastIndexOf('.'))
  return sign(str, secret) == val ? str : false;
};
```
这样一来，即使攻击者知道口令中“.”前面是Session的ID值，只要不知道私钥，就无法伪造签名信息，以此实现对Session的保护。该方法被Connect中间件框架所使用。  

上面的方案还存在风险：如果攻击者通过某种方式获取了一个真实的口令和签名，他便能实现伪装。一种方案是将客户端的某些独有信息（用户IP、浏览器信息等）与口令作为原值，然后签名，这样攻击者除非这些独有信息与用户完全相同才能通过验证，



## Session 与内存

前面的示例代码是将 Session 保存在内存中，这在实际场景中肯定是不可取的。

当我们利用多核 CPU 启动多个进程，用户请求可能会被随意分配到各个进程，而 Node 中进程和进程不能直接共享内存的，所以 Session 可能会出现错乱。

为了解决性能问题和 Session 数据无法跨进程共享的问题，常用的方案就是将 Session 集中化存储，常用的工具有 Redis。通过这些高效的缓存，Node 进程无须在内部维护数据对象，垃圾回收问题和内存限制问题都可以引刃而解，并且这些高速缓存设计的缓存过期策略更合理更高效，比在 Node 中自行设计缓存策略要好。

采用第三方缓存来存储 Session 的方案会引起网络访问，但是 Node 与高效缓存保持长链接、高效缓存直接在内存中存取数据，且缓存服务通常与 Node 进程运行在相同的机器或机房，所以可以忽略第三方缓存引起的网络访问。

# 缓存



# 参考

[深入浅出 Node.js](https://book.douban.com/subject/25768396/)

[MDN Web 文档](https://developer.mozilla.org)
