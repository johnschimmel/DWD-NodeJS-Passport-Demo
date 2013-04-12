
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongodb')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  
var app = express();

// Express app configuration 
app.configure(function(){

  // database
  app.db = mongoose.connect(process.env.MONGOLAB_URI);

  //  templates directory
  app.set('views', __dirname + '/views');

  // setup template engine - we're using Hogan-Express
  // https://github.com/vol4ok/hogan-express
  app.set('view engine', 'html');
  app.set('layout','layout');
  app.engine('html', require('hogan-express'));

  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  // css, images and js
  app.use(express.static(path.join(__dirname, 'public')));

});

// COOKIEHASH in your .env file (also share with heroku)
app.use(express.cookieParser(process.env.COOKIEHASH));

//SESSION + connect-mongo mongoStore for session storage
app.use(express.session({ 
    store: new mongoStore({url:process.env.MONGOLAB_URI}),
    maxAge: 300000,
    secret: process.env.COOKIEHASH
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.configure('development', function(){
  app.use(express.errorHandler());
});

// set up models
var User = require('./models/user.js');

// Configure passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// public routes
var routes = require('./routes/index.js');

// route file for login, register and logout
var account = require('./routes/account.js');

app.get('/', routes.index);
app.get('/user/:username', routes.user_posts);

// create a blog post
app.get('/write', account.ensureAuthenticated, routes.write);
app.post('/write', account.ensureAuthenticated, routes.write_post);

// edit a blog post
app.get('/edit/:blog_id', account.ensureAuthenticated, routes.edit);
app.post('/edit/:blog_id', account.ensureAuthenticated, routes.edit_post);

// login
app.get('/login', account.login);
app.post('/login', passport.authenticate('local'), account.login_post);

// register
app.get('/register', account.register);
app.post('/register', account.register_post);

// logout
app.get('/logout', account.logout);



// Turn the server on!
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
