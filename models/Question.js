/**
 * Question Model Schema
 * Defines the structure for questions used in the chatbot system
 * Supports multiple question types and options for dynamic conversation flow
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Question schema definition for chatbot functionality
var Questions = new Schema({
    question: { type: String },                    // The actual question text
    no_answer: { type: Number, default: 0 },      // Flag indicating if question requires an answer (0 = no, 1 = yes)
    options: { type: Array },                      // Array of possible answer options for the question
    type: { type: String },                        // Question type classification
    title: { type: String },                       // Question title or heading
    optionTable: { type: String },                 // Reference table for options (e.g., "location", "subject")
    question_num: { type: Number },                // Sequential question number for conversation flow
    languageCode: { type: String }                 // Language identifier for internationalization support
}, { 
    timestamps: true // Automatically add createdAt and updatedAt fields
})

module.exports = mongoose.model('Questions', Questions);