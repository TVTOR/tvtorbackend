/**
 * Subjects Model Schema
 * Defines the structure for academic subjects in the tutoring platform
 * Each subject can have a color code for UI representation
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Subject schema definition for academic subjects
var Subjects = new Schema({
    subject: { type: String },                     // Name of the academic subject (e.g., "Mathematics", "Physics")
    colorcode: { type: String }                    // Hexadecimal color code for UI representation and categorization
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Subjects', Subjects);