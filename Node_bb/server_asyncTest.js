// REWRITOVAN PRIMER SERVERA
// Radi lakse demonstracije async
var http = require("http");

function onRequest(request, response) {
  console.log("Request received.");
  response.writeHead(200, {"content-type": "text/plain"});
  response.write("Hello Node!");
  response.end();
}

http.createServer(onRequest).listen(8888);

console.log("Server has started");
