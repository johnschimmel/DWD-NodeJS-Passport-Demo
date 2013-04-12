# ExpressJS w/ templates

## What it is

ExpressJS is a microframework for NodeJS. It is very similiar to Ruby's Sinatra and Python's Flask. Express can help you get a basic HTTP web server running but also make organizing your code and design with templates, manage user sessions, connect to databases and provide authentication. 

While ExpressJS does not do everything, it is great for the small apps that need very basic functionality. 

* ExpressJS website - [http://expressjs.com/](http://expressjs.com/)
* Hogan-Express repo - [https://github.com/vol4ok/hogan-express](https://github.com/vol4ok/hogan-express)

### Package.json

The **package.json** file defines the name of our NodeJS app and any dependencies that are needed. 

**package.json**

	{
	  "name": "itpdwdspring2013",
	  "version": "0.0.1",
	  
	  "dependencies": {
	    "express": "3.0.0rc5",
	    "hogan-express" : "0.3.3",
	    "passport": "0.1.x",
	    "passport-local": "0.1.x",
	    "passport-local-mongoose": "0.2.0",
	    "mongodb" : "1.2.9",
	    "mongoose" : "3.5.4",
	    "forms" : "0.1.3",
	    "markdown" : "0.4.0",
	    "moment" : "1.7.2",
	    "async" : "0.1.x"
	  },

	  "engines" : {
	    "node" : "0.8.x",
	    "npm" : "1.1.x"
	  }
	}

### Templates & /views directory

Templates are great. They keep your code and your design separate. In code you pass data variables into a template which is rendered into HTML, RSS, XML or whatever. The code is in one file, **app.js** and the template will be in another **/views/index.html**.

### hogan-express template engine

Hogan-express is one template engine, EJS and Jade are others. Hogan-express will allow us to not only separate code and design but divide the design into a layout (header/footer) and content page.

In /views, there are three files

* /views/layout.html - this is the Header and Footer of the website
* /views/index.html - this is our main page template
* /views/page2.html - this is a slightly modified version of index.html

### Using Templates

ExpressJS needs to get a little configured

	//  templates directory
	app.set('views', __dirname + '/views');

	// setup template engine - we're using Hogan-Express
	// https://github.com/vol4ok/hogan-express
	app.set('view engine', 'html');
	app.set('layout','layout');
	app.engine('html', require('hogan-express'));

Route with template data and rendering. The main page '/' when requested will create a JavaScript object called templateData with two properties, content and title. The templateData object will get passed into the template for rendering.

To display the template, the command res.render(templateName, templateData) is used.

	app.get('/', function(req, res) {
		var templateData = {
			content : 'Hello World',
			title : 'ExpressJS Demo'
		}
		res.render('index', templateData);
	});

### Layouts

Layouts are confusing but helpful. 

When configured, ExpressJS will allow a layout to automatically 'wrap' around a rendered template page. Layout.html contains a {{{ yield }}} variable. 

When **res.render('index')** is executed, **index** is rendered first then passed into the **layout.html** template. The contents of the first rendering, **index.html**, are yielded into **layout.html**

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

