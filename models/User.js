var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var user = new Schema({
    name: { type: String },
    surname: { type: String },
    email: { type: String },
    password: { type: String },
    location: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Locations' }],
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subjects' }],
    code: { type: Number  },
    status: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    availability: { type: String },
    description: { type: String },
    mobileNumber: { type: Number },
    imageUrl: { type: String },
    subjectId: { type: Array },
    subjectData: { type: Array },
    locationData: { type: Array },
    loginStatus: {type: Boolean, default: false},
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    userType: { type: String, enum: ['tutormanager', 'admin','tutor'], default:'tutormanager' }
}, { timestamps: true })

user.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
};

module.exports = mongoose.model('User', user);