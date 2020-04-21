var express = require('express');
var router = express.Router();
var User = require('../controllers/User');
var Code = require('../controllers/Code');
var Authorization = require('../services/Auth');
var Subject = require('../controllers/Subjects');
var Location = require('../controllers/Locations')


router.post('/register', User.register);
router.post('/login', User.login);
router.get('/users', User.getUsers);
router.post('/forgotpassword', User.forgotPassword);
router.post('/resetpassword/:_id', Authorization.verifyToken, User.resetPassword);
router.put('/updatepassword/:id', User.updatePassword);
router.post('/randomnumber', Code.randomNumber);
router.delete('/user/logout/:id', Authorization.verifyToken, User.logout);
router.get('/user/:id', User.getUser);
router.delete('/user/:id', Authorization.verifyToken, User.deleteUser);
router.put('/user/:id', Authorization.verifyToken, User.updateUser);
router.get('/managers', User.getAllTM);
router.get('/tutors', User.getAllTutors);
router.put('/changeuserstatus/:id', User.changeUserStatus);
router.put('/userdelete/:id', User.changeUserDelete);
router.get('/getallTManager', User.getAllTManager);
router.get('/getAllTutorsOfManager/:id', User.getAllTutorsOfManager);

router.post('/subject', Subject.createSubjects);
router.get('/subject', Subject.getAllSubjects);
router.put('/subject/:id', Subject.updateSubjects);
router.delete('/subject/:id', Subject.deleteSubjects);

router.post('/location', Location.createLocations);
router.get('/location', Location.getAllLocations);
router.put('/location/:id', Location.updateLocations);
router.delete('/location/:id', Location.deleteLocations);


module.exports = router;