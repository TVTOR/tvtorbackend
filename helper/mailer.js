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
  
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // use TLS
//     auth: {
//       user: config.EMAIL_ID,
//       pass: config.PASSWORD
//       // user: "coupanbasedbackend@gmail.com",
//       // pass: "Ongraph@123"
//     },
//     tls: {
//       // do not fail on invalid certs
//       rejectUnauthorized: false
//     }
//   });

  module.exports = {
      sendMail
  }