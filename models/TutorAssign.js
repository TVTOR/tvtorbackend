var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TutorAssign = new Schema({
      name: { type: String },
      email: { type: String },
      subject: { type: String },
      location: { type: String },
      tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }
}, {timestamps: true});

module.exports = mongoose.model('TutorAssign', TutorAssign);