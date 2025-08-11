/**
 * Session Model Schema
 * Defines the structure for user sessions and authentication tokens
 * Tracks active user sessions for security and logout functionality
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User session schema definition for authentication tracking
var userSession = new Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },    // Reference to the user this session belongs to
    token: { type: String },                                    // JWT token for the current session
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('usersession', userSession);