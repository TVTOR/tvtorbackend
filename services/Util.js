/**
 * Utility Service Module
 * Provides standardized response formatting for API endpoints
 * Ensures consistent response structure across all API responses
 */

var util = {};

/**
 * Formats and sends a successful API response
 * Creates a standardized success response with optional data payload
 * 
 * @param {Object} res - Express response object
 * @param {string} successMsg - Success message to include in response
 * @param {number} statusCode - HTTP status code for the response
 * @param {*} data - Optional data payload to include in response
 * @returns {Object} - JSON response with success structure
 */
util.successResponse = function (res, successMsg, statusCode, data = null) {
    var sendData = {
        success: true,           // Indicates successful operation
        data: null,              // Data payload (null if no data)
        message: null,           // Success message
        statusCode: statusCode   // HTTP status code
    }
    
    // Add data to response if provided
    if (data) {
        sendData.data = data;
    }
    
    // Add success message if provided
    if (successMsg) {
        sendData.message = successMsg;
    }
    
    // Set HTTP status code
    if (statusCode) {
        res.status = statusCode;
    }
    
    return res.json(sendData);
};

/**
 * Formats and sends an error API response
 * Creates a standardized error response with optional error details
 * 
 * @param {Object} res - Express response object
 * @param {string} errorMsg - Error message to include in response
 * @param {number} statusCode - HTTP status code for the error
 * @param {*} data - Optional error details or additional data
 * @returns {Object} - JSON response with error structure
 */
util.errorResponse = function (res, errorMsg, statusCode, data = null) {
    var sendData = {
        success: false,          // Indicates failed operation
        data: null,              // Error details (null if no details)
        message: null,           // Error message
        statusCode: statusCode   // HTTP status code
    }
    
    // Add error message if provided
    if (errorMsg) {
        sendData.message = errorMsg
    }
    
    // Add error data if provided
    if (data) {
        sendData.data = data
    }
    
    // Set HTTP status code
    if (statusCode) {
        res.status = statusCode
    }
    
    return res.json(sendData);
}

module.exports = util;