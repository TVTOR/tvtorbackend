var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TutorNotification = new Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    queryData: { type: JSON }
}, {timestamps: true})

module.exports = mongoose.model('TutorNotification', TutorNotification);