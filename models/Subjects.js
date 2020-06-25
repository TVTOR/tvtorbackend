var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Subjects = new Schema({
    subject: { type: String },
    colorcode: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Subjects', Subjects);