var http = requre('http');
var xml2js = require('xml2js');
var parser = xml2js.Parser({
    explicitArray: false
});

var goodreadService = function() {

    var getBookById = function(id, callback) {

        var options = {
            host: 'www.goodreads.com',
            path: '/book/show/' + id  + '?format=xml&key=123123123'
        };

        var callbackHttp = function(response) {
            var str = '';

            response.on('data', function(chunk) {
                str += chunk;
            });

            response.on('end', function() {
                console.log(str);
                parser.parseString(str, function(err, result) {
                    callback(null, result.GoodreadsResponse.book);
                });
            });
        };

        http.request(options, callbackHttp).end();
    };

    return {
        getBookById: getBookById
    };
};

module.exports = goodreadService;
