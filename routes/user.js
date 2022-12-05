const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user/userModel');
const user = require('../controllers/user/authController');

router.route('/signup')
    .get(user.renderRegister)
    .post(catchAsync(user.register));

router.route('/login')
    .get(user.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.login)

router.get('/logout', user.logout)

module.exports = router;