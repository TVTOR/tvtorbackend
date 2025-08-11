/**
 * Notification Model Schema
 * Defines the structure for notifications sent to tutor managers
 * Contains information about student requests and matching criteria
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Notification schema definition for tutor manager notifications
var Notification = new Schema({
    tmId: [{ type: mongoose.Schema.Types.ObjectId }],  // Array of tutor manager IDs to notify
    subject: { type: Array },                          // Array of subjects the student needs help with
    location: { type: Array },                         // Array of locations where tutoring is needed
    message: { type: String },                         // Notification message text
    queryData: { type: JSON }                          // Additional data from the student's request (name, email, etc.)
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
})

module.exports = mongoose.model('Notification', Notification);