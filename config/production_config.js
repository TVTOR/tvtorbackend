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
    // Uses environment variable or fallback to your Atlas cluster
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/tutor",
    
    // JWT secret key for production environment
    // Uses environment variable for security
    JWT_SECRET: process.env.JWT_SECRET || 'EEEASDFASDFASDFASDF',
    
    // Base API URL for production environment
    // Will be set automatically by Render
    API_URL: process.env.RENDER_EXTERNAL_URL || "https://your-app.onrender.com",
    
    // Email credentials for production
    EMAIL: process.env.EMAIL || "noreply.tvtor@gmail.com",
    PASSWORD: process.env.PASSWORD || "tvtor@#123"
};