'use strict'

// import 
// const express = require('express');
// const mysql = require('mysql');
const bcrypt = require('bcryptjs');
// const jwtSimple = require('jwt-simple');
const objectHash = require('object-hash');
const isEmail = require('isemail');
// const app = express();

// importing config
const db = require('../../config/database');

// declaring error messege constant
const ERRMSG5XX = 'server side error';
const ERRMSG4XX = 'client side error';

let register = (req, res) => {
    // declaring errors array to store errors messeges
    let consloeMsg = '';
    let userMsg = '';
    // getting data from user
    let userName = req.body.userName;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let firstName = req.body.firstName;
    let middleName = req.body.middleName;
    let lastName = req.body.lastName;
    let gender = req.body.gender;
    let dob = req.body.dob;
    let password = req.body.password;
    let password2 = req.body.password2;

    /* formating the data */

    // initiating new date objects
    let date = new Date();

    // formating date of registration
    let dor = date.getDate() + "-" + date.getMonth() + 1 + "-" + date.getFullYear();
    // console.log(dor);

    // making email as a username
    userName = email;

    // formating middleName
    middleName = middleName == "" ? null : middleName;

    // making lastLogin as a null
    let lastLogin = null;

    // making emailStatus Deactive(0) , it will activated after user verify email address
    let emailStatus = 0;

    // making mobileStatus Deactive(0) , it will activated after user verify mobile
    let mobileStatus = 0;

    // making accountStatus Deactive(0) , it will activated after user verify thier credentials
    let accountStatus = 0;

    // adding remark
    let remark = "user registered But Not verified";

    // gethering all the data
    let userData = {
        userName: userName,
        email: email,
        mobile: mobile,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        gender: gender,
        dob: dob,
        dor: dor,
        lastLogin: lastLogin,
        hash: "",
        password: password,
        emailStatus: emailStatus,
        mobileStatus: mobileStatus,
        accountStatus: accountStatus,
        remark: remark
    };
    if (!userName || !email || !mobile || !firstName || !lastName || !gender || !dob || !password || !password2) {

        // defining the msg
        consloeMsg = 'invalid Credentials';
        userMsg = 'Please enter all fields required Field.';

        // calling errorResponce function
        errorResponse(res, consloeMsg, userMsg, 400, null);

    } else if (password != password2) {

        // defining the msg
        consloeMsg = 'invalid Credentials';
        userMsg = 'Passwords do not match.';

        // calling errorResponce function
        errorResponse(res, consloeMsg, userMsg, 400, null);

    } else if (password.length < 6) {

        // defining the msg
        consloeMsg = 'invalid Credentials';
        userMsg = 'Password must be at least 6 characters.';

        // calling errorResponce function
        errorResponse(res, consloeMsg, userMsg, 500, null);

    } else {
        // validation of recieved user data
        valRecDatByUser(userData.email, (err) => {
            if (err) {
                console.log("Invalid email address.");
            } else {
                console.log("Valid email address.");
            }
        });

        // getting mysql connection credentials 
        let conToMySql = db.connections.mysql();
        // coonecting to database
        conToMySql.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
            } else {
                console.info('connected as id ' + conToMySql.threadId);
            }
        });

        // preparing the Select query
        let query = "SELECT id FROM users WHERE user_name = '" + userName + "' OR email = '" + email + "' OR mobile = '" + mobile + "'";

        // verifying the user existance i.e, whether user already exist            
        conToMySql.query(query, function(err, results, fields) {
            if (err) {
                // defining the msg
                consloeMsg = '\nError During Executing The Verification Query.\nSQL:\t' + query;
                userMsg = 'internal server error. please contact to Support Team';

                // calling errorResponce function
                errorResponse(res, consloeMsg, userMsg, 500, err);

            } else {
                // checking the user existance
                if (results.length > 0) {
                    // defining the msg
                    consloeMsg += 'number of rows selected:\t' + results.length + '\nUser Already Exist.';
                    userMsg = 'User Already Exist. Try Again if you remember your password OR  forget your password';

                    // calling errorResponce function
                    errorResponse(res, consloeMsg, userMsg, 500, null);

                } else {
                    consloeMsg = "New User Registration process started\n";

                    // encrypting the password
                    bcrypt.genSalt(10, function(err, salt) {

                        // generating hash password
                        bcrypt.hash(password, salt, function(err, hash) {
                            // Store hash in your password DB.

                            consloeMsg += "hash succesfully generated\n";

                            // storing hash to the userData objects
                            userData.pwdHash = hash;

                            // storing hash password to the userData objects 
                            userData.hash = objectHash({
                                email: userData.email,
                                mobile: userData.mobile,
                                dob: userData.dob,
                                dor: userData.dor
                            }, {
                                algorithm: 'md5'
                            });

                            // console.info(userData.hash);
                            // preparing insert query
                            let query = "INSERT INTO users (id, user_name, email, mobile, first_name, middle_name, last_name, gender, dob, dor, last_login, pwd_hash, hash, email_status, mobile_status, account_status, remark ) VALUES(" + null + ",'" + userData.userName + "','" + userData.email + "','" + userData.mobile + "','" + userData.firstName + "','" + userData.middleName + "','" + userData.lastName + "','" + userData.gender + "','" + userData.dob + "','" + userData.dor + "','" + userData.lastLogin + "','" + userData.pwdHash + "','" + userData.hash + "'," + userData.emailStatus + "," + userData.mobileStatus + "," + userData.accountStatus + ",'" + userData.remark + "');";
                            // console.info(query);
                            consloeMsg += "insert query are:\t" + query + "\n";

                            // executing the insert query
                            conToMySql.query(query, (err, results, fields) => {
                                if (err) {
                                    // defining the msg
                                    consloeMsg += '\nError while executing the query to database during inserting the new uses credentials';
                                    userMsg = 'Error during registering the user.';

                                    // calling errorResponce function
                                    errorResponse(res, consloeMsg, userMsg, 500, err);

                                } else {
                                    //log
                                    console.log(userData);
                                    console.log("User Registration completed.");

                                    // sending  the success responce
                                    res.send({
                                        status: 'success',
                                        msg: 'registration completed. But to access the services verify your credentials.'
                                    });
                                }
                            });
                            // closing the db connection.
                            conToMySql.end(() => console.log("Connection Closed"));

                        });
                    });
                }
            }
        });
    }
    return;
}

// regOtpVerification
let verification = (req, res) => {
    console.log('regOtpVerification msg from auth');
    res.send('regOtpVerification');
    return 0;
}

/* ==================================== supporting functions ===================================== */

// validating credentials given/received by the user i.e, validateReceivedDataByUser
function valRecDatByUser(_email, callback) {
    if (isEmail.validate(_email)) {
        return callback(false);
    } else {
        return callback(true);
    }
}

//error responce to users
function errorResponse(_res, _consoleMsg, _userMsg, _code, _err) {
    let errors = [];
    // decideing the error code messege
    let _errCodeMsg = _code == 500 ? ERRMSG5XX : ERRMSG4XX;

    // config. i.e, if _err is Not pressent then _err messege should not print in new line
    _err = (_err == null) ? '' : "\n" + _err;

    console.log(_consoleMsg, _err);

    //pushin/storing errors
    errors.push({
        msg: _userMsg
    });

    // sending response to the clients
    _res.send({
        status: {
            code: _code,
            msg: _errCodeMsg
        },
        errors: errors
    });
    return;
}

/* ==================== Export ====================  */
module.exports = {
    register: register,
    verification: verification
}