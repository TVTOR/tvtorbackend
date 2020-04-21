var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Code = new Schema({
    code: {type: Number},
    used: {type: Number, default: 0},
    email: { type: String },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true})

module.exports = mongoose.model('Code', Code)