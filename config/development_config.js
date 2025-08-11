/**
 * Development Environment Configuration
 * Contains settings specific to the development environment
 * Used when NODE_ENV=development or when no environment is specified
 */

module.exports = {
    // MongoDB connection string for local development
    // Connects to a local MongoDB instance with 'tutor' database
    MONGODB_URI: "mongodb://localhost:27017/tutor",
    
    // JWT secret key for development environment
    // Note: In production, use a strong, unique secret key
    JWT_SECRET: "EEEASDFASDFASDFASDF",
    
    // Base API URL for development
    // Points to local development server
    API_URL: "http://localhost:5000",
    
    // Email credentials for development notifications
    // Used for sending emails during development/testing
    EMAIL: "noreply.tvtor@gmail.com",
    
    // Email password for development
    // Note: In production, use environment variables for security
    PASSWORD: "tvtor@#123"
};