'use strict'

// import 
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const app = express();

// importing config
const db = require('../../config/database');

let register = (req, res) => {
    let errors = [];
    // getting data from user
    let userName = req.body.userName;
    // const { userName, email, mobile, firstName, middleName, lastName, gender, dob, password } = req.bady;

    let email = req.body.email;
    let mobile = req.body.mobile;
    let firstName = req.body.firstName;
    let middleName = req.body.middleName;
    let lastName = req.body.lastName;
    let gender = req.body.gender;
    let dob = req.body.dob;
    let password = req.body.password;
    let password2 = req.body.password2;

    userName = email;
    let userData = {
        userName: userName,
        email: email,
        mobile: mobile,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        gender: gender,
        dob: dob,
        password: password
    };
    if (!userName || !email || !mobile || !firstName || !lastName || !gender || !dob || !password || !password2) {
        errors.push({
            msg: 'Please enter all fields required Fie'
        });
    }

    if (password != password2) {
        errors.push({
            msg: 'Passwords do not match'
        });
    }

    if (password.length < 6) {
        errors.push({
            msg: 'Password must be at least 6 characters'
        });
    }

    if (errors.length > 0) {
        res.send({
            status: 'errors',
            msg: errors
        });
    } else {
        // getting mysql connection credentials 
        let conToMySql = db.connections.mysql();
        // coonecting to database
        conToMySql.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
            } else {
                console.log('connected as id ' + conToMySql.threadId);
            }
        });

        // preparing the query
        let query = "SELECT id FROM users WHERE user_name = '" + userName + "' OR email = '" + email + "' OR mobile = '" + mobile + "'";

        // verifying the user existance i.e, whether user already exist            
        conToMySql.query(query, function(error, results, fields) {
            if (error) {
                // if error occurs
                console.log('Error while verifying the user', error);
                errors.push({
                    msg: 'Error while connection to database'
                });

                // send the responce
                res.send({
                    status: 'errors',
                    msg: errors
                });
            } else {
                console.log('number of rows selected :  ', results.length);
                if (results.length > 0) {
                    console.log("User Already Exist");
                    errors.push({
                        msg: 'User Already Exist.'
                    });

                    // send the responce
                    res.send({
                        status: 'errors',
                        msg: errors
                    });
                } else {
                    console.log("Register Now");

                    // encrypting the password
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(password, salt, function(err, hash) {
                            // Store hash in your password DB.
                            console.log(hash);

                            // preparing insert query
                            // let query = INSERT INTO users(id, );
                        });
                    });
                    console.log(hash);
                    res.send(userData);
                }
            }
        });
        conToMySql.end();
    }
    // res.send(userData);
}

// regOtpVerification
let otpVerification = (req, res) => {
    console.log('regOtpVerification msg from auth');
    db.auth.register.otpVerification();
    res.send('regOtpVerification');
}

module.exports = {
    register: register,
    otpVerification: otpVerification
}