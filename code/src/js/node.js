
var http = require('http');
var hello = ''
for (let i = 0; i < 1024 * 10; i++) {
  hello += 'a'
}
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end(hello);
}).listen(8088);

console.log('Server running at http://127.0.0.1:8088/');





