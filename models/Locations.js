/**
 * Locations Model Schema
 * Defines the structure for geographical locations in the tutoring platform
 * Used to match tutors with students based on location preferences
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Location schema definition for geographical areas
var Locations = new Schema({
    location: { type: String }                     // Name of the geographical location (e.g., "New York", "London")
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
})

module.exports = mongoose.model('Locations', Locations);