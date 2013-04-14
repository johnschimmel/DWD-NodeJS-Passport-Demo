var moment = require('moment');

var Blog = require('../models/blog.js');
var User = require('../models/user.js'); 

// main page
exports.index =  function(req,res){

  var query = Blog.find({});
  query.populate('user');
  query.sort('-lastupdated');
  query.exec(function(err, blogposts){

    if (err) {
      res.send("uhoh, something happened when getting blog posts.");

    } else {

      var template_data = {
        
        posts : blogposts, 
        currentUser : req.user

      };

      res.render('index.html', template_data);
    }
    
  });
  
};

exports.user_posts = function(req, res) {

  var userQuery = User.findOne({username:req.param('username')});
  userQuery.exec(function(err, user) {

    if (err) {
      res.send('unable to find user');

    } else {
        
      var query = Blog.find({user:user.id});
      query.sort('-lastupdated');
      query.exec(function(err, blogposts){

        if (err) {
          res.send("uhoh, something happened when getting blog posts.");

        } else {

          var template_data = {
            title : user.username + "'s Blog Posts",
            posts : blogposts, 
            currentUser : req.user,
            bloguser : user
          };
          
          // if logged in, is this user the requested user?
          if (req.user != undefined){
            template_data.isOwner = (req.user.id == user.id)
          }

          res.render('user_posts.html', template_data);
        }
        
      });


    }

  })

  
}

// controller for individual note view
exports.write = function(req, res){
  var template_data = {
    title : 'Create a new blog post',
    currentUser : req.user
  };

  res.render('blog_form.html', template_data)
};

exports.write_post = function(req, res){
  
  if ( req.param('blog_id') != undefined ) {
            
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
    
    console.log(req.param('blog_id'));

    Blog.findById(req.param('blog_id'), function(err, blogpost){

      if (err) {
        
        res.send("Uhoh something went wrong");
        console.log(err);

      } else if (blogpost.user != req.user.id){

        res.send('You do not own this blog post.');
      
      } else {
        
        console.log(blogpost);
        
        var template_data = {
          title : 'Edit Blog Post',
          blogpost : blogpost,
          currentUser : req.user
        };

        res.render('blog_form.html', template_data);
      } 



    });

};
