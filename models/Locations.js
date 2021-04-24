var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Locations = new Schema({
    location: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Locations', Locations);