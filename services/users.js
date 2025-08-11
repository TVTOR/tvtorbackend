/**
 * User Service Module
 * Contains business logic for user management operations
 * Handles user creation, validation, updates, and data retrieval
 */

'use strict';

// Import required models and dependencies
const usersModel = require(`${appRoot}/models/User`);
const codeModel = require(`${appRoot}/models/Code`);
const subjectModel = require(`${appRoot}/models/Subjects`);
var userSessionModel = require(`${appRoot}/models/Session`);
const locationModel = require(`${appRoot}/models/Locations`);
const deviceModel = require(`${appRoot}/models/Device`);
const userSesseion = require(`${appRoot}/models/Session`);
const commentModel = require(`${appRoot}/models/Comment`);

var mongoose = require('mongoose');

/**
 * Validates if an email address exists in the system
 * Used during login and registration to check email availability
 * 
 * @param {string} email - Email address to validate
 * @returns {Object|null} - User object if found, null otherwise
 */
async function validEmail(email) {
	return await usersModel.findOne({
		email: email
	});
}

/**
 * Validates if a verification code exists and is unused
 * Used during tutor registration to verify access codes
 * 
 * @param {number} code - Verification code to validate
 * @returns {Object|null} - Code object if found, null otherwise
 */
async function validCode(code) {
	return await codeModel.findOne({
		code: code
	});
}

/**
 * Validates if a mobile number is already registered
 * Prevents duplicate mobile numbers across users
 * 
 * @param {number} mobileNumber - Mobile number to validate
 * @returns {Object|null} - User object if found, null otherwise
 */
async function validMobileNumber(mobileNumber) {
	return await usersModel.findOne({
		mobileNumber: mobileNumber
	});
}

/**
 * Creates a new user in the system
 * Handles both tutor manager and tutor registrations
 * 
 * @param {Object} params - User parameters (name, email, password, etc.)
 * @param {string} password - Hashed password
 * @param {string} managerId - Optional manager ID for tutors
 * @returns {Object} - Created user object
 */
async function insertUser(params, password, managerId = '') {
	var obj = {
		name: params.name ? params.name : '',           // User's first name
		surname: params.surname ? params.surname : '',   // User's last name
		email: params.email,                            // User's email address
		password: password,                             // Hashed password
		location: params.location,                      // Array of location IDs
		subjects: params.subjects,                      // Array of subject IDs
		status: params.status ? params.status : false,  // Account approval status
		isDeleted: params.isDeleted ? params.isDeleted : false, // Soft delete flag
		managerId: managerId ? managerId : null,        // Manager ID for tutors
		mobileNumber: params.mobileNumber ? params.mobileNumber : '', // Contact number
		code: params.code ? params.code : '',           // Verification code
		userType: params.userType ? params.userType : '' // User role
	};
	return await usersModel.create(obj);
}

/**
 * Marks a verification code as used
 * Prevents reuse of verification codes
 * 
 * @param {number} code - Code to mark as used
 * @returns {Object} - Update result
 */
async function updateCode(code) {
	return await codeModel.updateOne({ code: code }, { used: true });
}

/**
 * Retrieves location data for given location IDs
 * Used to populate location information for users
 * 
 * @param {Array} location - Array of location IDs
 * @returns {Array} - Array of location objects
 */
async function getLocationData(location) {
	const splitLocation = location.map((elem) => mongoose.Types.ObjectId(elem))
	return await locationModel.find({ _id: { $in: splitLocation } });
}

/**
 * Retrieves subject data for given subject IDs
 * Used to populate subject information for users
 * 
 * @param {Array} subject - Array of subject IDs
 * @returns {Array} - Array of subject objects
 */
async function getSubjectData(subject) {
	if (subject && subject.length) {
		var splitSubject = subject.map((elem) => mongoose.Types.ObjectId(elem))
	} else {
		var splitSubject = [];
	}
	return await subjectModel.find({ _id: { $in: splitSubject } });
}

/**
 * Creates a new user session
 * Tracks user login sessions for security
 * 
 * @param {string} id - User ID
 * @param {string} userType - User role type
 * @param {string} token - JWT token for the session
 * @returns {Object} - Created session object
 */
