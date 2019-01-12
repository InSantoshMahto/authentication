// importing express module
const express = require('express');

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

/* ============================ view routes ================================ */

/* ---------------------------- Registration  --------------------------------*/
// dashboard
routes.get('/', (req, res) => {
    res.send("API Dashboard");
});

// register
routes.get('/register', (req, res) => {
    res.send("API register");
});

// registration OTP verification
routes.get('/regOtpVerification', (req, res) => {
    res.send("API regOtpVerification");
});

/* ---------------------------- Login  --------------------------------*/

// login 
routes.get('/login', (req, res) => {
    res.send("API login");
});

// login OTP verification
routes.get('/logOtpVerification', (req, res) => {
    res.send("API logOtpVerification");
});

/* ---------------------------- Forget Password  --------------------------------*/

// forget password interface for getting user details forgetPasswordGetUserDetails
routes.get('/forPasGetUseDetails', (req, res) => {
    res.send("API forPasGetUseDetails");
});

// forget password OTP verification
routes.get('/forPasOtpVerification', (req, res) => {
    res.send("API forPasOtpVerification");
});

// forget password interface for changing the user password forgetPasswordChangePassword
routes.get('/forPasChaPassword', (req, res) => {
    res.send("API forPasChaPassword");
});

/* ---------------------------- dashboard  --------------------------------*/

/* ---------------------------- Error  --------------------------------*/

// error 404
routes.get('/*', (req, res) => {
    res.send("API Error 404");
});

module.exports = routes;