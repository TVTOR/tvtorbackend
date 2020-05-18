var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceUser = new Schema({
    deviceId: { type: String, default: '214525563263' },
    deviceType: { type: String, default: 'android' },
    deviceToken: { type: String, default: 'fg5456asgxvgsv'},
    tmId: { type: mongoose.Schema.Types.ObjectId },
    tutorId: { type: mongoose.Schema.Types.ObjectId }
}, {timestamps: true})

module.exports = mongoose.model('deviceUser', deviceUser);
