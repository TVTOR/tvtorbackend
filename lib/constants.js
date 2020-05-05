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