async function insertSession(id, userType, token) {
	var userData = {
		userId: id,
		userType: userType,
		token: token,
	}
	return await userSessionModel.create(userData);
}

/**
 * Retrieves all users in the system
 * Used for administrative purposes
 * 
 * @returns {Array} - Array of all user objects
 */
async function getUsersList() {
	const data = await usersModel.find({});
	return data;
}

/**
 * Removes a user session
 * Used during logout to invalidate the session
 * 
 * @param {string} userId - User ID whose session to remove
 * @returns {Object} - Deletion result
 */
async function removeSession(userId) {
	const userSesseionData = await userSesseion.remove({ userId: userId });
	return userSesseionData;
}

/**
 * Retrieves a single user by ID
 * Used for profile viewing and updates
 * 
 * @param {string} userId - User ID to retrieve
 * @returns {Object} - User object
 */
async function getSingleUser(userId) {
	const user = await usersModel.findById({ _id: userId });
	return user;
}

/**
 * Permanently deletes a user from the system
 * Used for account removal
 * 
 * @param {string} userId - User ID to delete
 * @returns {Object} - Deleted user object
 */
async function userDelete(userId) {
	const user = await usersModel.findByIdAndDelete({ _id: userId });
	return user;
}

/**
 * Deletes a tutor manager
 * Used when removing tutor manager accounts
 * 
 * @param {string} userId - Tutor manager ID to delete
 * @returns {Object} - Deleted user object
 */
async function deleteTM(userId) {
	const user = await usersModel.findByIdAndDelete({ _id: userId });
	return user;
}

/**
 * Deletes a tutor manager and all associated tutors
 * Cascading delete for manager-tutor relationships
 * 
 * @param {string} userId - Tutor manager ID
 * @returns {Object} - Deletion result
 */
async function deleteTMandTutors(userId) {
	let id = mongoose.Types.ObjectId(userId);
	const user = await usersModel.deleteMany({ managerId: id });
	return user;
}

/**
 * Retrieves tutor managers with pagination and search
 * Used for administrative user management
 * 
 * @param {Object} search - Search criteria
 * @param {string} sort - Sort field
 * @param {number} order - Sort order (1 for ascending, -1 for descending)
 * @param {number} perpage - Number of items per page
 * @param {number} skip - Number of items to skip (for pagination)
 * @returns {Array} - Array of tutor manager objects
 */
async function getTutorManagersList(search, sort, order, perpage, skip) {
	const user = await usersModel.find(search)
		.collation({ 'locale': 'en' })
		.sort({ [sort]: parseInt(order) })
		.skip(skip)
		.limit(perpage);
	return user;
}

/**
 * Counts total number of tutor managers matching search criteria
 * Used for pagination calculations
 * 
 * @param {Object} search - Search criteria
 * @returns {number} - Total count
 */
async function countTutorManager(search) {
	const total = await usersModel.count(search);
	return total;
}

/**
 * Retrieves all tutor managers with pagination
 * Alternative method for getting tutor manager lists
 * 
 * @param {Object} search - Search criteria
 * @param {string} sort - Sort field
 * @param {number} order - Sort order
 * @param {number} perpage - Items per page
 * @param {number} skip - Items to skip
 * @returns {Array} - Array of tutor manager objects
 */
async function getAllTutorManagers(search, sort, order, perpage, skip) {
	const user = await usersModel.find(search)
		.collation({ 'locale': 'en' })
		.sort({ [sort]: parseInt(order) })
		.skip(skip)
		.limit(perpage);
	return user;
}

/**
 * Approves a tutor manager account
 * Changes status from pending to approved
 * 
 * @param {string} userId - User ID to approve
 * @param {boolean} statuschange - New status value
 * @returns {Object} - Update result
 */
async function acceptTutorManagers(userId, statuschange) {
	const user = await usersModel.updateOne({ _id: userId }, { status: statuschange });
	return user;
}

/**
 * Rejects a tutor manager account
 * Marks the account as deleted
 * 
 * @param {string} userId - User ID to reject
 * @param {boolean} statuschange - New deletion status
 * @returns {Object} - Update result
 */
async function declineTutorManagers(userId, statuschange) {
	const user = await usersModel.updateOne({ _id: userId }, { isDeleted: statuschange });
	return user;
}

