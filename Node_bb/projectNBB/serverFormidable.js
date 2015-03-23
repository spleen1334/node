// NOVI SERVER ZA UPLOAD FILEOVA
// NODE-FORMIDABLE = 3RD PARTY MODUL

var formidable = require('formidable'),
	http = require('http'),
	sys = require('sys'); // NODE MODULE UTIL(preimenovan je)

http.createServer(function(req,res) {
	if(req.url == '/upload' && req.method.toLowerCase() == 'post') {
		var form = new formidable.IncomingForm(); // formidable- Form = abstraction submitovanih vrednosti
		// koje koristimo da bi ih filtrirali za request obj( uz pomoc parse)
		form.parse(req, function(error, fields, files) {
			res.writeHead(200, {'content-type': 'text/plain'});
			res.write('received upload:\n\n');
			// sys.inspect = prikazuje obj kao string
			res.end(sys.inspect({fields: fields, files: files}));
		});
		return;
	}

	// U SLUCAJU DA JE URL NIJE UPLOAD, vrati formu za upload
	res.writeHead(200, {'content-type': 'text/plain'});
	res.end(
		'<form action="/upload" enctype="multipart/form-data" ' +
		'method="post">' +
		'<input type="text" name="title"><br>' +
		'<input type="file" name="upload" multiple="multiple"><br>' +
		'<input type="submit" value="Upload">' +
		'</form>'
		);
}).listen(8888);