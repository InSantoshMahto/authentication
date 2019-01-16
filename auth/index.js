'use strict'

// importing functionalities
let register = require('./register');
let login = require('./login');
let forPassword = require('./forPassword');
let logout = require('./logout');

// exporting functionalities
module.exports = {
    dashboard: {
        dashboard: (req, res) => { res.send("dashboard"); }
    },
    register: {
        register: register.register,
        verification: register.verification
    },
    login: {
        login: login.login,
        verification: login.verification
    },
    forPassword: {
        getUseDetails: forPassword.getUseDetails,
        verification: forPassword.verification,
        chaPassword: forPassword.chaPassword
    },
    logout: logout.logout
};