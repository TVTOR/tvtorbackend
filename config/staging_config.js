/**
 * Staging Environment Configuration
 * Contains settings specific to the staging environment
 * Used when NODE_ENV=staging for testing before production deployment
 */

module.exports = {
    // MongoDB connection string for staging environment
    // Connects to a cloud MongoDB instance (MongoDB Atlas)
    // Uses connection string with authentication credentials
    MONGODB_URI: "mongodb+srv://ims:OngraphTech@cluster0.o2cty.mongodb.net/tutor?retryWrites=true&w=majority",
    
    // JWT secret key for staging environment
    // Note: Should be different from development and production
    JWT_SECRET: "EEEASDFASDFASDFASDF",
    
    // Base API URL for staging environment
    // Points to Heroku staging deployment
    API_URL: "https://tutorbackend.herokuapp.com/",
    
    // Email credentials for staging notifications
    // Used for testing email functionality in staging
    EMAIL: "ongraph.tvtor@gmail.com",
    
    // Email password for staging environment
    // Note: In production, use environment variables for security
    PASSWORD: "tvtor@#123"
};