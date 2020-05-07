'use strict';

const httpStatus = require('http-status-codes');
const jwtValidator = require(`${appRoot}/validator/jwt`);
const secret = require(`${appRoot}/config/config`).jwtSecret;
const jwtErrors  = require(`${appRoot}/lib/constants`);
const bcrypt = require('bcrypt');

function generateJWToken(data) {
  const payload = { _id: data._id, email: data.email, name: data.name, userType: data.userType };
  return jwtValidator.createToken(payload, secret);
}

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

function bcryptPassword(password){
  return bcrypt.hashSync(password, 10);
}

function validatePassword(userPassword, password) {
  return bcrypt.compareSync(userPassword, password);
}



module.exports = {
  generateJWToken,
  decodeJWToken,
  bcryptPassword,
  validatePassword
};
