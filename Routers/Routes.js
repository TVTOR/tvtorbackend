var express = require('express');
var router = express.Router();
var User = require('../Controllers/User');

router.post('/users', User.register);
router.post('/login', User.login);
router.get('/users', User.getUsers);
router.post('/forgotpassword', User.forgotPassword);
router.post('/resetpassword/:_id', User.resetPassword);

module.exports = router;