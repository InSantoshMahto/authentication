// importing node built in modules
const path = require('path');

// importing node third parties modules
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');

// requiring routing
let MAIN = require('./routes');
let API = require('./routes/api');

//creating express app
let app = express();

// defining port number
const PORT = process.env.PORT || 80;

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

/* config MIME type  */

// parse application/json
// app.use(express.json({ type: 'text/html' }));

// parse application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: false }));

// set up  for routes
app.use('/api', API);
app.use('/', MAIN);

// assgining port number
app.listen(PORT, () => console.log(`Listening on ${PORT}`));