var moment = require('moment');

var Blog = require('../models/blog.js');

// main page
exports.index =  function(req,res){

  res.send("hello world")

};

// controller for individual note view
exports.write = function(req, res){
  var template_data = {
    title : 'Create a new blog post'
  };

  res.render('blog_form.html', template_data)
};

exports.write_post = function(req, res){
  
  if ( req.body.blog_id != undefined ) {
            
      Blog.findById(req.param('blog_id'), function(err, blogpost){

        if (err) {
          res.send("unable to find the note");
        }

        blogpost.title = req.body.title;
        blogpost.body = req.body.body;
        blogpost.save();

        res.redirect('/edit/'+blogpost.id);
      });

  } else {

    // Create a new blog post
    var blogpost = new Blog(); // create Blog object
    blogpost.title = req.body.title;
    blogpost.urltitle = req.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_')
    blogpost.body = req.body.body;
    
    blogpost.user = req.user; // associate logged in user with blog post
    
    blogpost.save();
    
    res.redirect('/edit/'+blogpost.id);

  }

};

exports.edit = function(req,res) {
    
    Blog.findById(req.param('blog_id'), function(err, blogpost){

      if (err) {
        res.send("Uhoh something went wrong");
        console.log(err);

      } else {
        res.send("found : " + blogpost.title);
      } 



    });

};
