var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TutorAssign = new Schema({
      name: { type: String },
      email: { type: String },
      subject: { type: Array },
      location: { type: Array },
      tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      is_active: { type: Boolean, default: true },
      notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }
}, {timestamps: true});

module.exports = mongoose.model('TutorAssign', TutorAssign);