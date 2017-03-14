var express = require('express');
var session = require('express-session');
var path = require('path');
// var stylus = require('stylus');
// var nib = require('nib');
// var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// config
var config = require('./own/config.js'); //config file contains all tokens and other private info
var peprGlobals = require('./own/pepr-globals.js');

// Own Modules
var peprFlash = require('./own/pepr-flash.js'); //funct file contains our helper functions for our Passport and database work


// DataBase
// var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://' + config.mongodbHost + ':' + config.mongodbPort + '/' + config.mongodbBase);
const User = db.get('auth');

// Sesssion is saved in Mongo
var MongoStore = require('connect-mongo')(session);

// passport (Auth)
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// passport Reg-Functions
var peprPassport = require('./own/passport.js'); //funct file contains our helper functions for our Passport



var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

//===============SESSION===============
// Das sollte vor passport stehen
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// SESSION Handling stored in Mongo Database
var sessionOptions = {
  cookie: {maxAge: config.cookieMaxAge},
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({url: 'mongodb://' + config.mongodbHost + ':' + config.mongodbPort + '/' + config.mongodbSession})
};
app.use(session(sessionOptions));

//===============FLASH==================
app.use(peprFlash());

//===============PASSPORT===============
app.use(passport.initialize());
app.use(passport.session());
// Passport session setup.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

//===============JADE===============
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



//===============DEBUG===============
app.use(logger('dev'));

//===============BODY PARSER===============
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

//===============MONGODB===============
// Make our db accessible to our router
app.use(function (req, res, next) {
  req.db = db;
  next();
});
// session Clicks auf 0 setzen, wenn noch nicht vorhanden
app.use(function (req, res, next) {
  if (!req.session.clicks) {
    req.session.clicks = 0;
  }
  next();
});

//==============GLOBALS==================
// Hier werden globale Variablen gesetzt 
// z.B. ob jemand eingeloggt is
app.use(function (req, res, next) {
  Object.assign(app.locals, peprGlobals);
  next();
});


app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//===============PASSPORT=================
// Use the LocalStrategy within Passport to login/"signin" users.
passport.use('local-signin', new LocalStrategy({
          passReqToCallback: true
        }, //allows us to pass back the request to the callback
        function (req, username, password, done) {
          peprPassport.localAuth(username, password)
                  .then(function (user) {
                    if (user) {
                      console.log("LOGGED IN AS: " + user.username);
                      req.peprFlash('info' , 'You are successfully logged in ' + user.username + '!');
                      done(null, user);
                    }
                    if (!user) {
                      console.log("COULD NOT LOG IN");
                      req.peprFlash('error' , 'Could not log user in. Please try again.'); //inform user could not log them in
                      done(null, user);
                    }
                  })
                  .fail(function (err) {
                    console.log(err.body);
                  });
        }
));
// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy(
        {passReqToCallback: true}, //allows us to pass back the request to the callback
        function (req, username, password, done) {
          peprPassport.localReg(username, password, req)
                  .then(function (user) {
                    if (user) {
                      console.log("REGISTERED: " + user.username);
                      req.peprFlash('info' , 'You are successfully registered and logged in ' + user.username + '!');
                      done(null, user);
                    }
                    if (!user) {
                      console.log("COULD NOT REGISTER");
                      req.peprFlash('error' , 'That username is already in use, please try a different one.'); //inform user could not log them in
                      done(null, user);
                    }
                  })
                  .fail(function (err) {
                    console.log(err.body);
                  });
        }
));


module.exports = app;
