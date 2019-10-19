const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const logger = require('morgan');

const config = require('./config'); // configuration
const routes = require('./routes'); //  routing

const PORT = process.env.PORT || config.port; // defining port number

const app = express(); //creating express app

app.disable('etag'); // disable etag

app.disable('x-powered-by'); // disable x-powered-by

app.use(express.json(config.json)); // configuration for MIME type

app.use(logger('dev')); // for logging the routes

if (dotenv.error) throw dotenv.error; // for dotenv
console.info(`key added in env by dotenv are:\n`, dotenv.parsed);

app.use(express.static(path.join(__dirname, 'public'), config.static)); // public directory setup

/* *********************** set up  for routes *********************** */
app.use('/', routes);

app.listen(PORT, () => console.log(`Listening on ${PORT}`)); // listening port number
