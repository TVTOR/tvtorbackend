const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const config = require('../config/config');

async function sendMail(mailOptions) {
    let transporter = nodemailer.createTransport(smtpTransport({
      service: "gmail",
      secure: true,
      "auth": {
        "user": config.EMAIL,
        "pass": config.PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    }));
  
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info);
        return true;
      }
    });
  }
  module.exports = {
      sendMail
  }