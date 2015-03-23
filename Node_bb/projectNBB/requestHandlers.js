// REQUEST HANDLERS
// ovde se izvrsavaju operacije nad route-ovanim URL

// var exec = require("child_process").exec;
// querystring = modul za querystringove (http requestovi iz npr formi)
var querystring = require("querystring");
var fs = require("fs"); // fs = filesystem module
var formidable = require("formidable"); // file upload 3rd party modul

// DODATI response parametri

function start(response, postData) {
		console.log("Request handler 'start' was called.");

		var body = '<html>'+
			'<head>' + '<meta http-equiv="content-type" content="text/html"' +
			'charset=UTF-8" />' +
			'</head>' +
			'<body>' +
			'<form action="/upload" enctype="multipart/form-data" method="post">' +
			'<input type="file" name="upload" />' +
			'<input type="submit" value="Upload file" />' +
			'</form>' +
			'</body>' +
			'</html>';

		response.writeHead(200, {"content-type": "text/html"});
		response.write(body);
		response.end();

		// EXEC primer
	/*	exec("ls -lah",
			// { timeout: 10000, maxBuffer: 20000*1024 }, // test da li blokira
			function(error, stdout, stderr) {
		    response.writeHead(200, {"content-type": "text/plain"});
		    response.write(stdout);
		    response.end();
		);*/
}

function upload(response, request) { // izbacen postData parametar FINAL
/*	console.log("Request handler 'upload' was called.");
	response.writeHead(200, {"content-type": "text/plain"});
	response.write("You've sent the text: " + querystring.parse(postData).text); // konvertuje query stringove u obj
	response.end();*/

	// FINAL
	console.log("Request handler 'upload' was called.");

	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");

		// ZBOG WIN, onemogucava da se rename file na vec postojeci file
		// pa se prvo brise fajl pa onda vrsi rename
		fs.rename(files.upload.path, "/tmp/test.png", function (error) {
			if (error) {
				fs.unlink("/tmp/test.png");
				fs.rename(files.upload.path, "/tmp/test.png");
			}
		});

		response.writeHead(200, {"content-type": "text/html"});
		response.write("received image: <br/>");
		response.write("<img src='/show' />");
		response.end();
	}); 
}

function show (response, postData) {
	console.log("Request handler 'show' was called.");

	fs.readFile("/tmp/test.png", "binary", function(error, file) {
		if (error) {
			response.writeHead(500, {"content-type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"content-type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});

}

exports.start = start;
exports.upload = upload;
exports.show = show;

////////////////////
// BLOCKING PRIMER
////////////////////

// TEST: 
// otvoriti localhost/upload & localhost/start u 2 razlicita prozora
// REZULTAT:
// start se ucitava 10s, ali upload je blokiran i on se ucitava 10s
// RAZLOG:
// sleep() blokira node server, i nista drugo se nemoze izvrsiti dok se ne zavrsi
// sleep() process

/*function start() {
  console.log("Request handler 'start' was called.");

  function sleep(milliSeconds) {
  	var startTime = new Date().getTime();
  	while (new Date().getTime() < startTime + milliSeconds);
  }

  sleep(10000); // 10s
  return "Sleep test";
}

function upload() {
  console.log("Request handler 'upload' was called.");
  return "Hello Upload";
}

exports.start = start;
exports.upload = upload;*/


////////////////////
// NON-BLOCKING PRIMER
////////////////////

// TEST: 
// otvoriti localhost/start
// REZULTAT:
// umesto da izbaci rezultat ls -lah, on prikazuje empty
// RAZLOG:
// zbog toga sto je exec() nonblocking on ne stigne da se izvrsi
// pre return content, i zbog toga content nije promenjen; (return je blocking)
// exec je async ali ostatak koda je sync

// child_process = novi node modul
// on sadrzi non-blocking method - exec() 
// exec() = omogucava izvrsavanje shell komandi

/*var exec = require("child_process").exec;

function start() {
  console.log("Request handler 'start' was called.");
  var content = "empty";

  exec("ls -lah", function(error, stdout, stderr) {
  	content = stdout;
  }

  return content;
}

function upload() {
  console.log("Request handler 'upload' was called.");
  return "Hello Upload";
}

exports.start = start;
exports.upload = upload;*/
