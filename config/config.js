/**
 * Configuration Management Module
 * Handles environment-specific configuration loading and provides centralized config access
 * Supports development, staging, and production environments
 */

// Load environment variables from .env file
require('dotenv').config()

const path = require('path');

// Import environment-specific configuration files
var developmentConfig = require("./development_config");
var stagingConfig = require("./staging_config");
var productionConfig = require("./production_config");

// Determine current environment, default to development if not specified
let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
let config;

// Set global application root path for use across the application
// This allows other modules to reference the project root directory
global.appRoot = path.normalize(`${path.resolve(__dirname)}/..`);

// Environment configuration mapping
// Maps environment names to their respective config objects
let envObject = {
	"development": developmentConfig,
	"staging": stagingConfig,
	"production": productionConfig
}

// Select configuration based on current environment
config = envObject[env];

// Log the loaded configuration for debugging purposes
console.log(config);

// Export the configuration object with all necessary settings
module.exports = {
	mongoUri: config.MONGODB_URI,        // MongoDB connection string
	jwtSecret: config.JWT_SECRET,        // Secret key for JWT token signing
	API_URL: config.API_URL,             // Base URL for the API
	EMAIL: config.EMAIL,                 // Email credentials for notifications
	PASSWORD: config.PASSWORD,           // Email password for notifications
	secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret' // Environment-specific secret
};