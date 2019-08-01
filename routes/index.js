'use strict';

// importing third party module
const express = require('express');

let formData = express.urlencoded({ extended: false });

// importing custom module
let auth = require('../auth');
let dashboard = auth.dashboard;
let register = auth.register;
let login = auth.login;
let forPassword = auth.forPassword;
let logout = auth.logout;

// creating router objects
const routes = express.Router();

// for domain
let url = '';

// router middleware
routes.use(function(req, res, next) {
  // to get domain
  let host = req.hostname;
  let protocol = req.protocol;
  url = protocol + '://' + host;
  next();
});

/* ============================ Config routes ================================ */

/* ---------------------------- Registration  --------------------------------*/
// register
routes.post('/register', register.register);

// registration OTP verification
routes.post('/regOtpVerification', register.verification);

/* ---------------------------- Login  --------------------------------*/
// login
routes.post('/login', login.login);

// login OTP verification
routes.post('/logOtpVerification', login.verification);

/* ---------------------------- Forget Password  --------------------------------*/
// forget password interface for getting user details forgetPasswordGetUserDetails
routes.post('/forPasGetUseDetails', forPassword.getUseDetails);

// forget password OTP verification
routes.post('/forPasOtpVerification', forPassword.verification);

// forget password interface for changing the user password forgetPasswordChangePassword
routes.post('/forPasChaPassword', forPassword.chaPassword);

/* ---------------------------- LogOut  --------------------------------*/
// logOut
routes.post('/logout', logout);

/* ============================ view routes ================================ */

/* ---------------------------- HOME  --------------------------------*/
// Home
routes.get('/', formData, (req, res) => {
  res.send('working');
});

/* ---------------------------- Error  --------------------------------*/
// error 404
routes.all('/*', formData, (req, res) => {
  res.send('error 404');
});

module.exports = routes;
