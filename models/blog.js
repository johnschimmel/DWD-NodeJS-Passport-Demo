var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title     : String,
    urltitle  : String,
    body      : String,
    lastupdated : { type: Date, default: Date.now },
    user : { type: Schema.Types.ObjectId, ref: 'User' }
});

// export Page model
module.exports = mongoose.model('Blog', blogSchema);