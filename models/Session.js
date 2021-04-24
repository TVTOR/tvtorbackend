var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSession = new Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    token: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('usersession', userSession);