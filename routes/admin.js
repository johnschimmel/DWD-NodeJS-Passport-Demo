var md = require( "markdown" );
var moment = require("moment");
var passport = require("passport");
var async = require("async");

var forms = require('forms'),
	fields = forms.fields,
	validators = forms.validators,
	widgets = forms.widgets;

//models
var ClassNote = require('../models/classnote.js');
var Page = require('../models/page.js');
var User = require('../models/user.js');

// Forms
var notes_entry_form = forms.create({
	title: fields.string({required: true}),
	urltitle: fields.string({required: true,label:'URL Slug'}),
	classdate: fields.string({required: true}),
	intro : fields.string({required: true, widget:widgets.textarea({class:'test',cols:150,rows: 4}) }),
	notes : fields.string({required: true, widget:widgets.textarea({class:'test',cols:150,rows: 6}) }),
	assignment : fields.string({required: true, widget:widgets.textarea({class:'test',cols:150,rows: 6}) }),
	
	published: fields.boolean({label:'Published?'}),
});

var page_entry_form = forms.create({
	title: fields.string({required: true}),
	urltitle: fields.string({required: true,label:'URL Slug'}),
	body : fields.string({required:true, widget:widgets.textarea({class:'test',cols:150,rows: 4}) }),
	published: fields.boolean({label:'Published?'}),
});


exports.ensureAuthenticated = function(req, res, next) {
    console.log("is Authenticated:" + req.isAuthenticated());
    
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/admin/login');
}

// Login display
exports.login = function(req, res) {
	templateData = {
		layout : 'admin/layout.html',user:req.user,
	}

	res.render('admin/login.html', templateData);
};

// Login post
exports.login_post = function(req, res) {
	res.redirect('/admin');
};

// logout
exports.logout = function(req, res) {
	req.logout();
    res.redirect('/admin');
};

exports.register = function(req, res) {
    res.render('admin/register.html', { });
};

exports.register_post = function(req, res) {

	if (req.body.password != req.body.confirm) {
		return res.render('admin/register.html');
	} else {

        User.register(new User({ username : req.body.username }), req.body.password, function(err, new_user) {
            if (err) {
                return res.render('admin/register.html');
            }
            console.log("**********");
            console.log(new_user);
            res.redirect('/admin');
        });
    }
};

exports.main = function(req,res){
	console.log("we're in admin")

	async.parallel({
	    notes: function(callback){
	        // get all classnote items ordered by classdate
			ClassNote.find({}).sort('classdate').exec(function(err, notes){

				for (n in notes) {
					notes[n].formattedDate = function() {
				        tmpDate = moment(this.classdate).add('minutes',moment().zone());
				        return moment(tmpDate).format("YYYY-MM-DD");
				    };
				}
				callback(null, notes);
			});
	    },
	    pages: function(callback){
	        // get all classnote items ordered by classdate
			Page.find({}).sort('title').exec(function(err, pages){
				callback(null, pages);					
			});
	    },
	},
	function(err, results) {
	    
	    templateData = {
	    	notes : results.notes,
	    	pages : results.pages,
	    	layout : 'admin/layout.html',user:req.user

	    }
	    res.render('admin/index.html', templateData);
	});
};


exports.create_note = function(req,res){
	templateData = {
		title : "DWD Admin",
		entry_form : notes_entry_form.toHTML(),
		layout : 'admin/layout.html',user:req.user
	}
	res.render("admin/entry.html",templateData);
};

exports.edit_note_get =  function(req,res){
	notes_id = req.params.documentid;
	
	ClassNote.findById(notes_id, function(err, note){

		if (err) {
			res.send("unable to find the note");
		}

		formdata = {
			title : note.title,
			urltitle : note.urltitle,
			classdate : moment(note.classdate).add('minutes',moment().zone()).format('YYYY-MM-DD'),
			intro : note.intro,
			notes : note.notes,
			assignment : note.assignment,
			published : note.published
		}

		// attach note data to form
		editform = notes_entry_form.bind(formdata);

		// prepare template data
		templateData = {
			note : note,
			title : 'DWD Admin - ' + note.title,
			entry_form : editform.toHTML(),
			layout : 'admin/layout.html',user:req.user

		}
		console.log(note);
		// render entry template
		res.render('admin/entry.html',templateData);
	});
};

