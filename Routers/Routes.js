var express = require('express');
var router = express.Router();
var User = require('../Controllers/User');

router.post('/register', User.register);
router.post('/login', User.login);
router.get('/users', User.getUsers);
router.post('/forgotpassword', User.forgotPassword);
router.post('/resetpassword/:_id', User.resetPassword);
router.put('/updatepassword/:id', User.updatePassword);

module.exports = router;