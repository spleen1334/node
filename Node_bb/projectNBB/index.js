// MAIN APP
// require - slicno kao i u PHP

var server = require("./server"); // .js se podrazumeva pa nemora extenzija
var router = require("./router"); // router
var requestHandlers = require("./requestHandlers");

// REQ HANDLERI
// kreiramo assoc_array za razlicite URL
var handle        = {};
handle["/"]       = requestHandlers.start;
handle["/start"]  = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show; // novi req handler show()

// Upotreba funkcije start iz server.js
server.start(router.route, handle);

