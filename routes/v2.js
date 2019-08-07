const express = require('express');

const config = require('../config');

const router = express.Router(config.router);

// origin
router.all('/', (req, res) => {
  res.status(200).json({ success: true, data: 'API V2' });
});

module.exports = router;
