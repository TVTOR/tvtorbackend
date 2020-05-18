var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comments = new Schema({
    comment: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Comments', Comments);