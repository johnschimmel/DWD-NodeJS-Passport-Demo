# ExpressJS w/ Passport Local + Mongo

## What it is

ExpressJS is a microframework for NodeJS. It is very similiar to Ruby's Sinatra and Python's Flask. Express can help you get a basic HTTP web server running but also make organizing your code and design with templates, manage user sessions, connect to databases and provide authentication. 

While ExpressJS does not do everything, it is great for the small apps that need very basic functionality. 

* ExpressJS website - [http://expressjs.com/](http://expressjs.com/)
* Hogan-Express repo - [https://github.com/vol4ok/hogan-express](https://github.com/vol4ok/hogan-express)

### Passport - simple authentication

<http://passportjs.org/>

Passport provides user authentication with username, password or many popular third party single signon solutions like Facebook and Google.

Almost all of Passport's configuration and setup takes place in four files

* **.env** - 
	* we add a new environment variable called **COOKIEHASH** and put some random numbers and letters that will be a hash to encrpyt our cookies.
	* You must add this has to your Heroku app's config

			heroku config:add COOKIEHASH=MY_SECRET_HASH

* **app.js** - 
	* Configure Passport to use Passport Local Strategy.
	* Use new module 'connect-mongo' to store out sessions in MongoDB.
	* Define our registration, log in and log out routes.
	* Lock down routes using **account.ensureAuthenticated**.
* **/models/user.js**
	* Uses Passport Local Mongoose plugin to store User schema in MongoDB.
	* **This file can be copied directly into your /models directory.**
* **/routes/account.js**
	* Registration, Log in, Log out routes handled here.
	* **This file can be copied directly into your /routes directory.**



### Package.json

The **package.json** file defines the name of our NodeJS app and any dependencies that are needed. 

**package.json**

	{
	  "name": "dwd-nodejs-passportjs",
	  "version": "0.0.1",
	  
	  "dependencies": {
	    "express": "3.0.0rc5",
	    "hogan-express" : "0.3.3",
	    "mongoose" : "3.5.4",
	    "moment" : "1.7.2",
	    "passport": "0.1.x",
	    "passport-local": "0.1.x",
	    "passport-local-mongoose": "0.2.0",
	    "connect-mongodb" : "1.1.5"
	  },

	  "engines" : {
	    "node" : "0.8.x",
	    "npm" : "1.1.x"
	  }
	}

### Passport Configuration

Inside app.js, three new modules are used in app.js

* Passport  / passport
* Passport Local / localStrategy
* Connect-Mongo / mongoStore

#### Initialize Sessions & Cookies

	// TURN ON COOKIES
	// COOKIEHASH in your .env file (must be available on heroku)
	app.use(express.cookieParser(process.env.COOKIEHASH));

	// STORE SESSION IN MONGODB
	// mongoStore for session storage is using the connect-mongodb module
	app.use(express.session({ 
	    store: new mongoStore({url:process.env.MONGOLAB_URI}),
	    maxAge: 300000,
	    secret: process.env.COOKIEHASH
	  })
	);


#### Initalize Passport

	// TURN ON PASSPORT AUTHENTICATION MODULE
	app.use(passport.initialize());
	app.use(passport.session());

	// PREPARE User module - set up models
	var User = require('./models/user.js');

	// Configure passport to use Passport Local strategy
	passport.use(new LocalStrategy(User.authenticate()));
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());

### /models/user.js

The User model uses Passport Local Mongoose plugin, this includes username, email, password. Additional fields can be included in the User schema, like birthdate, favorite_color or whatever you need.

This file is ready to be used, just copy it into your /models directory.

### /routes/accounts.js

Accounts.js manages all the registration /register, log in /login and logout /logout requests. App.js defines a login post to use **passport.authenticate('local')**.

### /routes/index.js 

Index.js includes /models/user.js to associate a user to a blog post. 

### MongoDB 

This site uses a MongoDB database from MongoLab (one of Heroku's AddOns).

Create a **.env** file with the following contents. Save it to your web app's root directory.

	MONGOLAB_URI=YOUR MONGODB:// CONNECTION STRING HERE
	COOKIEHASH=RANDOM_WORDS_NUMBERS_FOR_HASH


## HEROKU

Install Heroku's Toolbelt, this will give you access to Heroku and the Foreman tool to start and stop your app. Download here, <https://toolbelt.heroku.com/>

## USAGE

### First things first

First time running the code you need to install the required modules that are defined in **package.json**. Navigate to the code directory in Terminal. Install all dependencies by running the following command.
	
	npm install

You only need to run this code once, every time you update **package.json**.

### Start the server

Navigate to code directory in Terminal: 
	
	foreman start

If successful, your Terminal window will read... 

> Server started on port 5000

### View the webpages

Open Web Browser and navigate to [http://localhost:5000](http://localhost:5000)

Available URLs 

* [http://localhost:5000/](http://localhost:5000)


### Stopping the server (CTRL+C)

You must manually stop the NodeJS in the Terminal window that is running the script. 

If the Terminal window, stop the script with **CTRL+C**

