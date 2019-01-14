'use strict'

// importing third party module
const express = require('express');

// importing custom module
let auth = require('../auth');
let dashboard = auth.dashboard;
let register = auth.register;
let login = auth.login;
let forPassword = auth.forPassword;

// creating router objects
const routes = express.Router();

// for domain
let url = "";

// router middleware
routes.use(function(req, res, next) {
    // to get domain 
    let host = req.hostname;
    let protocol = req.protocol;
    url = protocol + "://" + host;
    next();
});

/* ============================ Config routes ================================ */
/* ---------------------------- dashboard  --------------------------------*/
// dashboard
routes.post('/', dashboard.dashboard);

/* ---------------------------- Registration  --------------------------------*/
// register
routes.post('/register', register.register);

// registration OTP verification
routes.post('/regOtpVerification', register.otpVerification);

/* ---------------------------- Login  --------------------------------*/
// login 
routes.post('/login', login.login);

// login OTP verification
routes.post('/logOtpVerification', login.otpVerification);

/* ---------------------------- Forget Password  --------------------------------*/
// forget password interface for getting user details forgetPasswordGetUserDetails
routes.post('/forPasGetUseDetails', forPassword.getUseDetails);

// forget password OTP verification
// routes.post('/forPasOtpVerification', forPassword.otpVerification);

// forget password interface for changing the user password forgetPasswordChangePassword
// routes.post('/forPasChaPassword', forPassword.chaPassword);

/* ============================ view routes ================================ */
// dashboard
routes.get('/', (req, res) => {
    // res.setHeader({ 'content-type': "aplication/json" });
    res.send({
        "routes": "dashboard",
        "status": "development"
    });
});

/* ---------------------------- Registration  --------------------------------*/
// register
routes.get('/register', (req, res) => {
    res.send({
        "routes": "register",
        "status": "development"
    });
});

// registration OTP verification
routes.get('/regOtpVerification', (req, res) => {
    res.send({
        "routes": "regOtpVerification",
        "status": "development"
    });
});

/* ---------------------------- Login  --------------------------------*/
// login 
routes.get('/login', (req, res) => {
    res.send({
        "routes": "login",
        "status": "development"
    });
});

// login OTP verification
routes.get('/logOtpVerification', (req, res) => {
    res.send({
        "routes": "logOtpVerification",
        "status": "development"
    });
});

/* ---------------------------- Forget Password  --------------------------------*/
// forget password interface for getting user details forgetPasswordGetUserDetails
routes.get('/forPasGetUseDetails', (req, res) => {
    res.send({
        "routes": "forPasGetUseDetails",
        "status": "development"
    });
});

// forget password OTP verification
routes.get('/forPasOtpVerification', (req, res) => {
    res.send({
        "routes": "forPasOtpVerification",
        "status": "development"
    });
});

// forget password interface for changing the user password forgetPasswordChangePassword
routes.get('/forPasChaPassword', (req, res) => {
    res.send({
        "routes": "forPasChaPassword",
        "status": "development"
    });
});

/* ---------------------------- Error  --------------------------------*/
// error 404
routes.get('/*', (req, res) => {
    res.send(" API Error 404");
});

module.exports = routes;