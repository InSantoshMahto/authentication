'use strict'

// imports
let email = require('./email');
let sms = require('./sms');
let validate = require('./validate');

// exports
module.exports = {
    email: email,
    sms: sms,
    validate: {
        email: validate.email
    }
}