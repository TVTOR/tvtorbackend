var express = require('express');
var router = express.Router();
var User = require('../controllers/User');
var Code = require('../controllers/Code');
var Authorization = require('../services/Auth');
var Subject = require('../controllers/Subjects');
var Location = require('../controllers/Locations');
const multer = require("multer");
var path = require('path');
const Notification = require('../controllers/Notification');
const Questions = require('../controllers/Questions');
const TutorAssign = require('../controllers/TutorAssign');
const TutorNotification = require('../controllers/TutorNotification');
const Message = require('../controllers/sendMessage');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(undefined, './public/images');
    },
    filename: function(req, file, cb) {
        cb(undefined, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback, res) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits: { fileSize: 100000000000000 }
});



router.post('/register', User.register);
router.post('/login', User.login);
router.get('/users', User.getUsers);
router.post('/forgotpassword', User.forgotPassword);
router.put('/resetpassword/:_id', Authorization.verifyToken, User.resetPassword);
router.put('/updatepassword/:id', User.updatePassword);
router.post('/randomnumber', Authorization.verifyToken, Code.randomNumber);
router.delete('/user/logout/:id', Authorization.verifyToken, User.logout);
router.get('/user/:id', Authorization.verifyToken, User.getUser);
router.delete('/user/:id', Authorization.verifyToken, User.deleteUser);
router.put('/user/:id', Authorization.verifyToken, upload.single('image'), User.updateUser);
router.get('/managers',Authorization.verifyToken, User.getAllTM);
router.get('/tutors', Authorization.verifyToken, User.getAllTutors);
router.put('/changeuserstatus/:id', Authorization.verifyToken, User.changeUserStatus);
router.put('/userdelete/:id', Authorization.verifyToken, User.changeUserDelete);
router.get('/getallTManager', Authorization.verifyToken, User.getAllTManager);
router.get('/getAllTutorsOfManager/:id', Authorization.verifyToken, User.getAllTutorsOfManager);

router.post('/subject', Subject.createSubjects);
router.get('/subject', Subject.getAllSubjects);
router.put('/subject/:id', Subject.updateSubjects);
router.delete('/subject/:id', Subject.deleteSubjects);
router.get('/subject/:id', Subject.getSingleSubject);

router.post('/location', Location.createLocations);
router.get('/location', Location.getAllLocations);
router.put('/location/:id', Location.updateLocations);
router.delete('/location/:id', Location.deleteLocations);
router.get('/location/:id', Location.getSingleLocation);

router.post('/notification', Authorization.verifyToken, Notification.createNotification);
router.get('/notification/:id', Authorization.verifyToken, Notification.getNotification);

router.post('/question', Questions.createQuestion);
router.get('/question', Questions.getQuestion);

router.post('/assigntutor', TutorAssign.assignTutor);
router.get('/sendNotificationToTutor/:id', TutorNotification.sendNotificationToTutor);
router.get('/getStudentTutor/:email', TutorAssign.getStudentTutor);


router.get('/message', Message.sendMessage);

module.exports = router;