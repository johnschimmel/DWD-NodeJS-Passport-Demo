var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pageSchema = new Schema({
    title     : String,
    urltitle  : String,
    body      : String,
    body_md   : String,
    published : Boolean,
    lastupdated : { type: Date, default: Date.now }
});

// export Page model
module.exports = mongoose.model('Page', pageSchema);