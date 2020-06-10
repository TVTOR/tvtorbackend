var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Subjects = new Schema({
    subject: { type: String },
    colorcode: { type: String },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Subjects', Subjects);