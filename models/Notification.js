var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: { type: String },
    location: { type: String },
    message: {type: String},
    queryData: {type: JSON}
}, {timestamps: true})

module.exports = mongoose.model('Notification', Notification);