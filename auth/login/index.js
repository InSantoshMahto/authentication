'use strict'

// import 
const express = require('express');
// const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const isEmail = require('isemail');
// const jwtSimple = require('jwt-simple');
// const objectHash = require('object-hash');
// const app = express();

// importing config and custom functionalities
const db = require('../../config/database');
let modules = require('../../modules');

// declaring error messege constant
const ERRMSG5XX = 'server side error';
const ERRMSG4XX = 'client side error';

let login = (req, res) => {
    // declaring errors array to store errors messeges
    let consloeMsg = '';
    let userMsg = '';

    // getting data from user
    let clientId = req.body.userId;
    let password = req.body.password;
    let rememberMe = req.body.rememberMe;

    /* formating the data */

    // initiating new date objects
    let date = new Date();

    // formating last login
    let lastLogin = date.getDate() + "-" + date.getMonth() + 1 + "-" + date.getFullYear();
    // console.log(lastLogin);

    // gethering all the data
    let userData = {
        userName: clientId,
        email: clientId,
        mobile: clientId,
        password: password,
        rememberMe: rememberMe
    };

    // validating whether user enter all the required data or not
    if (!clientId || !password) {
        // defining the msg
        consloeMsg = 'invalid Credentials';
        userMsg = 'Please enter all fields required Field.';

        // calling errorResponce function
        errorResponse(res, consloeMsg, userMsg, 400, null);

    } else {
        // validation of recieved user data
        modules.validate.email(userData.email, (err) => {
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
        let query = "SELECT id FROM users WHERE user_name = '" + userData.userName + "' OR email = '" + userData.email + "' OR mobile = '" + userData.mobile + "'";

        // fetching id for the user id  
        conToMySql.query(query, function(err, results, fields) {
            if (err) {
                // defining the msg
                consloeMsg = '\nError during fetching the Id:\t' + err + '\nSQL:\t' + query;
                userMsg = 'Internal server error. please contact to Support Team';

                // calling errorResponce function
                errorResponse(res, consloeMsg, userMsg, 500, err);

            } else if (!(results.length > 0)) {
                // this will executed when user not register. i.e, user doesn`t  have account. 

                // defining the msg
                consloeMsg = '\nUser Does Not Exist.';
                userMsg = '\nUser Does Not Exist. First Register then try.';

                // calling errorResponce function
                errorResponse(res, consloeMsg, userMsg, 400, err);

            } else {
                // this will execute when user having a account.

                // storing id into userData
                userData.userId = results[0].id;

                // preparing the Select query
                query = "SELECT user_name, email, mobile, pwd_hash, hash, account_status FROM users WHERE id = " + userData.userId;

                // fetching all the required credentials.            
                conToMySql.query(query, function(err, results, fields) {
                    if (err) {
                        // defining the msg
                        consloeMsg = '\nError during fetching the user credentials:\t' + err + '\nSQL:\t' + query;
                        userMsg = 'internal server error. please contact to Support Team';

                        // calling errorResponce function
                        errorResponse(res, consloeMsg, userMsg, 500, err);

                    } else {
                        // updating username, email, mobile
                        userData.userName = results[0].user_name;
                        userData.email = results[0].email;
                        userData.mobile = results[0].mobile;
                        userData.pwdHash = results[0].pwd_hash;
                        userData.hash = results[0].hash;
                        userData.accountStatus = results[0].account_status;

                        //comparing the hash password
                        bcrypt.compare(userData.password, userData.pwdHash, function(err, compareResult) {
                            if (!compareResult) {
                                // defining the msg
                                consloeMsg = '\nPassword do not match.';
                                userMsg = 'Password do not match';

                                // calling errorResponce function
                                errorResponse(res, consloeMsg, userMsg, 500, err);

                                console.log(userData.accountStatus);

                            } else if (!userData.accountStatus) {
                                // checking the account status. 
                                //if user Deactive

                                // defining the msg
                                consloeMsg = '\n User Account is DeActivated. account_status';
                                userMsg = 'your Account is DeActivated. please contact to support team.';

                                // calling errorResponce function
                                errorResponse(res, consloeMsg, userMsg, 500, err);

                            } else {
                                //if user is Active
                                //loging the all data
                                console.log(userData);
                                console.log("User Loged In Successfully.");

                                /* -------------- Session ------------------- */
                                // Configuring data
                                let authSessions = {
                                    userId: userData.userId,
                                    userName: userData.userName,
                                    password: userData.password
                                };

                                // Calling setCookies function
                                setSession(req, res, authSessions);
                                /* -------------- Cookies ------------------- */
                                // Configuring data
                                let authCookies = {
                                    clientId: userData.userName,
                                    password: userData.password
                                };

                                // Calling setCookies function
                                setCookies(req, res, authCookies);


                                /* -------------- Send Responce To The Users ------------------- */
                                // sending  the success responce
                                res.send({
                                    status: 'success',
                                    msg: 'User Loged In Successfully.'
                                });
                            }
                            // closing the db connection.
                            conToMySql.end(() => console.log("Connection Closed"));
                        });
                    }
                })
            }
        })
    }
    return;
}

let verification = (req, res) => {
    console.log("i am from otpVerification  from auth");
    res.send('otpVerification');
}

/* ==================================== supporting functions ===================================== */

// configuring the cooking...... i.e, sending cookie to the browser
function setCookies(_req, _res, authCookies) {
    console.log("Setup for cookies started.");
    _res.cookie('clientId', authCookies.clientId, { domain: _req.hostname, path: '/', secure: false });
    _res.cookie('password', authCookies.password, { domain: _req.hostname, path: '/', secure: false });
    console.log("Cookies set successfully.");
}

// configuring the Session...... i.e, storing session to the server
function setSession(_req, _res, authSessions) {
    console.log("Setup for Session started.");
    _req.session.userId = authSessions.userId;
    _req.session.userName = authSessions.userName;
    _req.session.password = authSessions.password;
    console.log(_req.session);
    console.log("Session set successfully.");
}

// Error responce to users
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
    login: login,
    verification: verification
};