exports.edit_note_post = function(req, res){
	notes_entry_form.handle(req, {
        success: function (form) {

        	if ( req.param('noteid') != undefined ) {
        		
        		ClassNote.findById(req.param('noteid'), function(err, classnote){

					if (err) {
						res.send("unable to find the note");
					}

					classnote.classdate = new Date(req.param('classdate'));
		        	classnote.title = req.param('title');
		        	classnote.urltitle = req.param('urltitle');
		        	classnote.intro = req.param('intro');
		        	classnote.notes = req.param('notes');
		        	classnote.assignment = req.param('assignment');
					
		        	if (req.param('published') == 'on') {
		        		classnote.published = true;
		        	} else {
		        		classnote.published = false;
		        	}
		        	classnote.save();

		        	res.redirect('/admin/edit/'+classnote.id);

				});

			} else {

	        	classnote = new ClassNote()

	        	classnote.classdate = new Date(req.param('classdate'));
	        	classnote.title = req.param('title');
	        	classnote.urltitle = req.param('urltitle');
	        	classnote.intro = req.param('intro');
	        	classnote.notes = req.param('notes');
	        	classnote.assignment = req.param('assignment');
	        	
	        	if (req.param('published') == 'on') {
	        		classnote.published = true;
	        	} else {
	        		classnote.published = false;
	        	}

	        	classnote.save();

	        	console.log(form.data);
	        	res.redirect('/admin/edit/'+classnote.id);
        	}

        },
        error: function (form) {
            // the data in the request didn't validate,
            // calling form.toHTML() again will render the error messages
            templateData = {
				title : "DWD Admin",
				entry_form : notes_entry_form.toHTML(),
				layout : 'admin/layout.html',user:req.user
			}
			res.render("admin/entry.html",templateData);
        },
        empty: function (form) {
            // there was no form data in the request
        }
    });
};

exports.page_entry =  function(req,res){
	templateData = {
		title : "DWD Admin",
		page_entry_form : page_entry_form.toHTML(),
		layout : 'admin/layout.html',user:req.user
		
	}
	res.render("admin/page_entry.html",templateData);
};

exports.page_edit = function(req,res){
	page_id = req.params.documentid;
	
	Page.findById(page_id, function(err, page){

		if (err) {
			res.send("unable to find the page");
		}


		formdata = {
			title : page.title,
			urltitle : page.urltitle,
			body : page.body,
			published : page.published
		}

		// attach note data to form
		editform = page_entry_form.bind(formdata);

		// prepare template data
		templateData = {
			page : page,
			title : 'DWD Admin - ' + page.title,
			page_entry_form : editform.toHTML(),
			layout : 'admin/layout.html',user:req.user

		}

		// render entry template
		res.render('admin/page_entry.html',templateData);
	});
};

exports.page_edit_post = function(req, res){
	page_entry_form.handle(req, {
        success: function (form) {

        	if ( req.param('pageid') != undefined ) {
        		
        		Page.findById(req.param('pageid'), function(err, page){

					if (err) {
						res.send("unable to find the note");
					}

		        	page.title = req.param('title');
		        	page.urltitle = req.param('urltitle');
		        	page.body = req.param('body'); //md.markdown.toHTML( req.param('body') );
		        	
		        	if (req.param('published') == 'on') {
		        		page.published = true;
		        	} else {
		        		page.published = false;
		        	}
		        	
		        	page.save();

		        	res.redirect('/admin/page_edit/'+page.id);

				});

			} else {

	        	page = new Page()
				page.title = req.param('title');
	        	page.urltitle = req.param('urltitle');
	        	page.body = req.param('body'); //md.markdown.toHTML( req.param('body') );
	        	// page.body_md = req.param('body');

	        	if (req.param('published') == 'on') {
	        		page.published = true;
	        	} else {
	        		page.published = false;
	        	}
	        	
	        	page.save();

	        	
				res.redirect('/admin');
        	}
        },
        error: function (form) {
            // the data in the request didn't validate,
            // calling form.toHTML() again will render the error messages
            templateData = {
				title : "DWD Admin",
				page_entry_form : page_entry_form.toHTML(),
				layout : 'admin/layout.html',user:req.user
			}
			res.render("admin/page_entry.html",templateData);
        },
        empty: function (form) {
            // there was no form data in the request
        }
    });
}
