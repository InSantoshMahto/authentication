'use strict'

// importing functionalities
let register = require('./register');
let login = require('./login');
let forPassword = require('./forPassword');

// exporting functionalities
module.exports = {
    dashboard: {
        dashboard: (req, res) => {
            res.send("dashboard");
        }
    },
    register: {
        register: register.register,
        otpVerification: register.otpVerification,
    },
    login: {
        login: login.login,
        otpVerification: login.otpVerification
    },
    forPassword: {
        getUseDetails: forPassword.getUseDetails,
        otpVerification: forPassword.otpVerification,
        chaPassword: forPassword.chaPassword
    }
};