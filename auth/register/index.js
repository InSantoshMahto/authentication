'use strict'

// imports 
const bcrypt = require('bcryptjs');
const objectHash = require('object-hash');

// importing config
let config = require('../../config');
let modules = require('../../modules');

// getting validation functionalities
let validate = modules.validate;

// declaring error message constant
const ERROR5XX = 'server side error';
const ERROR4XX = 'client side error';

let register = (req, res, type) => {
    // declaring errors array to store errors messages
    let consoleMsg = '';
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

    // making emailStatus Deactivate (0) , it will activated after user verify email address
    let emailStatus = 0;

    // making mobileStatus Deactivate (0) , it will activated after user verify mobile
    let mobileStatus = 0;

    // making accountStatus Deactivate (0) , it will activated after user verify there credentials
    let accountStatus = 0;

    // adding remark
    let remark = "user registered But Not verified";

    // collecting all the data
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

    /**
     * validation start from here
     * 
     */
    if (!userName || !email || !mobile || !firstName || !lastName || !gender || !dob || !password || !password2) {

        // defining the msg
        consoleMsg = 'invalid Credentials';
        userMsg = 'Please enter all fields required Field.';

        // calling errorResponse function
        errorResponse(res, consoleMsg, userMsg, 400, null);

        /**
         * all field must have to fill END
         * password must have same START 
         * 
         */
    } else if (password != password2) {

        // defining the msg
        consoleMsg = 'invalid Credentials';
        userMsg = 'Passwords do not match.';

        // calling errorResponse function
        errorResponse(res, consoleMsg, userMsg, 400, null);

        /**
         * password must have same END
         * password must have greater than 6 characters START
         * 
         */
    } else if (password.length < 6) {

        // defining the msg
        consoleMsg = 'invalid Credentials';
        userMsg = 'Password must be at least 6 characters.';

        // calling errorResponse function
        errorResponse(res, consoleMsg, userMsg, 500, null);

        /** 
         * password must have greater than 6 characters END
         * validation START
         * 
         */
    } else {
        // validation for user data 
        validations(userData, (err) => {
            if (err) {
                // defining the msg
                consoleMsg = 'Error: during validations';
                userMsg = 'Invalid user data. kindly try again.';

                // calling errorResponse function
                errorResponse(res, consoleMsg, userMsg, 500, null);
            } else {
                console.log("MSG: validation successful.");
            }
        });

        // getting mysql connection credentials 
        let conToMySql = config.db.connections.mysql();
        // connecting to database
        conToMySql.connect((err) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
            } else {
                console.info('connected as id ' + conToMySql.threadId);
            }
        });

        // preparing the Select query
        let query = "SELECT id FROM users WHERE user_name = '" + userName + "' OR email = '" + email + "' OR mobile = '" + mobile + "'";

        // verifying the user existence i.e, whether user already exist            
        conToMySql.query(query, function(err, results, fields) {
            if (err) {
                // defining the msg
                consoleMsg = '\nError During Executing The Verification Query.\nSQL:\t' + query;
                userMsg = 'internal server error. please contact to Support Team';

                // calling errorResponse function
                errorResponse(res, consoleMsg, userMsg, 500, err);

            } else {
                // checking the user existence
                if (results.length > 0) {
                    // defining the msg
                    consoleMsg += 'number of rows selected:\t' + results.length + '\nUser Already Exist.';
                    userMsg = 'User Already Exist. Try Again if you remember your password OR  forget your password';

                    // calling error response function
                    errorResponse(res, consoleMsg, userMsg, 500, null);

                } else {

                    consoleMsg = "New User Registration process started\n";

                    // encrypting the password
                    bcrypt.genSalt(10, function(err, salt) {

                        // generating hash password
                        bcrypt.hash(password, salt, function(err, hash) {
                            // Store hash in your password DB.

                            consoleMsg += "hash successfully generated\n";

                            // storing hash to the userData objects
                            userData.pwdHash = hash;

                            // storing hash password to the userData objects 
                            userData.hash = getHash(userData);

                            // executing the insert query
                            // preparing insert query
                            let query = "INSERT INTO users (id, user_name, email, mobile, first_name, middle_name, last_name, gender, dob, dor, last_login, pwd_hash, hash, email_status, mobile_status, account_status, remark ) VALUES(" + null + ",'" + userData.userName + "','" + userData.email + "','" + userData.mobile + "','" + userData.firstName + "'," + userData.middleName + ",'" + userData.lastName + "','" + userData.gender + "','" + userData.dob + "','" + userData.dor + "','" + userData.lastLogin + "','" + userData.pwdHash + "','" + userData.hash + "'," + userData.emailStatus + "," + userData.mobileStatus + "," + userData.accountStatus + ",'" + userData.remark + "');";
                            // console.info(query);
                            consoleMsg += "insert query are:\t" + query + "\n";

                            // executing the insert query
                            conToMySql.query(query, (err, results, fields) => {
                                if (err) {
                                    // defining the msg
                                    consoleMsg += '\nError while executing the query to database during inserting the new uses credentials';
                                    userMsg = 'Error during registering the user.';

                                    // calling error response function
                                    errorResponse(res, consoleMsg, userMsg, 500, err);

                                } else {
                                    //log
                                    console.log(userData);
                                    console.log("User Registration completed.");

                                    // sending  the success response
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

            };
        });
    };

    // registration END
    return;
}

// regOtpVerification
let verification = (req, res) => {
    console.log('regOtpVerification msg from auth');
    res.send('regOtpVerification');
    return 0;
}

/* ==================================== supporting functions ===================================== */

// validation function
function validations(_userData) {
    console.log("STATUS: Validation Start.");

    // validation of received user email address
    validate.email(_userData.email, (err) => {
        if (err) {
            console.log("MSG: Invalid Email Address.");
        } else {
            console.log("MSG: Valid Email Address.");
        }
    });

    console.log("STATUS: Validation End.");
}

// hash
function getHash(_userData) {
    console.log("STATUS: hash generation Start");

    // generating hash by object hash module
    let hash = objectHash({
        email: _userData.email,
        mobile: _userData.mobile,
        dob: _userData.dob,
        dor: _userData.dor
    }, {
        algorithm: 'md5'
    });

    console.log("STATUS: hash generation End");
    return hash;
}

//error response to users
function errorResponse(_res, _consoleMsg, _userMsg, _code, _err) {
    let errors = [];
    // decision the error code message
    let _errCodeMsg = _code == 500 ? ERROR5XX : ERROR4XX;

    // config. i.e, if _err is Not present then _err message should not print in new line
    _err = (_err == null) ? '' : "\n" + _err;

    console.log(_consoleMsg, _err);

    // push / storing errors
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