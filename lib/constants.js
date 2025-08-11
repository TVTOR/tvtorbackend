/**
 * Constants and Error Messages Module
 * Centralizes all application constants, success messages, and error messages
 * Provides consistent messaging across the entire application
 */

'use strict';

// Application constants for configuration
const constants = {
  // Database configuration constants
  DEFAULT_DB_PORT: 3306,                    // Default database port (MySQL style, but using MongoDB)
  DEFAULT_APP_PORT: 3000,                   // Default application port
  
  // Authentication and user management messages
  LOGIN_SUCCESS: 'Login successfully!',      // Successful login message
  LOGIN_INCORRECT_PASSWORD: 'Please enter correct password!', // Incorrect password error
  UNAUTHORIZED_MSG: 'Unauthorized Access!',  // Unauthorized access error
  USER_NOT_FOUND: 'User Not Found!',        // User not found error
  
  // General operation messages
  SUCCESS: 'success',                        // Generic success indicator
  DB_ERROR: 'Something went wrong!',        // Generic database error message
  
  // User registration and management messages
  REGISTER_SUCCESS: 'You have been register successfully!', // Successful registration
  INCORRECT_EMAIL: 'Email-id does not exist!',              // Email not found error
  USER_ALREADY_EXIST: 'This email is already exist!',      // Duplicate email error
  PASSWORD_TOKEN_EXP: 'not valid',                          // Invalid password token
  PASSWORD_UPDATED: 'Password has been updated successfully!', // Password update success
  
  // Code and verification messages
  VALID_TOKEN: "Please enter valid code.",                  // Invalid verification code
  CODE_EXIST: "This code already used.",                    // Code already used error
  MOBILE_EXIST: "Mobile number already registered",         // Duplicate mobile number
  
  // Tutor management messages
  TUTOR_CREATE: "Tutor created successfully.",              // Tutor creation success
  ACCEPT_TM: "Tutor manager has been accepted successfully", // Tutor manager approval
  DECLINE_TM: "Data deleted successfully",                  // Tutor manager rejection
  
  // Data operation messages
  PARAMETER_MISSING: "Parameters are missing",              // Missing parameters error
  DATA_FOUND: "Data found",                                 // Data retrieval success
  DATA_NOT_FOUND: "Data not found",                         // No data found
  DATA_DELETE: "Data deleted successfully",                 // Data deletion success
  UPDATE_DATA: "Data updated successfully",                 // Data update success
  
  // Subject and location management messages
  CREATE_SUBJECT: "Subject created successfully",            // Subject creation success
  CREATE_LOCATION: "Location created successfully",          // Location creation success
  SUBJECT_ALREADY_EXIST: "This subject already exist",      // Duplicate subject error
  LOCATION_ALREADY_EXIST: "This location already exist",    // Duplicate location error
  
  // Code and device management messages
  CREATE_CODE: "Randomcode generated successfully",          // Code generation success
  CREATE_DEVICES: "Device created successfully",             // Device creation success
  
  // Notification and communication messages
  CREATE_NOTIFICATION: "Notification created successfully",  // Notification creation success
  CREATE_QUESTIONS: "Questions created successfully",        // Question creation success
  CREATE_COMMENTS: "Comment created successfully",           // Comment creation success
  
  // User status and verification messages
  VERIFY_STATUS: "You have to verify from admin",           // Pending verification message
  
  // Tutor assignment messages
  ALREADY_ASSIGNED_TUTOR: "This tutor already has been assigned by some one.", // Duplicate assignment
  REQUEST_EXPIRED: "Request has been expired.",              // Expired request
  ASSIGN_TUTOR: "Assign Tutor Successfully",                // Tutor assignment success
  TIME_SESSION: "Your time session out."                     // Session timeout
};

// JWT token error messages for different error types
const jwtErrors = {
  TokenExpiredError: 'Token has been expired!',              // JWT token expiration error
  JsonWebTokenError: 'Token is not valid!',                  // Invalid JWT token error
  NotBeforeError: 'Token is not Active!'                     // JWT token not yet active error
};

// Export constants and JWT errors for use throughout the application
module.exports = {
  constants,    // Application constants and messages
  jwtErrors     // JWT-specific error messages
};