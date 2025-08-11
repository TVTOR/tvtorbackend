/**
 * Device Model Schema
 * Defines the structure for user devices used for push notifications
 * Links devices to tutor managers for FCM (Firebase Cloud Messaging) notifications
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Device schema definition for push notification management
var deviceUser = new Schema({
    deviceId: { type: String, unique: true },                   // Unique identifier for the device
    deviceType: { type: String },                               // Type of device (e.g., "android", "ios")
    deviceToken: { type: String },                              // FCM token for sending push notifications
    tmId: { type: mongoose.Schema.Types.ObjectId }              // Reference to tutor manager who owns this device
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
})

module.exports = mongoose.model('deviceUser', deviceUser);