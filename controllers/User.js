var User = require('../models/User');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');
var utilServices = require('../services/Util');
var userSession = require('../models/Session');
var Code = require('../models/Code');
const uploadImage = require('../services/imageUpload');
var Device = require('../models/Device');
var Subjects = require('../models/Subjects');
var mongoose = require('mongoose');
const userService = require('../services/users');
var Locations = require('../models/Locations');
const authHelper = require('../helper/auth');
const { constants } = require(`${appRoot}/lib/constants`);

let login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return utilServices.errorResponse(res, constants.PARAMETER_MISSING, 401);
    }
    const checkEmail = await userService.validEmail(req.body.email);
    if (!checkEmail) {
      return utilServices.errorResponse(res, constants.INCORRECT_EMAIL, 401);
    }
    if(checkEmail.status === false && checkEmail.userType === 'tutormanager'){
      return utilServices.errorResponse(res, constants.VERIFY_STATUS, 401);
    }
    const encryptedPassword = authHelper.validatePassword(req.body.password, checkEmail.password);
    if (!encryptedPassword) {
      return utilServices.errorResponse(res, constants.LOGIN_INCORRECT_PASSWORD, 401);
    }
    const secretToken = await authHelper.generateJWToken(checkEmail);
    const result = await userService.insertSession(checkEmail._id, checkEmail.userType, secretToken);
    res.header('access-token', secretToken);
    if (!result) {
      return utilServices.errorResponse(res, constants.DB_ERROR, 401);
    } else {
      if (checkEmail.location) {
        checkEmail.locationData = await getAllLocation(checkEmail.location);
      }
      if (checkEmail.subjects) {
        checkEmail.subjectData = await getAllSubject(checkEmail.subjects);
      }
      const responseData = response(checkEmail, secretToken);
      // await userService.insertDevice(req.body, checkEmail.userType, checkEmail._id);
      return utilServices.successResponse(res, constants.LOGIN_SUCCESS, 201, responseData);
    }
  } catch (err) {
    return utilServices.errorResponse(res, constants.DB_ERROR, 400);
  }
};

async function getAllLocation(location) {
  let locationData = await userService.getLocationData(location);
  return locationData = await locationData.map((locationData) => {
    return { _id: locationData._id, location: locationData.location }
  });
}

async function getAllSubject(subject) {
  let subjectData = await userService.getSubjectData(subject);
  return subjectData = await subjectData.map((subjectData) => {
    return { _id: subjectData._id, subject: subjectData.subject, colorcode: subjectData.colorcode }
  });
}

