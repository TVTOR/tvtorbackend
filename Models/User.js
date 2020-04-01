var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var user = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
})

user.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
};

module.exports = mongoose.model('User', user);