/**
 * Updates user login status
 * Tracks whether user is currently logged in
 * 
 * @param {string} email - User's email address
 * @param {boolean} loginStatus - New login status
 * @returns {Object} - Update result
 */
async function statusForLogin(email, loginStatus) {
	const user = await usersModel.updateOne({ email: email }, { loginStatus: loginStatus });
	return user;
}

/**
 * Updates user logout status
 * Marks user as logged out
 * 
 * @param {string} userId - User ID
 * @param {boolean} loginStatus - New login status (false for logout)
 * @returns {Object} - Update result
 */
async function statusForLogout(userId, loginStatus) {
	let id = mongoose.Types.ObjectId(userId);
	const user = await usersModel.updateOne({ _id: id }, { loginStatus: loginStatus });
	return user;
}

/**
 * Retrieves tutors managed by a specific tutor manager
 * Used to show tutor manager their assigned tutors
 * 
 * @param {Object} search - Search criteria including manager ID
 * @param {string} sort - Sort field
 * @param {number} order - Sort order
 * @param {number} perpage - Items per page
 * @param {number} skip - Items to skip
 * @returns {Array} - Array of tutor objects
 */
async function getAllTutorsOfManagersList(search, sort, order, perpage, skip) {
	const user = await usersModel.find(search)
		.collation({ 'locale': 'en' })
		.sort({ [sort]: parseInt(order) })
		.skip(skip)
		.limit(perpage);
	return user;
}

/**
 * Retrieves a user by ID for update operations
 * Used before applying updates to ensure user exists
 * 
 * @param {string} userId - User ID to retrieve
 * @returns {Object} - User object
 */
async function checkUser(userId) {
	const user = await usersModel.findById(userId);
	return user;
}

/**
 * Saves updated user data
 * Persists changes to the database
 * 
 * @param {Object} updatedata - Updated user object
 * @returns {Object} - Saved user object
 */
async function userUpdate(updatedata) {
	return await updatedata.save();
}

/**
 * Retrieves comment for a specific tutor
 * Used to show feedback for tutors
 * 
 * @param {string} tutorId - Tutor ID
 * @returns {Object|null} - Comment object if found, null otherwise
 */
async function getComment(tutorId) {
	let comment = await commentModel.findOne({ tutorId: tutorId });
	return comment;
}

/**
 * Retrieves user session by token
 * Used for session validation
 * 
 * @param {string} token - JWT token
 * @returns {Object|null} - Session object if found, null otherwise
 */
async function getToken(token) {
	const userSesseionData = await userSesseion.findOne({ token: token });
	return userSesseionData;
}

/**
 * Removes device record for a tutor manager
 * Used during logout to clean up device registrations
 * 
 * @param {string} tutorManagerId - Tutor manager ID
 * @returns {Object} - Deletion result
 */
async function deleteTutorManagerDeviceRecord(tutorManagerId) {
	const user = await deviceModel.findOneAndDelete({ tmId: tutorManagerId });
	return user;
}

// Export all user service functions
module.exports = {
	validEmail,                           // Validate email existence
	validCode,                            // Validate verification codes
	validMobileNumber,                    // Validate mobile number uniqueness
	insertUser,                           // Create new users
	updateCode,                           // Mark codes as used
	getLocationData,                      // Get location information
	getSubjectData,                       // Get subject information
	insertSession,                        // Create user sessions
	getUsersList,                         // Get all users
	removeSession,                        // Remove user sessions
	getSingleUser,                        // Get single user
	userDelete,                           // Delete users
	getTutorManagersList,                 // Get tutor managers with pagination
	countTutorManager,                    // Count tutor managers
	getAllTutorManagers,                  // Get all tutor managers
	acceptTutorManagers,                  // Approve tutor managers
	declineTutorManagers,                 // Reject tutor managers
	getAllTutorsOfManagersList,           // Get tutors by manager
	checkUser,                            // Check user existence
	userUpdate,                           // Update user data
	getComment,                           // Get user comments
	getToken,                             // Get session by token
	statusForLogin,                       // Update login status
	statusForLogout,                      // Update logout status
	deleteTM,                             // Delete tutor manager
	deleteTMandTutors,                    // Delete manager and tutors
	deleteTutorManagerDeviceRecord        // Remove device records
};