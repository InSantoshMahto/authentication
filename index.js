const path = require('path');
const express = require('express');
const logger = require('morgan');

const config = require('./config'); // configuration
const routes = require('./routes'); //  routing

const PORT = process.env.PORT || 8500; // defining port number

const app = express(); //creating express app

// configuration for MIME type
app.use(express.json(config.json));

// for logging the routes
app.use(logger('dev'));

// public directory setup
app.use(express.static(path.join(__dirname, 'public'), config.static));

/* ======================= set up  for routes ========================== */
app.use('/', routes);

// listening port number
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
