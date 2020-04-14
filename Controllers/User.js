var User = require('../Models/User');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');
var utilServices = require('../Services/Util');


let login = async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        return utilServices.errorResponse(res, "Parameters are missing", 401);
      } else {
        try {
          let criteria = {
            email: req.body.email
          };
          const checkEmail = await User.findOne(criteria);
          if (checkEmail) {
            let encryptedPassword = await bcrypt.compare(req.body.password, checkEmail.password);
            if (encryptedPassword) {
              secretToken = jwt.sign({ email: checkEmail.email, name: checkEmail.name, rollId: checkEmail.rollId }, 'secretKey', { expiresIn: '2minutes' })
              res.status(200).json({ message: 'Logged in successfully!', success: true, token: secretToken, record: checkEmail });
            } else {
              return utilServices.errorResponse(res, "Please enter correct password.", 401);
            }
          } else {
            return utilServices.errorResponse(res, "Email does not exist!", 401);
          }
        } catch (error) {
          return utilServices.errorResponse(res, "Something went wrong", 401);
        }
      }
    } catch (err) {
        return utilServices.errorResponse(res, "Something went wrong", 400);
    }
  };

const register = async (req, res) => {
    try {
      let criteria = {
        email: req.body.email
      }
      const checkEmail = await User.find(criteria);
      if (checkEmail.length > 0) {
        return utilServices.errorResponse(res, "Email already registered", 409);
      } else {
          const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: User.hashPassword(req.body.password),
            location: req.body.location,
            subjects: req.body.subjects,
            role: req.body.role
          });
          return user.save().then((doc) => {
            const data = {
              id: doc._id,
              email: doc.email,
              surname: doc.surname,
              name: doc.name,
              password: doc.password,
              location: doc.location,
              subjects: doc.subjects,
              role: doc.role
            };
            return utilServices.successResponse(res, "User created successfully", 201, data);
          }).catch((err) => {
            return utilServices.errorResponse(res, "Something went wrong", 401);
          });
      }
    } catch (err) {
      return utilServices.errorResponse(res, "Something went wrong", 401);
    }
  };



const forgotPassword = async (req, res) => {
    try {
        await User.findOne({ email: req.body.email.toLowerCase() }, (err, data) => {
            if (err) {
              return utilServices.errorResponse(res, "Something went wrong", 401);
            } else {
                if (!data) {
                    return utilServices.errorResponse(res, "Email not found", 401);
                } else {
                    let transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                          user: 'sunilskv37@gmail.com', // generated ethereal user
                          pass: '9696533366@#123' // generated ethereal password
                        }
                      });
                    
                    var mailOptions = {
                        from: 'sunilskv37@gmail.com',
                        to: req.body.email,
                        subject: 'Link to reset password.',
                        text: 'IMS',
                        html: '<h1>Change your password</h1><a href ="' + config.API_URL + '/forgotpassword?id=' + data._id + '">Please click here to change your password</a></b>'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    return utilServices.successResponse(res, "Please check your email to reset password.", 201);
                  }
            }
        });
    } catch (error) {
      return utilServices.errorResponse(res, "Something went wrong", 401);
    }
}


const resetPassword = async (req, res) => {
    try {
      const getUser = await User.findOne({ _id: req.params._id });
      let encryptedPassword = await bcrypt.compare(req.body.oldPassword, getUser.password);
      if (encryptedPassword) {
        let passwordToUpadate = {
          password: User.hashPassword(req.body.resetPassword)
        }
        await User.findByIdAndUpdate({ _id: req.params._id }, passwordToUpadate, (err, updatedPassword) => {
          if (err) {
            return utilServices.errorResponse(res, "Something went wrong", 401);
          } else {
            if (!updatedPassword) {
              return utilServices.errorResponse(res, "Data not found", 401);
            } else {
              return utilServices.successResponse(res, "Password successfully reset.", 201);
            }
          }
        });
      } else {
        return utilServices.errorResponse(res, "Something went wrong", 401);
      }
    } catch (err) {
      return utilServices.errorResponse(res, "Something went wrong", 401);
    }
  }


const updatePassword = async (req, res) => {
  try {
    User.findById({ _id: req.params.id }, async function (err, obj) {
      if (err) {
        return utilServices.errorResponse(res, "Something went wrong", 401);
      } else {
        if(req.body.password){
            obj.password = User.hashPassword(req.body.password);
            obj.save(function (err, data) {
                if (err) {
                  return utilServices.errorResponse(res, "Something went wrong", 401);
                } else {
                    return utilServices.successResponse(res, "Password successfully updated.", 201);
                }
            })
        } else {
          return utilServices.errorResponse(res, "Something went wrong", 401);
        }
      }
  })
  } catch (err) {
    return utilServices.errorResponse(res, "Something went wrong", 401);
  }
}


const getUsers = (req, res) => {
    try {
      User.find({}, (err, data) => {
        if (err) {
          return utilServices.errorResponse(res, "Something went wrong", 401);
        } else {
          if (!data) {
            return utilServices.errorResponse(res, "Data not found", 401);
          } else {
            return utilServices.successResponse(res, "Data found.", 201, data);
          }
        }
      })
    } catch (err) {
      return utilServices.errorResponse(res, "Something went wrong", 401);
    }
  }
  

module.exports = {
    getUsers: getUsers,
    register: register,
    login: login,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    updatePassword: updatePassword
}