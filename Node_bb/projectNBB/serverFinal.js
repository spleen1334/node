// FINALNA VERZIJA
// izbaceni postData elementi, kao i request handleri
// request.setEncoding - ce biti upravljan uz pomoc formidable
// request je prosledjen routeru

var http = require("http");
var url = require("url"); // URL Modul

function start(route, handle) { // route() iz router.js, handle = asoc_array iz index(url)
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    reoute(handle, pathname, response, request);
  }

	http.createServer(onRequest).listen(8888);
	console.log("Server has started");

}

exports.start = start;


