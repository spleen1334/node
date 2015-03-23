// NAJPROSTIJI SERVER NODE

// require = ucitavanje MODULA
// ovde je to http modul
var http = require('http');

// HTTP - MODUL OBJEKAT
// createServer(requestListener)
// event: request
// svaki put kad postoji http request, aktivira se funkcija()
// request = http.IncomingMessage (poruka od clienta)
// response = http.ServerResponse (poruka servera)
http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello Node Server!");
  response.end();
}).listen(8888);


// HTTP RESPONSE MESSAGE:
// HTTP/1.1 200 OK
// Content-Type: text/plain
// Date: Mon, 05 May 2014 20:15:25 GMT
// Connection: keep-alive
// <-ovde ide Message Body(optional)

// createServer = funkcija koja vraca objekat koji sadrzi method .listen(port)
