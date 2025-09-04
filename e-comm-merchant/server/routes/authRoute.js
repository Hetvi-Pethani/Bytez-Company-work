const express = require('express');

const routes = express.Router();

const { loginUser, registerUser, forgotPassword, usernewPassword, userOtp, otpPage } = require('../controller/userController');


routes.post('/register', registerUser);
routes.post('/login', loginUser);
routes.post('/forgotPassword', forgotPassword);
routes.post('/usernewPassword', usernewPassword);
routes.post('/userOtp', userOtp);
routes.post('/otpPage', otpPage);





module.exports = routes;
