var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceUser = new Schema({
    deviceId: { type: String, unique: true },
    deviceType: { type: String },
    deviceToken: { type: String },
    tmId: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true })

module.exports = mongoose.model('deviceUser', deviceUser);