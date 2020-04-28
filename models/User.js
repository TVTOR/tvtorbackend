var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var user = new Schema({
    name: { type: String },
    surname: {type: String},
    email: { type: String },
    password: { type: String },
    location: { type: String },
    subjects: { type: String },
    code: { type: Number  },
    status: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    availability: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    userType: { type: String, enum: ['tutormanager', 'admin','tutor'], default:'tutormanager' }
}, { timestamps: true })

user.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
};

module.exports = mongoose.model('User', user);