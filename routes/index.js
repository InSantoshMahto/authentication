const express = require('express');

const config = require('../config');
const v1 = require('./v1');
const v2 = require('./v2');

const router = express.Router(config.router);

// origin
router.all('/', (req, res) => {
  res.status(200).json({ success: true, data: 'auth api working fine.' });
});

// v1
router.use('/v1', v1);

// v2
router.use('/v2', v2);

// 404
router.all('/*', (req, res) => {
  res
    .status(404)
    .json({ success: false, error: { status: 404, message: 'Not Found' } });
});

module.exports = router;
