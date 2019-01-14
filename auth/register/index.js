'use strict'

// import 
const express = require('express');
const mysql = require('mysql');
const app = express();

// import
let db = require('../../database');

let register = (req, res) => {
    // getting data from user
    let userName = req.body.userName;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let firstName = req.body.firstName;
    let middleName = req.body.middleName;
    let LastName = req.body.LastName;
    let gender = req.body.gender;
    let dob = req.body.dob;
    let password = req.body.password;
    let userData = {
        userName: userName,
        email: email,
        mobile: mobile,
        firstName: firstName,
        middleName: middleName,
        LastName: LastName,
        gender: gender,
        dob: dob,
        password: password
    };
    let conToMySql = db.getConnection.mysql;
    // console.log(conn);
    conToMySql.connect((err) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + conToMySql.threadId);
    });
    db.auth.register.register();
    // sending the responce
    res.send(userData);

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