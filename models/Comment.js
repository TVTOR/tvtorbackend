var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comments = new Schema({
    comment: { type: String },
    tutorId: { type: mongoose.Schema.Types.ObjectId },
    managerId: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true })

module.exports = mongoose.model('Comments', Comments);