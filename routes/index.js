var express = require('express');
var passport = require('passport');
var peprResGlobals = require('../own/pepr-res-globals.js');
var router = express.Router();
// Simple route middleware to ensure user is authenticated.
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/signup');
}

/* GET home page. */
router.get('/', function (req, res, next) {
  peprResGlobals(req, res);
  res.render('index');
});
/* GET home page. */
router.get('/index', function (req, res, next) {
  peprResGlobals(req, res);
  res.render('index');
});
/* GET Hello World page. */
router.get('/ui', isAuthenticated, function (req, res) {
  peprResGlobals(req, res);
  res.render('ui');
});

/* GET Userlist page. */
router.get('/userlist', function (req, res) {
  var db = req.db;
  console.log(req.db);
  var collection = db.get('usercollection');
  collection.find({}, {}, function (e, docs) {
    res.render('userlist', {
      "userlist": docs
    });
  });
});

/* GET New User page. */
router.get('/newuser', function (req, res) {
  res.render('newuser', {title: 'Add New User'});
});

/* POST to Add User Service */
router.post('/adduser', function (req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;

  // Set our collection
  var collection = db.get('usercollection');

  // Submit to the DB
  collection.insert({
    "username": userName,
    "email": userEmail
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    } else {
      // And forward to success page
      res.redirect("userlist");
    }
  });
});

//displays our signup page
router.get('/login', function (req, res) {
  peprResGlobals(req, res);
  res.render('login');
});

//displays our signup page
router.get('/signup', function (req, res) {
  peprResGlobals(req, res);
  res.render('register');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup'
}));

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function (req, res) {
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  req.peprFlash('info' , 'You are successfully logged out!');
  res.redirect('/');
});

module.exports = router;