const register = async (req, res) => {
  try {
    const checkEmail = await userService.validEmail(req.body.email);
    if (checkEmail) {
      return utilServices.errorResponse(res, constants.USER_ALREADY_EXIST, 409);
    } else {
      const checkCode = await userService.validCode(req.body.code);
      if (!checkCode && req.body.userType == 'tutor') {
        return utilServices.errorResponse(res, constants.VALID_TOKEN, 400);
      }
      if (checkCode && checkCode.used && req.body.userType == 'tutor') {
        return utilServices.errorResponse(res, constants.CODE_EXIST, 400);
      }
      const checkMobile = await userService.validMobileNumber(req.body.mobileNumber);
      if (checkMobile > 0) {
        return utilServices.errorResponse(res, constants.MOBILE_EXIST, 409);
      }
      if (checkCode) {
        const password = authHelper.bcryptPassword(req.body.password);
        const data = await userService.insertUser(req.body, password, checkCode.managerId);
        if (!data) {
          return utilServices.errorResponse(res, constants.DB_ERROR, 500);
        } else {
          await userService.updateCode(req.body.code);
          if (req.body.location) {
            data.locationData = await getAllLocation(req.body.location);
          }
          if (req.body.subjects) {
            data.subjectData = await getAllSubject(req.body.subjects);
          }
          const secretToken = await authHelper.generateJWToken(data);
          res.header('access-token', secretToken);
          const responseData = response(data, secretToken);
          return utilServices.successResponse(res, constants.TUTOR_CREATE, 200, responseData);
        }
      } else {
        const password = authHelper.bcryptPassword(req.body.password);
        const data = await userService.insertUser(req.body, password);
        if (!data) {
          return utilServices.errorResponse(res, constants.DB_ERROR, 500);
        } else {
          if (req.body.location) {
            data.locationData = await getAllLocation(req.body.location);
          }
          if (req.body.subjects) {
            data.subjectData = await getAllSubject(req.body.subjects);
          }
          const secretToken = await authHelper.generateJWToken(data);
          res.header('access-token', secretToken);
          const responseData = response(data, secretToken);
          return utilServices.successResponse(res, constants.TUTOR_CREATE, 200, responseData);
        }
      }
    }
  } catch (err) {
    console.log('Eofoforororoor', err);
    return utilServices.errorResponse(res, constants.DB_ERROR, 401);
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
      return utilServices.errorResponse(res, "Password not matched", 401);
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
        if (req.body.password) {
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


const getUsers = async (req, res) => {
  try {
    const data = await userService.getUsersList()
    if (!data) {
      return utilServices.errorResponse(res, constants.DATA_NOT_FOUND, 500);
    } else {
      return utilServices.successResponse(res, constants.DATA_FOUND, 200, data);
    }
  } catch (error) {
    return utilServices.errorResponse(res, constants.DB_ERROR, 401);
  }
}

const logout = async function (req, res) {
  try {
    var userId = req.params.id;
    await userService.removeSession(userId);
    return utilServices.successResponse(res, constants.LOGOUT, 200);
  } catch (error) {
    return utilServices.errorResponse(res, constants.DB_ERROR, 401);
  }
}

const getUser = async function (req, res) {
  try {
    var userId = req.params.id;
    var data = await userService.getSingleUser(userId);
    if (!data) {
      return utilServices.errorResponse(res, constants.DATA_NOT_FOUND, 400);
    }
    data = data.toJSON();
    let location = await getLocation(data.location);
    let subject = await getSubject(data.subjects);
    let allLocationList = await getAllLocationList();
    data.locationList = allLocationList;
    data.locationData = location;
    data.subjectData = subject;
    return utilServices.successResponse(res, constants.DATA_FOUND, 200, data);
  } catch (error) {
    return utilServices.errorResponse(res, constants.DB_ERROR, 500);
  }
}

async function getAllLocationList() {
  const loactionList = await Locations.find({});
  return locationData = await loactionList.map((locationData) => {
    return { _id: locationData._id, location: locationData.location }
  });
}

async function getLocation(location) {
  var getLocation = await Locations.find({ _id: { $in: location } })
  return locationData = await getLocation.map((locationData) => {
    return locationData.location
  });
}

async function getSubject(subject) {
  var getSubjects = await Subjects.find({ _id: { $in: subject } })
  return SubjectData = await getSubjects.map((subjectData) => {
    return subjectData.subject
  });
}


const updateUser = async function (req, res) {
  try {
    var userId = req.params.id;
    const updateData = await userService.checkUser(userId)
    if (!updateData) {
      return utilServices.errorResponse(res, constants.DATA_NOT_FOUND, 404);
    }
    if (req.body.name) {
      updateData.name = req.body.name;
    }
    if (req.body.surname) {
      updateData.surname = req.body.surname;
    }
    if (req.body.location) {
      var splitLocation = req.body.location.split(',').map((elem) => mongoose.Types.ObjectId(elem))
      updateData.location = splitLocation;
      var getLocation = await Locations.find({ _id: { $in: splitLocation } })
      updateData.locationData = await getLocation.map((locationData) => {
        return { _id: locationData._id, location: locationData.location }
      })
    }
    if (req.body.subjects) {
      var splitSubject = req.body.subjects.split(',').map((elem) => mongoose.Types.ObjectId(elem))
      updateData.subjects = splitSubject;
      var getSubject = await Subjects.find({ _id: { $in: splitSubject } })
      updateData.subjectData = await getSubject.map((subjectData) => {
        return { _id: subjectData._id, subject: subjectData.subject }
      })
    }
    if (req.body.availability) {
      updateData.availability = req.body.availability;
    }
    if (req.body.description) {
      updateData.description = req.body.description;
    }
    if (req.body.mobileNumber) {
      updateData.mobileNumber = req.body.mobileNumber;
    }
    if (req.file && req.file.path) {
      uploadImage.imageUpload(req.file, async function (err, data) {
        if (err) {
          return utilServices.errorResponse(res, constants.DB_ERROR, 500);
        }
        updateData.imageUrl = data.secure_url;
        const data1 = await userService.userUpdate(updateData)
        return utilServices.successResponse(res, constants.UPDATE_DATA, 200, data1);
      })
    } else {
      const data1 = await userService.userUpdate(updateData)
      return utilServices.successResponse(res, constants.UPDATE_DATA, 200, data1);
    }
  } catch (error) {
    return utilServices.successResponse(res, constants.DB_ERROR, 500);
  }
}

const deleteUser = async function (req, res) {
  try {
    const userId = req.params.id;
    const data = await userService.userDelete(userId);
    if (!data) {
      return utilServices.errorResponse(res, constants.DATA_NOT_FOUND, 400);
    }
    return utilServices.successResponse(res, constants.DATA_DELETE, 200);
  } catch (error) {
    return utilServices.successResponse(res, constants.DB_ERROR, 500);
  }
}

const getAllTM = async function (req, res) {

  try {
    const query = req.query;
    const perpage = parseInt(query.length);
    const skip = parseInt(query.start)
    const search = {};
    const order = (query.dir == 'asc' && parseInt(query.column) > 0) ? 1 : -1;
    let sort = 'createdAt';
    if (parseInt(query.column) == 1) {
      sort = 'name'
    }
    if (parseInt(query.column) == 2) {
      sort = 'email'
    }
    if (query.searchdata) {
      if (query.searchdata.length > 0) {
        var value = new RegExp("^" + query.searchdata, "i");
        search['$or'] = [{ name: value }, { email: value }];
      }
    }
    search.userType = "tutormanager";
    search.status = false;
    search.isDeleted = false;

    const total = await userService.countTutorManager(search);
    const data = await userService.getTutorManagersList(search, sort, order, perpage, skip);
    return utilServices.successResponse(res, constants.DATA_FOUND, 200, { data: data, total: total });
  } catch (error) {
    return utilServices.successResponse(res, constants.DB_ERROR, 500);
  }
}


const getAllTManager = async function (req, res) {
  try {
    const query = req.query;
    const perpage = parseInt(query.length);
    const skip = parseInt(query.start);
    const search = {};
    const order = (query.dir == 'asc') ? 1 : -1;
    let sort = 'createdAt';
    if (parseInt(query.column) == 1) {
      sort = 'name'
    }
    if (query.searchdata) {
      if (query.searchdata.length > 0) {
        var value = new RegExp("^" + query.searchdata, "i");
        search['$or'] = [{ name: value }, { email: value }];
      }
    }
    search.userType = "tutormanager";
    search.status = true;
    const total = await userService.countTutorManager(search);
    const data = await userService.getTutorManagersList(search, sort, order, perpage, skip)
    if (!data.length > 0) {
      return utilServices.successResponse(res, constants.DATA_NOT_FOUND, 404);
    }
    return utilServices.successResponse(res, constants.DATA_FOUND, 200, { data: data, total: total });
  } catch (error) {
    return utilServices.successResponse(res, constants.DB_ERROR, 500);
  }
}


const getAllTutors = async function (req, res) {
  try {
    const query = req.query;
    const perpage = 10;
    const page = query.page;
    const skip = (page * perpage) - perpage;
    await User.find({ userType: "tutor", isDeleted: false })
      .sort({ 'createdAt': -1, 'name': -1 })
      .skip(skip)
      .limit(perpage)
      .exec(function (err, data) {
        if (err) {
          return utilServices.errorResponse(res, "Something went wrong.", 500);
        } else {
          if (!data.length) {
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

const changeUserStatus = async function (req, res) {
  try {
    var userId = req.params.id;
    var statuschange = true;
    await userService.acceptTutorManagers(userId, statuschange)
    return utilServices.successResponse(res, constants.ACCEPT_TM, 200);
  } catch (error) {
    console.log(error)
    return utilServices.successResponse(res, constants.DB_ERROR, 500);
  }
}

const changeUserDelete = async function (req, res) {
  try {
    var userId = req.params.id;
    var statuschange = true
    await userService.declineTutorManagers(userId, statuschange)
    return utilServices.successResponse(res, constants.DECLINE_TM, 200);
  } catch (error) {
    return utilServices.successResponse(res, constants.DB_ERROR, 500);
  }
}

const getAllTutorsOfManager = async function (req, res) {
  try {
    const query = req.query;
    const perpage = parseInt(query.length);
    const skip = parseInt(query.start);
    const search = {};
    const order = (query.dir == 'asc' && parseInt(query.column) > 0) ? 1 : -1;
    let sort = 'createdAt';
    if (parseInt(query.column) == 1) {
      sort = 'name'
    }
    if (parseInt(query.column) == 2) {
      sort = 'email'
    }
    if (query.searchdata) {
      if (query.searchdata.length > 0) {
        var value = new RegExp("^" + query.searchdata, "i");
        search['$or'] = [{ name: value }, { email: value }];
      }
    }
    const tmId = req.params.id;
    search.userType = "tutor";
    search.isDeleted = false;
    search.managerId = mongoose.Types.ObjectId(tmId);
    const total = await userService.countTutorManager(search);
    var data = await userService.getAllTutorsOfManagersList(search, sort, order, perpage, skip)
    // console.log('=======data========', data);
  
    data = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < data.length; i++) {
      var subjects = await getAllSubject(data[i].subjects);
      data[i].subjectData = subjects;
      var commentdata = await userService.getComment(data[i]._id);
      data[i].comment = commentdata ? commentdata.comment : null;
    }
    if (!data.length > 0) {
      return utilServices.successResponse(res, constants.DATA_NOT_FOUND, 404);
    }
    return utilServices.successResponse(res, constants.DATA_FOUND, 200, { data: data, total: total });
  }
  catch (error) {
    console.log('================', error);
    return utilServices.successResponse(res, constants.DB_ERROR, 500);
  }

}
function response(data, token) {
  return responseData = {
    _id: data._id,
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: data.password,
    mobileNumber: data.mobileNumber,
    subjectData: data.subjectData,
    locationData: data.locationData,
    code: data.code,
    managerId: data.managerId,
    userType: data.userType,
    token: token
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
  getAllTutorsOfManager: getAllTutorsOfManager,
  getAllSubject: getAllSubject,
  getAllLocation: getAllLocation
}