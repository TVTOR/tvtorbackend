var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
    tmId: [{ type: mongoose.Schema.Types.ObjectId }],
    subject: { type: Array },
    location: { type: Array },
    message: { type: String },
    queryData: { type: JSON }
}, { timestamps: true })

module.exports = mongoose.model('Notification', Notification);