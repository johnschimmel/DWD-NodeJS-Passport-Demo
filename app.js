
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
    store: new mongoStore({url:process.env.MONGOLAB_URI, maxAge: 300000})
    , secret: process.env.COOKIEHASH
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
app.get('/', routes.index);
app.get('/notes/:urltitle', routes.notes);
app.get('/page/:pageslug', routes.pagedisplay);

// admin routes
var admin = require('./routes/admin.js');
app.get('/admin',admin.ensureAuthenticated, admin.main);

app.get('/admin/entry',admin.ensureAuthenticated, admin.create_note);
app.get('/admin/edit/:documentid', admin.ensureAuthenticated, admin.edit_note_get);
app.post('/admin/edit', admin.ensureAuthenticated, admin.edit_note_post);

app.get('/admin/page_entry', admin.ensureAuthenticated, admin.page_entry);
app.get('/admin/page_edit/:documentid', admin.ensureAuthenticated, admin.page_edit);
app.post('/admin/page_edit', admin.ensureAuthenticated, admin.page_edit_post);

// login, logout, register functions
app.get('/admin/login',admin.login);
app.post('/admin/login',passport.authenticate('local'), admin.login_post);
app.get('/admin/logout', admin.logout);
// app.get('/admin/register', admin.register);
// app.post('/admin/register', admin.register_post);


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);

});
