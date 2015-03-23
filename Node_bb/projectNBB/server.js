// EXPORT
// omogucava koriscenje funkionalnosti neke scripte u raznim fajlovima
// kao neka vrsta include
// Omogucava pravljenje CUSTOM MODULE

var http = require("http");
var url = require("url"); // URL Modul

// Sve se stavlja u funkciju start(), radi exporta
function start(route, handle) { // route() iz router.js, handle = asoc_array iz index(url)
  function onRequest(request, response) {
  	// podaci za slanje
  	var postData = "";
    // parse uzima vrednost URL od http requesta
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    request.setEncoding("utf8");


    request.addListener("data", function(postDataChunk) {
    	postData += postDataChunk;
    	console.log("Received POST data chunk '" + postDataChunk + "'.");
    });

    request.addListener("end", function() {
    	route(handle, pathname, response, postData);
    });

    // PREBACENI RESPONSE U ROUTER
    // route(handle, pathname, response); // prebaceno u addListener

    // premesteno u router.js
    // response.writeHead(200, {"content-type": "text/plain"});
    // response.write("Hello Node!");
    // response.end();

    // premesteno u start funkciju
		http.createServer(onRequest).listen(8888);
		console.log("Server has started");
  }

}

// ovo exportuje start() da bi se mogla koristiti i u dr fajlovima
exports.start = start;


