/**
 * TutorNotification Model Schema
 * Defines the structure for notifications sent directly to tutors
 * Contains messages and query data for tutor-specific communications
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Tutor notification schema definition
var TutorNotification = new Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the tutor receiving the notification
    message: { type: String },                                    // Notification message text
    queryData: { type: JSON }                                     // Additional data related to the notification
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
})

module.exports = mongoose.model('TutorNotification', TutorNotification);