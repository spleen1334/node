var express = require('express');
var handlebars = require('express-handlebars')
    .create({ defaultLayout: 'main' });

/**** LIB ****/
var fortune = require('./lib/fortune.js');


var app = express();

/**** SETUP ****/
app.set('port', process.env.PORT || 3000);
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


/****** TMP ******/

/**** STATIC RESOURCES MIDDLEWARE ****/
app.use(express.static(__dirname + '/public'));

/**** TESTING ****/
app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

/**** ROUTES ****/
app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function(req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res) {
    res.render('tours/request-group-rate');
});


/**** MIDDLEWARE ****/
// 404
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

// 500
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


/**** SERVER ****/
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
                app.get('port') + '; press Ctrl+C to terminate.');
});
