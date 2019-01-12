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
    res.send("Dashboard");
});

// register
routes.get('/register', (req, res) => {
    res.send("register");
});

// registration OTP verification
routes.get('/regOtpVerification', (req, res) => {
    res.send("regOtpVerification");
});

/* ---------------------------- Login  --------------------------------*/

// login 
routes.get('/login', (req, res) => {
    res.send("login");
});

// login OTP verification
routes.get('/logOtpVerification', (req, res) => {
    res.send('logOtpVerification');
});

/* ---------------------------- Forget Password  --------------------------------*/

// forget password interface for getting user details forgetPasswordGetUserDetails
routes.get('/forPasGetUseDetails', (req, res) => {
    res.send("forPasGetUseDetails");
});

// forget password OTP verification
routes.get('/forPasOtpVerification', (req, res) => {
    res.send("forPasOtpVerification");
});

// forget password interface for changing the user password forgetPasswordChangePassword
routes.get('/forPasChaPassword', (req, res) => {
    res.send("forPasChaPassword");
});

/* ---------------------------- dashboard  --------------------------------*/

/* ---------------------------- Error  --------------------------------*/

// error 404
routes.get('/*', (req, res) => {
    res.send("Error 404");
});

module.exports = routes;