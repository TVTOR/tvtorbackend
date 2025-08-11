/**
 * Code Model Schema
 * Defines the structure for verification codes used in user registration
 * Links codes to specific tutor managers for access control
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Code schema definition for verification and access control
var Code = new Schema({
    code: { type: Number },                                    // 6-digit verification code for user registration
    used: { type: Boolean, default: false },                   // Flag indicating if the code has been used
    email: { type: String },                                   // Email associated with the code (if applicable)
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to tutor manager who generated the code
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
})

module.exports = mongoose.model('Code', Code);