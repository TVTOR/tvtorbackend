/**
 * Development Environment Configuration
 * Contains settings specific to the development environment
 * Used when NODE_ENV=development or when no environment is specified
 */

module.exports = {
    // MongoDB connection string for development (using Atlas cloud database)
    // Updated to use the same connection as production for consistency
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://TommasoSignorini:uPS9TYnMSrAyXNhm@cluster1.6dxoahj.mongodb.net/tutor?retryWrites=true&w=majority&appName=Cluster1",
    
    // JWT secret key for development environment
    JWT_SECRET: process.env.JWT_SECRET || "EEEASDFASDFASDFASDF",
    
    // Base API URL for development
    // Points to local development server
    API_URL: "http://localhost:5000",
    
    // Email credentials for development notifications
    EMAIL: process.env.EMAIL || "noreply.tvtor@gmail.com",
    
    // Email password for development
    PASSWORD: process.env.PASSWORD || "tvtor@#123"
};