var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

var app = express();

/*** SETUP ***/
var PORT = process.env.PORT || 5000;

/*** VARS ***/
var nav = [{
    Link: '/Books',
    Text: 'Book'
}, {
    Link: '/Authors',
    Text: 'Authors'
}];

/*** MIDDLEWARE ***/
app.use(express.static('public'));

// Parse request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Session / Cookie
app.use(cookieParser());
app.use(session({
    secret: 'libapp'
}));

// Authentification / Passport
require('./src/config/passport.js')(app);

// View setup
app.set('views', './src/views');
app.set('view engine', 'ejs');


/*** ROUTES ***/
var bookRouter = require('./src/routes/bookRoutes.js')(nav);
var adminRouter = require('./src/routes/adminRoutes.js')(nav);
var authRouter = require('./src/routes/authRoutes.js')(nav);

app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);

app.get('/', function(req, res) {
    res.render('index', {
        title: 'Route Hello!',
        nav: nav
    });
});

/*** SERVER ***/
app.listen(PORT, function(err) {
    console.log('Server running on: ' + PORT);
});
