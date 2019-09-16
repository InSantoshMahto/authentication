const express = require('express');

const config = require('../config');
const auth = require('../auth').v1;

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
router.post('/forget-password', auth.forgetPassword);

/**
 * @params type: forget  | change
 */
router.post('/update-password/:type', auth.updatePassword);

// verify
router.post('/verify', auth.verify);

// self
router.get('/self', auth.self);
router.post('/self', auth.self);

module.exports = router;
