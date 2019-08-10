const express = require('express');

const config = require('../config');
const errors = require('../core/errors');
const success = require('../core/success');
const v1 = require('./v1');
const v2 = require('./v2');

const router = express.Router(config.router);

// origin
router.all('/', (req, res) => {
  res
    .status(success.statusCode[200].status)
    .json({ success: true, data: 'auth api working fine.' });
});

// v1
router.use('/v1', v1);

// v2
router.use('/v2', v2);

// 404
// eslint-disable-next-line no-unused-vars
router.all('/*', (req, res) => {
  let err = new Error();
  err.code = errors.statusCode[404].status;
  err.name = errors.statusCode[404].name;
  err.message = errors.statusCode[404].message;
  throw err;
});

// Error handler
router.use((err, req, res, next) => {
  if (!err) {
    next();
    return;
  }
  // console.log('Error handler:', err.stack);
  res.status(err.code).json({
    success: false,
    error: { status: err.code, message: err.message, name: err.name },
  });
});

module.exports = router;
