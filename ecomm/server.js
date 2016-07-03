// DEPENDENCIES
var express = require('express');

// Helper
var bodyParser = require('body-parser');
var morgan  = require('morgan');

// DB
var mongoose = require('mongoose');

// Templates
var ejs = require('ejs');
var ejsMate = require('ejs-mate');

// Session, cookie, flash msg
var session = require('session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session); // save session in db

// Authentication
var passport = require('passport');

// MODELS
var User = require('./models/user.js');
var Category = require('./models/category');

// CONFIG
var app     = express();
var config = require('./config/config.js');

// Midleware (ours)
var cartLength = require('./middlewares/middlewares.js');

// DB
mongoose.connect(config.database, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to DB');
    }
});

// MIDDLEWARE
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // form uploads

app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret,
    store: new MongoStore({ url: secret.database, autoReconnect: true })
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// MIDDLEWARE ROUTE SETUP
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// MIDDLEWARE (CART)
app.use(cartLength);

app.use(function(req, res, next) {
    Category.find({}, function(err, categories) {
        if(err) { return next(err); }

        res.locals.categories = categories;
        next();
    });
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// ROUTES
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./router/admin');
var apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);


// SERVER
app.listen(config.PORT, function(err) {
    if(err) { throw err; }
    console.log('Server is running on port: ' + config.PORT);
});
