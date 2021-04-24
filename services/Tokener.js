var crypto = require('crypto'),
  jwt = require('jsonwebtoken'),
  config = require('../config/config');

module.exports.generateJwt = function (user) {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: user._id,
    email: user.email,
    exp: parseInt(expiry.getTime() * 1000),
  }, config.jwtSecret);
};