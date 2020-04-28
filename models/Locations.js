var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Locations = new Schema({
    location: {type: String},
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true})

module.exports = mongoose.model('Locations', Locations);