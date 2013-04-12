var moment = require("moment");
var passport = require("passport");

//models
var User = require('../models/user.js');


exports.ensureAuthenticated = function(req, res, next) {
    console.log("is Authenticated:" + req.isAuthenticated());
    
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

// Login display
exports.login = function(req, res) {
	templateData = {
		user:req.user,
	}

	res.render('account/login.html', templateData);
};

// Login post
exports.login_post = function(req, res) {
	res.redirect('/write');
};

// logout
exports.logout = function(req, res) {
	req.logout();
    res.redirect('/');
};

exports.register = function(req, res) {
    res.render('account/register.html', { });
};

exports.register_post = function(req, res) {

	if (req.body.password != req.body.confirm) {
		return res.render('account/register.html');
	} else {

        User.register(new User({ username : req.body.username }), req.body.password, function(err, new_user) {
            if (err) {
                return res.render('account/register.html');
            }
            console.log("**********");
            console.log(new_user);
            res.redirect('/write');
        });
    }
};
