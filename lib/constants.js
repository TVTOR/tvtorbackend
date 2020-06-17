'use strict';

//Tables
// const tables = {
//   student: 'student',
//   universities: 'universities'
// };

//constant variable message
const constants = {
  DEFAULT_DB_PORT: 3306,
  DEFAULT_APP_PORT: 3000,
  LOGIN_SUCCESS: 'Login successfully!',
  LOGIN_INCORRECT_PASSWORD: 'Please enter correct password!',
  UNAUTHORIZED_MSG: 'Unauthorized Access!',
  USER_NOT_FOUND: 'User Not Found!',
  SUCCESS: 'success',
  DB_ERROR: 'Something went wrong!',
  REGISTER_SUCCESS: 'You have been register successfully!',
  INCORRECT_EMAIL: 'Email-id does not exist!',
  USER_ALREADY_EXIST: 'This email is already exist!',
  PASSWORD_TOKEN_EXP: 'not valid',
  PASSWORD_UPDATED: 'Password has been updated successfully!',
  VALID_TOKEN: "Please enter valid code.",
  CODE_EXIST: "This code already used.",
  MOBILE_EXIST: "Mobile number already registered",
  TUTOR_CREATE: "Tutor created successfully.",
  PARAMETER_MISSING: "Parameters are missing",
  DATA_FOUND: "Data found",
  DATA_NOT_FOUND: "Data not found",
  LOGOUT: "Successfully logout",
  DATA_DELETE: "Data deleted successfully",
  ACCEPT_TM: "Tutor manager has been accepted successfully",
  DECLINE_TM: "Data deleted successfully",
  UPDATE_DATA: "Data updated successfully",
  CREATE_SUBJECT: "Subject created successfully",
  CREATE_LOCATION: "Location created successfully",
  SUBJECT_ALREADY_EXIST: "This subject already exist",
  LOCATION_ALREADY_EXIST: "This location already exist",
  CREATE_CODE: "Randomcode generated successfully",
  CREATE_NOTIFICATION: "Notification created successfully",
  CREATE_QUESTIONS: "Questions created successfully",
  CREATE_COMMENTS: "Comment created successfully",
  CREATE_DEVICES: "Device created successfully",
  VERIFY_STATUS: "You have to verify from admin",
  ALREADY_ASSIGNED_TUTOR: "This tutor already has been assigned by some one.",
  REQUEST_EXPIRED: "Request has been expired.",
  ASSIGN_TUTOR:"Assign Tutor Successfully",
  TIME_SESSION: "Your time session out."
};

const jwtErrors = {
  TokenExpiredError: 'Token has been expired!',
  JsonWebTokenError: 'Token is not valid!',
  NotBeforeError: 'Token is not Active!'
};


module.exports = {
  constants,
  jwtErrors
};
constants.js