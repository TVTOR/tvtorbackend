/**
 * Production Environment Configuration
 * Contains settings specific to the production environment
 * Used when NODE_ENV=production for live deployment
 * 
 * Note: This configuration should be updated with actual production values
 * and should use environment variables for sensitive information
 */

module.exports = {
    // MongoDB connection string for production environment
    // Currently set to localhost - should be updated to production MongoDB instance
    // Consider using MongoDB Atlas or other cloud MongoDB service for production
    MONGODB_URI: "mongodb://localhost:27017/tutor",
    
    // JWT secret key for production environment
    // WARNING: This should be a strong, unique secret key in production
    // Consider using environment variables for security
    JWT_SECRET: 'EEEASDFASDFASDFASDF',
    
    // Base API URL for production environment
    // Should be updated to actual production domain
    API_URL: "http://localhost:5000"
};