var User = require('../models/User');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');
var utilServices = require('../services/Util');
var userSession = require('../models/Session');
var Code = require('../models/Code');
const uploadImage = require('../services/imageUpload');


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
              secretToken = jwt.sign({ _id: checkEmail._id, email: checkEmail.email, name: checkEmail.name, userType: checkEmail.userType }, config.jwtSecret, { expiresIn: '365d' });
              var userData = {
                userId: checkEmail._id,
                userType: checkEmail.userType,
                token: secretToken,
              } 
              res.header('access-token', secretToken);
              userSession.create(userData, (err, data)=>{
                if(err){
                  return utilServices.errorResponse(res, "Something went wrong", 401);
                } else {
                  var responseData = {
                    _id: checkEmail._id,
                    name: checkEmail.name,
                    surname: checkEmail.surname,
                    email: checkEmail.email,
                    location: checkEmail.location,
                    subjects: checkEmail.subjects,
                    token: secretToken,
                }
                  return utilServices.successResponse(res, "Login successfully", 201, responseData);
                }
              })
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
      let getCode = {
        code: req.body.code
      } 
      const checkCode = await Code.findOne(getCode); 
      if(!checkCode && req.body.userType == 'tutor'){
        return  utilServices.errorResponse(res, "Please enter valid code.", 400);
      } 
      if(checkCode && checkCode.used && req.body.userType == 'tutor'){
        return  utilServices.errorResponse(res, "This code already used.", 400);
      }

      if (checkCode) {
        var obj = {};
        obj.name = req.body.name,
        obj.surname = req.body.surname,
        obj.email = req.body.email,
        obj.password = User.hashPassword(req.body.password),
        obj.location = req.body.location,
        obj.subjects = req.body.subjects,
        obj.managerId = checkCode.managerId,
        obj.code = req.body.code,
        obj.userType = req.body.userType
        User.create(obj, async function(err, data) {
            if (err) {
                return utilServices.errorResponse(res, "Somthing went wrong", 500);
            } else {
        await Code.updateOne({code: req.body.code}, {used: true});
        secretToken = jwt.sign({ email: data.email, name: data.name, userType: data.userType }, config.jwtSecret, { expiresIn: '365d' });
        res.header('access-token', secretToken);
        var responseData = {
          _id: data._id,
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: data.password,
          location: data.location,
          subjects: data.subjects,
          code: data.code,
          managerId: data.managerId,
          userType: data.userType,
          token: secretToken
      }

        return utilServices.successResponse(res, "Tutor created successfully.", 200, responseData);
            }
        })
      } else {
        var obj = {};
        obj.name = req.body.name,
        obj.surname = req.body.surname,
        obj.email = req.body.email,
        obj.password = User.hashPassword(req.body.password),
        obj.location = req.body.location,
        obj.subjects = req.body.subjects,
        obj.status = req.body.status,
        obj.managerId = null,
        obj.isDeleted = req.body.isDeleted,
        obj.userType = req.body.userType
        User.create(obj, function(err, data) {
            if (err) {
                return utilServices.errorResponse(res, "Somthing went wrong", 500);
            } else {
              secretToken = jwt.sign({ email: data.email, name: data.name, userType: data.userType }, config.jwtSecret, { expiresIn: '365d' });
        res.header('access-token', secretToken);
        var responseData = {
          _id: data._id,
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: data.password,
          location: data.location,
          subjects: data.subjects,
          status: data.status,
          isDeleted: data.isDeleted,
          userType: data.userType,
          token: secretToken
      }
                return utilServices.successResponse(res, "Tutor manager created successfully.", 200, responseData);
            }
        })
      }
       
    }
  } catch (err) {
    console.log('Errror---------', err)
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
  
  const logout = function (req, res) {
    try {
      var userId = req.params.id;
    userSession.remove({ userId: userId }, function (err, data) {
        if (err) {
            return utilServices.errorResponse(res, "Something went wrong.", 500);
        } else {
            return utilServices.successResponse(res, "Successfully logOut", 200);
        }
    })
    } catch (error) {
      return utilServices.errorResponse(res, "Something went wrong.", 500);
    }
    }

const getUser = function(req, res){
  try {
      var userId = req.params.id;
      User.findById({_id: userId }, (err, data)=>{
        if(err){
          return utilServices.errorResponse(res, "Something went wrong.", 500);
        } else {
          return utilServices.successResponse(res, "Data found.", 200, data);
        }
      })
  } catch (error) {
    console.log('-------------', error)
    return utilServices.errorResponse(res, "Something went wrong.", 500);
  }
}
const updateUser = function(req, res){
  try {
    var userId = req.params.id;
    User.findById({_id: userId}, (err, updateData)=>{
      if(err){
        return utilServices.errorResponse(res, "Something went wrong.", 500);
      } else {
        if(!updateData){
          utilServices.errorResponse(res, "Data not found.", 500);
        } else {
          if(req.body.name){
            updateData.name = req.body.name
          }
          if(req.body.surname){
           updateData.surname = req.body.surname
         }
         if(req.body.location){
           updateData.location = req.body.location
         }
         if(req.body.subjects){
           updateData.subjects = req.body.subjects
         }
         if(req.file && req.file.path){
           uploadImage.imageUpload(req.file, function(err, data){
              if(err){
                utilServices.errorResponse(res, "Somthing went wrong", 500);
              } else {
                updateData.imageUrl = data.secure_url;
                updateData.save((err, data) => {
                 if (err) {
                     utilServices.errorResponse(res, "Somthing went wrong", 500);
                 } else {
                     utilServices.successResponse(res, "Data updated successfully", 200, data);
                 }
             })
              }
           })
         } else {
          updateData.save((err, data) => {
            if (err) {
                utilServices.errorResponse(res, "Somthing went wrong", 500);
            } else {
                utilServices.successResponse(res, "Data updated successfully", 200, data);
            }
        })
         }
        }
      }
    })
  } catch (error) {
    return utilServices.errorResponse(res, "Something went wrong.", 500);
  }
}

const deleteUser = function(req, res){
  try {
    var userId = req.params.id;
    User.findByIdAndDelete({_id: userId}, (err, data)=>{
      if(err){
        return utilServices.errorResponse(res, "Something went wrong.", 500);
      } else {
        if(!data){
          return utilServices.errorResponse(res, "Data not found.", 404);
        } else {
          return utilServices.successResponse(res, "Data deleted successfully.", 200);
        }
      }
    })
  } catch (error) {
    return utilServices.errorResponse(res, "Something went wrong.", 500);
  }
}

const getAllTM = async function (req, res){
  try {
    const query = req.query;
    const perpage = parseInt(query.length);
    const skip = parseInt(query.start)
    const search = {};
    if (query.searchdata) {
      if (query.searchdata.length > 0) {
        var value = new RegExp("^" + query.searchdata, "i");
        search['$or'] = [{ name: value }, { email: value }];
      }
    }
    search.userType = "tutormanager";
    search.status = false;
    search.isDeleted = false;
    const total = await User.count(search);
    await User.find(search)
    .sort({  'name': 1, 'createdAt': -1, })
    .skip(skip)
    .limit(perpage)
    .exec( function (err, data){
      if(err){
                return utilServices.errorResponse(res, "Something went wrong.", 500);
              } else {
                if(!data.length){
                  return utilServices.errorResponse(res, "Data not found.", 500);
                } else {
                  
                  return utilServices.successResponse(res, "Data found.", 200, {data: data, total: total});
                }
              }
    })
  } catch (error) {
    return utilServices.errorResponse(res, "Something went wrong.", 500);
  }
}


const getAllTManager = async function (req, res){
  try {
    // const query = req.query;
    // const perpage = 10;
    // const page = query.page;
    // const skip = (page * perpage) - perpage;
    const query = req.query;
    const perpage = parseInt(query.length);
    const skip = parseInt(query.start);
    console.log('----------------', query)
    const search = {};
    if (query.searchdata) {
      if (query.searchdata.length > 0) {
        var value = new RegExp("^" + query.searchdata, "i");
        search['$or'] = [{ name: value }, { email: value }];
      }
    }
    search.userType = "tutormanager";
    search.status = true;
    const total = await User.count(search);
       await User.find(search)
        .sort({ 'createdAt': -1, 'name': -1 })
        .skip(skip)
        .limit(perpage)
        .exec( function (err, data){
          if(err){
                    return utilServices.errorResponse(res, "Something went wrong.", 500);
                  } else {
                    if(!data.length){
                      return utilServices.errorResponse(res, "Data not found.", 500);
                    } else {
                      return utilServices.successResponse(res, "Data found.", 200, {data: data, total: total});
                    }
                  }
        })
  } catch (error) {
    return utilServices.errorResponse(res, "Something went wrong.", 500);
  }
}


const getAllTutors = async function (req, res){
  try {
    const query = req.query;
    const perpage = 10;
    const page = query.page;
    const skip = ( page * perpage) - perpage;
    await User.find({userType: "tutor"})
        .sort({ 'createdAt': -1, 'name': -1 })
        .skip(skip)
        .limit(perpage)
        .exec( function (err, data){
          if(err){
                    return utilServices.errorResponse(res, "Something went wrong.", 500);
                  } else {
                    if(!data.length){
                      return utilServices.errorResponse(res, "Data not found.", 500);
                    } else {
                      return utilServices.successResponse(res, "Data found.", 200, data);
                    }
                  }
        })
     } catch (error) {
    return utilServices.errorResponse(res, "Something went wrong.", 500);
  }
}

const changeUserStatus = async function(req, res){
  try {
       var userId = req.params.id;
       await User.updateOne({_id: userId}, {status : true})
       return utilServices.successResponse(res, "Status has been updated successfully.", 200); 
  } catch (error) {
    console.log(error)
    return utilServices.errorResponse(res, "Something went wrong.", 500);
  }
}

const changeUserDelete = async function(req, res){
  try {
       var userId = req.params.id;
       await User.updateOne({_id: userId}, {isDeleted : true})
       return utilServices.successResponse(res, "Status has been deleted successfully.", 200); 
  } catch (error) {
    return utilServices.errorResponse(res, "Something went wrong.", 500);
  }
}

const getAllTutorsOfManager = async function(req, res){
  try {
    const query = req.query;
    const perpage = parseInt(query.length);
    const skip = parseInt(query.start);
    const search = {};
    if (query.searchdata) {
      if (query.searchdata.length > 0) {
        var value = new RegExp("^" + query.searchdata, "i");
        search['$or'] = [{ name: value }, { email: value }];
      }
    }
    const tmId = req.params.id;
    search.userType = "tutor";
    search.isDeleted = false;
    search.managerId = tmId
    const total = await User.count(search);
   await User.find(search)
   .sort({ 'name': 1 })
   .skip(skip)
   .limit(perpage)
   .exec( function (err, data){
     if(err){
               return utilServices.errorResponse(res, "Something went wrong.", 500);
             } else {
               if(!data.length){
                 return utilServices.errorResponse(res, "Data not found.", 500);
               } else {
                 return utilServices.successResponse(res, "Data found.", 200, {data: data, total: total});
               }
             }
   })
    // return utilServices.successResponse(res, "Data found.", 200, tdata);
  } catch (error) {
    return utilServices.errorResponse(res, "Something went wrong.", 500);
  }
}



module.exports = {
    getUsers: getUsers,
    register: register,
    login: login,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    updatePassword: updatePassword,
    logout: logout,
    getUser: getUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllTM: getAllTM,
    getAllTutors: getAllTutors,
    changeUserStatus: changeUserStatus,
    changeUserDelete: changeUserDelete,
    getAllTManager: getAllTManager,
    getAllTutorsOfManager: getAllTutorsOfManager
}