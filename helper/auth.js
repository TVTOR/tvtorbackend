/**
 * Authentication Helper Module
 * Provides utility functions for JWT token generation, validation, and password handling
 * Centralizes authentication logic for consistent use across the application
 */

'use strict';

const httpStatus = require('http-status-codes');
const jwtValidator = require(`${appRoot}/validator/jwt`);
const secret = require(`${appRoot}/config/config`).jwtSecret;
const jwtErrors  = require(`${appRoot}/lib/constants`);
const bcrypt = require('bcrypt');

/**
 * Generates a JWT token for a user
 * Creates a payload with user information and signs it with the secret key
 * 
 * @param {Object} data - User data object containing _id, email, name, and userType
 * @returns {string} - Signed JWT token
 */
function generateJWToken(data) {
  const payload = { _id: data._id, email: data.email, name: data.name, userType: data.userType };
  return jwtValidator.createToken(payload, secret);
}

/**
 * Decodes and validates a JWT token
 * Attempts to decode the token and returns the payload if valid
 * Throws an error with appropriate message if token is invalid
 * 
 * @param {string} token - JWT token to decode and validate
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid, expired, or not active
 */
function decodeJWToken(token) {
  try {     
    return jwtValidator.decodeToken(token, secret);
  } catch (err) {
    const error = new Error();
    error.apiMessage = jwtErrors[err.name];
    error.statusCode = httpStatus.UNAUTHORIZED;
    throw error;
  }
}

/**
 * Hashes a password using bcrypt
 * Uses a salt rounds value of 10 for security
 * 
 * @param {string} password - Plain text password to hash
 * @returns {string} - Hashed password
 */
function bcryptPassword(password){
  return bcrypt.hashSync(password, 10);
}

/**
 * Validates a password against a stored hash
 * Compares the provided password with the stored hash using bcrypt
 * 
 * @param {string} userPassword - Plain text password from user input
 * @param {string} password - Stored hashed password from database
 * @returns {boolean} - True if passwords match, false otherwise
 */
function validatePassword(userPassword, password) {
  return bcrypt.compareSync(userPassword, password);
}

// Export all authentication helper functions
module.exports = {
  generateJWToken,    // Generate new JWT tokens
  decodeJWToken,      // Decode and validate JWT tokens
  bcryptPassword,     // Hash passwords securely
  validatePassword    // Validate passwords against hashes
};
