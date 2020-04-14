var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var user = new Schema({
    name: { type: String },
    surname: {type: String},
    email: { type: String },
    password: { type: String },
    location: {type: String},
    subjects: {type: String},
    role: {type: String}
}, {timestamps: true})

user.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
};

module.exports = mongoose.model('User', user);