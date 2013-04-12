var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassNoteSchema = new Schema({
    classdate   : Date,
    urltitle    : { type: String, lowercase: true, unique: true },
    title       : String,
    intro       : String,
    intro_md    : String,
    notes       : String,
    notes_md    : String,
    assignment  : String,
    assignment_md : String,
    notesReady  : String,
    published : Boolean,
    lastupdated : { type: Date, default: Date.now }
});


module.exports = mongoose.model('ClassNote',ClassNoteSchema);