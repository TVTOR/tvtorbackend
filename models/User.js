/**
 * User Model Schema
 * Defines the structure for user accounts in the tutoring platform
 * Supports multiple user types: admin, tutor manager, and tutor
 */

var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

// User schema definition with all required fields and relationships
var user = new Schema({
    // Basic user information
    name: { type: String },                    // User's first name
    surname: { type: String },                  // User's last name
    email: { type: String },                    // User's email address (unique identifier)
    password: { type: String },                 // Hashed password for authentication
    
    // Location and subject preferences
    location: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Locations' }],  // Array of location IDs where user operates
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subjects' }],   // Array of subject IDs user can teach/needs
    
    // Verification and status fields
    code: { type: Number },                     // Verification code for registration/access
    status: { type: Boolean, default: false },  // Account approval status (false = pending approval)
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
    
    // Profile and availability information
    availability: { type: String },             // User's availability schedule
    description: { type: String },              // User's bio or description
    mobileNumber: { type: Number },             // Contact phone number
    
    // Profile image
    imageUrl: { type: String },                 // URL to user's profile image
    
    // Cached data for performance (populated from references)
    subjectId: { type: Array },                 // Array of subject IDs (cached)
    subjectData: { type: Array },               // Array of subject objects (cached)
    locationData: { type: Array },              // Array of location objects (cached)
    
    // Session and login management
    loginStatus: { type: Boolean, default: false }, // Whether user is currently logged in
    
    // Role and hierarchy management
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Reference to tutor manager (for tutors)
    userType: { 
        type: String, 
        enum: ['tutormanager', 'admin', 'tutor'], // User role in the system
        default: 'tutormanager' 
    }
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
})

/**
 * Static method to hash passwords using bcrypt
 * @param {string} password - Plain text password to hash
 * @returns {string} - Hashed password
 */
user.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
};

module.exports = mongoose.model('User', user);