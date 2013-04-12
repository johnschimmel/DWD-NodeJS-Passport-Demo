var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({});
userSchema.plugin(passportLocalMongoose);

// return User model
module.exports = mongoose.model('User', userSchema);