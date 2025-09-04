const express = require('express');

const routes = express.Router();

const passport = require('passport');

const { loginPage, registerPage, registerUser, loginUser, deshboardPage, logout, otpPage, newpasswordPage, forgotPassword, userOtp, usernewPassword } = require('../controllers/AuthController');


routes.get('/', loginPage);
routes.get('/register', registerPage)
routes.post('/registeruser', registerUser)
routes.post('/loginuser', passport.authenticate('local', { failureRedirect: '/' }), loginUser)



routes.get('/deshboard', passport.checkUser, deshboardPage)
routes.get('/logout', logout)

//forgot password
routes.get('/otp', otpPage)
routes.get('/newpassword', newpasswordPage)
routes.post('/forgotpassword', forgotPassword)
routes.post('/userotp', userOtp)
routes.post('/usernewpassword', usernewPassword)




module.exports = routes