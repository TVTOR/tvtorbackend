var User = require('../Models/User');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var tokener = require('../Services/Tokener');
var bcrypt = require('bcryptjs');


var userRegistration = async(req, res) => {
    try {
        var obj = {};
        obj.firstName = req.body.firstName;
        obj.lastName = req.body.lastName,
            obj.email = req.body.email;
        obj.password = req.body.password;
        obj.address = req.body.address;
        var emailCheck = await User.find({ email: req.body.email });
        if (emailCheck.length > 0) {
            res.status(400).json({ message: 'Email already exists!' })
        } else {
            User.create(obj, (err, data) => {
                if (err) {
                    res.status(400).json({ message: "Something went wrong" });
                } else {
                    res.status(200).json({ data, message: 'User registered successfully!' })
                }
            })
        }

    } catch (error) {
        res.status(400).json({ message: "Something went wrong" });
    }
}


let login = async (req, res) => {
    console.log('----------------------------')
    try {
      if (!req.body.email || !req.body.password) {
        res.status(401).json({ message: 'Parameters are missing' });
      } else {
        try {
          let criteria = {
            email: req.body.email
          };
          console.log('-----------criteria---------', criteria);
          const checkEmail = await User.findOne(criteria);
          if (checkEmail) {
            let encryptedPassword = await bcrypt.compare(req.body.password, checkEmail.password);
            console.log('----encryptedPassword--------', encryptedPassword)
            if (encryptedPassword) {
              secretToken = jwt.sign({ email: checkEmail.email, name: checkEmail.name }, 'secretKey', { expiresIn: '2minutes' })
              res.status(200).json({ message: 'Logged in successfully!', success: true, token: secretToken, record: checkEmail });
            } else {
              res.status(401).json({ message: 'Incorrect password' });
            }
          } else {
            res.status(401).json({ message: 'Email not exist!' });
          }
        } catch (error) {
          console.log('Error', error);
          res.status(401).json({ message: 'Something went wrong', error: error });
        }
      }
    } catch (err) {
        return res.status(400).json({ message: "Something went wrong" });
    }
  };

const register = async (req, res) => {
    try {
      let criteria = {
        email: req.body.email
      }
      const checkEmail = await User.find(criteria);
      if (checkEmail.length > 0) {
        res.status(401).json({ message: 'Email already registered' })
      } else {
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: User.hashPassword(req.body.password),
            createdOn: Date.now(),
          });
          return user.save().then((doc) => {
            const data = {
              id: doc._id,
              email: doc.email,
              name: doc.name,
              password: doc.password,
            };
            const tmp = {
              id: user._id,
              email: user.email,
              name: user.name,
            };
            const token = jwt.sign(tmp, config.jwtSecret, { expiresIn: '48h' });
            return res.status(201).json({ success: true, token: token, user: data });
          }).catch((err) => {
              console.log('-------------error', err)
            return res.status(400).json({ success: false, error: err });
          });
      }
    } catch (err) {
        console.log('---------------err', err)
      return res.status(400).json({ message: "Something went wrong" })
    }
  };

var userLogin = async(req, res) => {
    try {
        User.findOne({ email: req.body.email }, (err, data) => {
            if (err) {
                res.status(400).json({ message: "Something went wrong" })
            } else {
                if (!data) {
                    res.status(404).json({ message: "Not found" })
                } else {
                    if (req.body.password == data.password) {
                        var token = jwt.sign({ name: data.name, _id: data._id }, 'shhhhh');
                        var responseData = {
                            _id: data._id,
                            name: data.name,
                            email: data.email,
                        }
                        res.status(404).json({ responseData, token, message: "User login successfully" })
                    } else {
                        res.status(404).json({ message: "Enter correct password" })
                    }
                }
            }
        })
    } catch (error) {
        return res.status(400).json({ message: "Something went wrong" })
    }
}


const forgotPassword = async (req, res) => {
  console.log('--------Forgot password--------');
    try {
        await User.findOne({ email: req.body.email.toLowerCase() }, (err, data) => {
            if (err) {
                return res.status(400).json({ message: "Something went wrong" })
            } else {
                if (!data) {
                    return res.status(400).json(res, 'Email not found');
                } else {
                    console.log('------------------', data)
                    // var token = tokener.generateJwt(data);
                    // var userId = data._id;
                    // var sessionData = {
                    //     userId: userId,
                    //     token: token
                    // }
                    // UserSession.create(sessionData, function (err, data) { });
                    // var transporter = nodemailer.createTransport({
                    //     host: 'smtp.gmail.com',
                    //     port: 587,
                    //     secure: false,
                    //     auth: {
                    //         user: 'sunilskv37@gmail.com',
                    //         pass: '9696533366@#123'
                    //     }
                    // });
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
                        subject: 'Link to reset IMS password.',
                        text: 'IMS',
                        // html: '<h1>Change your password</h1><a href ="' + config.jwtSecret + '/forgotPassword?token=' + token + '">Please click here to change your password</a></b>'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    return res.status(400).json({message: "Please check your email to reset password."});
                }
            }
        });
    } catch (error) {
        return res.status(400).json({message: "Something went wrong."});
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
              console.log('--------1--------', err)
            res.status(401).json({ success: false, message: "Something went wrong." });
          } else {
            if (!updatedPassword) {
              res.status(404).json({ success: false, message: "Data not found." });
            } else {
              res.status(200).json({ success: true, message: "Password successfully updated." });
            }
          }
        });
      } else {
        res.status(404).json({ success: false, message: "Password not matched." });
      }
    } catch (err) {
        console.log('--------1--------', err)
        res.status(401).json({ success: false, message: "Something went wrong." });
    }
  }


const getUsers = (req, res) => {
    try {
      User.find({}, (err, data) => {
        if (err) {
          res.status(401).json({ success: false, message: "Something went wrong." });
        } else {
          if (!data) {
            res.status(404).json({ success: false, message: "Data not found." });
          } else {
            res.status(200).json({ data });
          }
        }
      })
    } catch (err) {
        res.status(401).json({ success: false, message: "Something went wrong." });
    }
  }
  

module.exports = {
    userRegistration: userRegistration,
    userLogin: userLogin,
    getUsers: getUsers,
    register: register,
    login: login,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword
}