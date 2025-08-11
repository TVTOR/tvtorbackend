/**
 * TutorAssign Model Schema
 * Defines the structure for tutor-student assignments
 * Tracks the relationship between students and their assigned tutors
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Tutor assignment schema definition
const TutorAssign = new Schema({
    name: { type: String },                                     // Student's name
    email: { type: String },                                    // Student's email address
    subject: { type: Array },                                   // Array of subjects the student needs help with
    location: { type: Array },                                  // Array of locations where tutoring is needed
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the assigned tutor
    is_active: { type: Boolean, default: true },                // Whether the assignment is currently active
    status: { type: Boolean, default: false },                  // Assignment status (false = pending, true = confirmed)
    notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' } // Reference to the original notification
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('TutorAssign', TutorAssign);