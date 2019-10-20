const express = require('express');

const config = require('../config');
const services = require('../services');
const v1 = require('./v1.routes');
const v2 = require('./v2.routes');

const router = express.Router(config.router);

// middleware
// router.use(services.middleware.acl);

// origin
router.all('/', (req, res) => {
  res.status(200).json({ success: true, data: 'auth api working fine.' });
});

// v1
router.use('/v1', v1);

// v2
router.use('/v2', v2);

// 404
// eslint-disable-next-line no-unused-vars
router.all('/*', (req, res, next) => {
  next({ status: 404, message: 'please check url. page not found.' });
});

// Error handler
router.use(services.middleware.errorHandler);

module.exports = router;
