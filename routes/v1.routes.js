const express = require('express');

const config = require('../config');
const services = require('../services');
const auth = services.auth.v1;
const middleware = services.middleware;

const router = express.Router(config.router);

// v1 origin
router.all('/', (req, res) => {
  res.status(200).json({ success: true, data: 'API V1' });
});

// register
router.post('/register', auth.register);

// login
router.post('/login', auth.login);

// forget password
router.post('/forgetPassword', auth.forgetPassword);

// update-password
router.post('/updatePassword', auth.updatePassword);

// change-password
router.post(
  '/changePassword',
  services.middleware.authorization,
  auth.changePassword
);

// verify
router.post('/verify', auth.verify);

// resend otp
router.post('/resendOtp', auth.resendOtp);

// self
router.get('/self', auth.self);

// getProfile
router.get('/getProfile', auth.getProfile);

// setProfile
router.get('/setProfile', auth.setProfile);

module.exports = router;
