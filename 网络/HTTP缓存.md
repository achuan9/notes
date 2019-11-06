- [新鲜度](#%e6%96%b0%e9%b2%9c%e5%ba%a6)
  - [计算缓存寿命](#%e8%ae%a1%e7%ae%97%e7%bc%93%e5%ad%98%e5%af%bf%e5%91%bd)
- [表示重定向的响应状态码](#%e8%a1%a8%e7%a4%ba%e9%87%8d%e5%ae%9a%e5%90%91%e7%9a%84%e5%93%8d%e5%ba%94%e7%8a%b6%e6%80%81%e7%a0%81)
  - [300 Multiple Choices](#300-multiple-choices)
  - [301 Moved Permanently](#301-moved-permanently)
  - [302 Found](#302-found)
  - [303 See Other](#303-see-other)
  - [304 Not Modified](#304-not-modified)
  - [307 Temporary Redirect](#307-temporary-redirect)
  - [308 Permanent Redirect](#308-permanent-redirect)
- [与缓存相关的消息头](#%e4%b8%8e%e7%bc%93%e5%ad%98%e7%9b%b8%e5%85%b3%e7%9a%84%e6%b6%88%e6%81%af%e5%a4%b4)
  - [缓存控制](#%e7%bc%93%e5%ad%98%e6%8e%a7%e5%88%b6)
    - [Cache-control](#cache-control)
    - [Pragma: no-cache](#pragma-no-cache)
    - [Expires: <http-date>](#expires-http-date)
  - [其他](#%e5%85%b6%e4%bb%96)
    - [Date: \<day-name>, \<day> \<month> \<year> \<hour>:\<minute>:\<second> GMT](#date-day-name-day-month-year-hourminutesecond-gmt)
    - [Age: \<delta-seconds>](#age-delta-seconds)
    - [Last-Modified: \<day-name>, \<day> \<month> \<year> \<hour>:\<minute>:\<second> GMT](#last-modified-day-name-day-month-year-hourminutesecond-gmt)
    - [If-Modified-Since: \<day-name>, \<day> \<month> \<year> \<hour>:\<minute>:\<second> GMT](#if-modified-since-day-name-day-month-year-hourminutesecond-gmt)
    - [If-Unmodified-Since: \<day-name>, \<day> \<month> \<year> \<hour>:\<minute>:\<second> GMT](#if-unmodified-since-day-name-day-month-year-hourminutesecond-gmt)
    - [If-None-Match: <etag_value>](#if-none-match-etagvalue)
    - [ETag: "<etag_value>"](#etag-%22etagvalue%22)

以下内容均来自于 [MDN](https://developer.mozilla.org/)，只是排列组合方便理解。

缓存是一种保存资源副本并在下次请求时直接使用该副本的技术。当 web 缓存发现请求的资源已经被存储，它会拦截请求，返回该资源的拷贝，而不会去源服务器重新下载。这样带来的好处有：缓解服务器端压力，提升性能(获取资源的耗时更短了)。

# 新鲜度
  由于缓存只有有限的空间用于存储资源副本，所以缓存会定期地将一些副本删除，这个过程叫做缓存驱逐。
  
  当服务器上面的资源进行了更新，那么缓存中的对应资源也应该被更新，由于HTTP是C/S模式的协议，服务器更新一个资源时，不可能直接通知客户端更新缓存，所以双方必须为该资源约定一个过期时间，在该过期时间之前，该资源（缓存副本）就是新鲜的，当过了过期时间后，该资源（缓存副本）则变为陈旧的。
  
  驱逐算法用于将陈旧的资源（缓存副本）替换为新鲜的，注意，一个陈旧的资源（缓存副本）是不会直接被清除或忽略的，当客户端发起一个请求时，缓存检索到已有一个对应的陈旧资源（缓存副本），则缓存会先将此请求附加一个`If-None-Match`头，然后发给目标服务器，以此来检查该资源副本是否是依然还是算新鲜的，若服务器返回了 `304 (Not Modified)`（该响应不会有带有实体信息），则表示此资源副本是新鲜的，这样一来，可以节省一些带宽。若服务器通过 `If-None-Match` 或 `If-Modified-Since`判断后发现已过期，那么会带有该资源的实体内容返回。  

  下面是上述缓存处理过程的一个图示：  
<img src="./images/HTTPStaleness.png" height="500">

## 计算缓存寿命
浏览器会按照下面的顺序来判断缓存是否有效。
1. 是否含有 Cache-control: max-age=N ，缓存的寿命就是N。
2. 是否含有 Expires 属性。如果有则比较Expires的值和Date属性的值来判断是否缓存还有效。
3. 是否含有 Last-Modified 属性。如果有，缓存的寿命就等于Date的值减去Last-Modified的值除以10（注：根据rfc2626其实也就是乘以10%）。

# 表示重定向的响应状态码

## 300 Multiple Choices

是一个用来表示重定向的响应状态码，表示该请求拥有多种可能的响应。用户代理或者用户自身应该从中选择一个。由于没有如何进行选择的标准方法，这个状态码极少使用。  

假如服务器可以提供一个优先选择，那么它应该生成一个  Location 首部。

## 301 Moved Permanently
**永久重定向。**
说明请求的资源已经被移动到了由 Location 头部指定的url上，是固定的不会再改变。搜索引擎会根据该响应修正。

尽管标准要求浏览器在收到该响应并进行重定向时不应该修改http method和body，但是有一些浏览器可能会有问题。所以最好是在应对GET 或 HEAD 方法时使用301，其他情况使用308 来替代301。

## 302 Found
表明请求的资源被暂时的移动到了由Location 头部指定的 URL 上。浏览器会重定向到这个URL， 但是搜索引擎不会对该资源的链接进行更新 (In SEO-speak, it is said that the link-juice is not sent to the new URL)。

即使规范要求浏览器在重定向时保证请求方法和请求主体不变，但并不是所有的用户代理都会遵循这一点，你依然可以看到有缺陷的软件的存在。所以推荐仅在响应 GET 或 HEAD 方法时采用 302 状态码，而在其他时候使用 307 Temporary Redirect 来替代，因为在这些场景下方法变换是明确禁止的。

在确实需要将重定向请求的方法转换为 GET的场景下，可以使用 303 See Other。例如在使用 PUT 方法进行文件上传操作时，需要返回确认信息（例如“你已经成功上传了xyz”）而不是上传的资源本身，就可以使用这个状态码。

## 303 See Other 
通常作为 PUT 或 POST 操作的返回结果，它表示重定向链接指向的不是新上传的资源，而是另外一个页面，比如消息确认页面或上传进度页面。而请求重定向页面的方法要总是使用 GET。

## 304 Not Modified
说明无需再次传输请求的内容，也就是说可以使用缓存的内容。这通常是在一些安全的方法（safe），例如GET 或HEAD 或在请求中附带了头部信息： If-None-Match 或If-Modified-Since。

如果是 200 OK ，响应会带有头部 Cache-Control, Content-Location, Date, ETag, Expires，和 Vary.
> 很多浏览器的 开发者工具 会发出额外的请求，以达到 304 的目的，这样可以把资源以本地缓存的形式展现给开发者。

## 307 Temporary Redirect
临时重定向。是表示重定向的响应状态码，说明请求的资源暂时地被移动到  Location 首部所指向的 URL 上。

原始请求中的请求方法和消息主体会在重定向请求中被重用。在确实需要将重定向请求的方法转换为  GET 的场景下，可以考虑使用 303 See Also 状态码。例如在使用 PUT 方法进行文件上传操作时，需要返回确认信息（例如“你已经成功上传了xyz”）而不是上传的资源本身，就可以使用这个状态码。

状态码 307 与 302 之间的唯一区别在于，当发送重定向请求的时候，307 状态码可以确保请求方法和消息主体不会发生变化。当响应状态码为 302 的时候，一些旧有的用户代理会错误地将请求方法转换为 GET：使用非 GET 请求方法而返回 302 状态码，Web 应用的运行状况是不可预测的；而返回 307 状态码时则是可预测的。对于 GET 请求来说，两种情况没有区别。

## 308 Permanent Redirect
**永久重定向。**

是表示重定向的响应状态码，说明请求的资源已经被永久的移动到了由 Location 首部指定的 URL 上。浏览器会进行重定向，同时搜索引擎也会更新其链接（用 SEO 的行话来说，意思是链接汁被传递到了新的 URL）。

在重定向过程中，请求方法和消息主体不会发生改变，然而在返回 301 状态码的情况下，请求方法有时候会被客户端错误地修改为 GET 方法。


# 与缓存相关的消息头

## 缓存控制
### Cache-control

 Cache-Control 头是HTTP/1.1定义的，通过它提供的不同的值来定义缓存策略，请求头和响应头都支持这个属性。
 
  - __Cache-Control: no-store__  
  禁止进行缓存。每次由客户端发起的请求都会下载完整的响应内容。

  - __Cache-Control: no-cache__  
  强制确认缓存。每次有请求发出时，缓存会将此请求发到服务器（译者注：该请求应该会带有与本地缓存相关的验证字段），服务器端会验证请求中所描述的缓存是否过期，若未过期（注：实际就是返回304），则缓存才使用本地缓存副本。
  
  - __Cache-Control: private__  
  表示该响应是专用于某单个用户的，中间人不能缓存此响应，该响应只能应用于浏览器私有缓存中。

  - __Cache-Control: public__  
  "public" 指令表示该响应可以被任何中间人（比如中间代理、CDN等）缓存。若指定了"public"，则一些通常不被中间人缓存的页面（因为默认是private）（比如 带有HTTP验证信息（帐号密码）的页面 或 某些特定状态码的页面），将会被其缓存。

  - __Cache-Control: max-age=\<seconds>__  
  表示资源能够被缓存（保持新鲜）的最大时间（距离请求发起的时间的秒数）。

  - __Cache-Control: must-revalidate__  
  缓存在考虑使用一个陈旧的资源时，必须先验证它的状态，已过期的缓存将不被使用。

### Pragma: no-cache
与 Cache-Control: no-cache 效果一致。
是一个在 HTTP/1.0 中规定的通用首部。由于 Pragma 在 HTTP 响应中的行为没有确切规范，所以不能可靠替代 HTTP/1.1 中通用首部 Cache-Control，尽管在请求中，假如 Cache-Control 不存在的话，它的行为与 Cache-Control: no-cache 一致。建议只在需要兼容 HTTP/1.0 客户端的场合下应用 Pragma 首部。

### Expires: <http-date>
Expires 响应头包含日期/时间， 即在此时候之后，响应过期。无效的日期，比如 0, 代表着过去的日期，即该资源已经过期。如果在Cache-Control响应头设置了 "max-age" 或者 "s-max-age" 指令，那么 Expires 头会被忽略。
> Expires: Wed, 21 Oct 2015 07:28:00 GMT

## 其他

### Date: \<day-name>, \<day> \<month> \<year> \<hour>:\<minute>:\<second> GMT
是一个通用首部，其中包含了报文创建的日期和时间。

### Age: \<delta-seconds>
Age 消息头里包含消息对象在缓存代理中存贮的时长，以秒为单位。.

Age消息头的值通常接近于0。表示此消息对象刚刚从原始服务器获取不久；其他的值则是表示代理服务器当前的系统时间与此应答消息中的通用消息头 Date 的值之差。

### Last-Modified:  \<day-name>, \<day> \<month> \<year> \<hour>:\<minute>:\<second> GMT
Last-Modified  是一个响应首部，其中包含源头服务器认定的资源做出修改的日期及时间。 它通常被用作一个验证器来判断接收到的或者存储的资源是否彼此一致。由于精确度比  ETag 要低，所以这是一个备用机制。包含有  If-Modified-Since 或 If-Unmodified-Since 首部的条件请求会使用这个字段。

### If-Modified-Since: \<day-name>, \<day> \<month> \<year> \<hour>:\<minute>:\<second> GMT
是一个条件式请求首部，服务器只在所请求的资源在给定的日期时间之后对内容进行过修改的情况下才会将资源返回，状态码为 200  。如果请求的资源从那时起未经修改，那么返回一个不带有消息主体的  304  响应，而在 Last-Modified 首部中会带有上次修改时间。 不同于  If-Unmodified-Since, If-Modified-Since 只可以用在 GET 或 HEAD 请求中。

当与 If-None-Match 一同出现时，它（If-Modified-Since）会被忽略掉，除非服务器不支持 If-None-Match。

最常见的应用场景是来更新没有特定 ETag 标签的缓存实体。

### If-Unmodified-Since: \<day-name>, \<day> \<month> \<year> \<hour>:\<minute>:\<second> GMT 
用于请求之中，使得当前请求成为条件式请求：只有当资源在指定的时间之后没有进行过修改的情况下，服务器才会返回请求的资源，或是接受 POST 或其他 non-safe 方法的请求。如果所请求的资源在指定的时间之后发生了修改，那么会返回 412 (Precondition Failed) 错误。

常见的应用场景有两种：

- 与 non-safe 方法如 POST 搭配使用，可以用来优化并发控制，例如在某些wiki应用中的做法：假如在原始副本获取之后，服务器上所存储的文档已经被修改，那么对其作出的编辑会被拒绝提交。
- 与含有 If-Range 消息头的范围请求搭配使用，用来确保新的请求片段来自于未经修改的文档。

### If-None-Match: <etag_value>
> If-None-Match: <etag_value>  
> If-None-Match: <etag_value>, <etag_value>,...  
> If-None-Match: *  

是一个条件式请求首部。对于 GET 和 HEAD 请求方法来说，当且仅当服务器上没有任何资源的 ETag 属性值与这个首部中列出的相匹配的时候，服务器端会才返回所请求的资源，响应码为  200  。对于其他方法来说，当且仅当最终确认没有已存在的资源的  ETag 属性值与这个首部中所列出的相匹配的时候，才会对请求进行相应的处理。

对于  GET 和 HEAD 方法来说，当验证失败的时候，服务器端必须返回响应码 304 （Not Modified，未改变）。对于能够引发服务器状态改变的方法，则返回 412 （Precondition Failed，前置条件失败）。需要注意的是，服务器端在生成状态码为 304 的响应的时候，必须同时生成以下会存在于对应的 200 响应中的首部：Cache-Control、Content-Location、Date、ETag、Expires 和 Vary 。

ETag 属性之间的比较采用的是弱比较算法，即两个文件除了每个比特都相同外，内容一致也可以认为是相同的。例如，如果两个页面仅仅在页脚的生成时间有所不同，就可以认为二者是相同的。

当与  If-Modified-Since  一同使用的时候，If-None-Match 优先级更高（假如服务器支持的话）。

以下是两个常见的应用场景：

- 采用 GET 或 HEAD  方法，来更新拥有特定的ETag 属性值的缓存。
- 采用其他方法，尤其是  PUT，将 If-None-Match used 的值设置为 * ，用来生成事先并不知道是否存在的文件，可以确保先- 前并没有进行过类似的上传操作，防止之前操作数据的丢失。这个问题属于更新丢失问题的一种。


### ETag: "<etag_value>"

> ETag: W/"<etag_value>"       --- ('W/'(大小写敏感) 表示使用弱验证器)  
> 
> ETag: "<etag_value>"


ETag HTTP响应头是资源的特定版本的标识符。这可以让缓存更高效，并节省带宽，因为如果内容没有改变，Web服务器不需要发送完整的响应。而如果内容发生了变化，使用ETag有助于防止资源的同时更新相互覆盖（“空中碰撞”）。

如果给定URL中的资源更改，则一定要生成新的Etag值。 因此Etags类似于指纹，也可能被某些服务器用于跟踪。 比较etags能快速确定此资源是否变化，但也可能被跟踪服务器永久存留。
