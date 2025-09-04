const express = require('express');

const routes = express.Router();

const { loginUser, registerUser } = require('../controller/userController');


routes.post('/register', registerUser);
routes.post('/login', loginUser);


module.exports = routes;
