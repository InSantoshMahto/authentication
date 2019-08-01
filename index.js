// importing node built in modules
const path = require('path');

// importing node third parties modules
const express = require('express');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');

//creating express app
let app = express();

// requiring routing
let MAIN = require('./routes');

// defining port number
const PORT = process.env.PORT || 85;

/* configuration for MIME type  */
app.use(express.json());

/* ===================== middleware =============== */
// express cookie-parser
app.use(cookieParser());

// session express-session
app.use(
  expressSession({
    secret: 'one net software info',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
    },
  })
);

// for logging the routes
app.use(logger('dev'));

// serving favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// public directory setup
app.use(express.static(path.join(__dirname, 'public')));

/* ======================= set up  for routes ========================== */
app.use('/', MAIN);

// listening port number
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
