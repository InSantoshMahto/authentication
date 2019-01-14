// importing node built in modules
const path = require('path');

// importing node third parties modules
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');

//creating express app
let app = express();

// requiring routing
let MAIN = require('./routes');
let API = require('./routes/api');

// defining port number
const PORT = process.env.PORT || 85;

/* configuration for MIME type  */

// declaring MIME type as a JSON
let jsonRoutes = express.json();

// form data 
let formData = express.urlencoded({ "extended": false });

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// for logging perpurse
app.use(logger('dev'));

// serving favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// plublic directry setup
app.use(express.static(path.join(__dirname, 'public')));

// view directory setup
app.set('views', path.join(__dirname, 'views'));

// view engine setup
app.set('view engine', 'ejs');

// set up  for routes
app.use('/api', jsonRoutes, API);
app.use('/', formData, MAIN);

// assgining port number
app.listen(PORT, () => console.log(`Listening on ${PORT}`));