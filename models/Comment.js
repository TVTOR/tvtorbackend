/**
 * Comment Model Schema
 * Defines the structure for comments between tutors and tutor managers
 * Enables communication and feedback between users in the platform
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Comment schema definition for user communication
var Comments = new Schema({
    comment: { type: String },                                  // The comment text content
    tutorId: { type: mongoose.Schema.Types.ObjectId },          // Reference to the tutor being commented on
    managerId: { type: mongoose.Schema.Types.ObjectId }         // Reference to the tutor manager making the comment
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
})

module.exports = mongoose.model('Comments', Comments);