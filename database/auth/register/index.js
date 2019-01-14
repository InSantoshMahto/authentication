// importing mysql
const mysql = require('mysql');

// register function: responsible for new user registration
let register = () => {
    console.log("register  from db");
}

let otpVerification = () => {
    console.log("otpVerification from db");
}

// exporting register function
module.exports = {
    register: register,
    otpVerification: otpVerification
}