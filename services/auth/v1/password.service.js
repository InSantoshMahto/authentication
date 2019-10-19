const mongoose = require('mongoose');
const passwordValidator = require('password-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Model = require('../../../models');
const utils = require('../../../utils');
const mongoURI = require('../../../config').mongoURI;

module.exports = {
  forget: async (req, res) => {
    let errMessage = [];
    let errFlag = false;

    let { userName } = req.body;
    let client_type = req.header('Client-Type');

    // check clientType existence
    if (!client_type) {
      errFlag = true;
      errMessage.push('Client_Type header is required.');
    }

    // check userName existence
    if (!userName) {
      errFlag = true;
      errMessage.push('userName is required.');
    }
    // check error if exist then send error response
    if (errFlag) {
      let err = new Error();
      err.code = utils.statusCode[412].status;
      err.name = utils.statusCode[412].name;
      err.message = errMessage.join(' ');
      throw err;
    } else {
      // check user not already exist
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        uri_decode_auth: true,
      });

      // Get the default connection
      const db = mongoose.connection;

      //Bind connection to error event (to get notification of connection statusCode)
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));

      let userDetails;

      // get user details by using userName
      await Model.users.findOne({ userName }, (err, dbRes) => {
        if (err) throw err;
        userDetails = dbRes;
      });
      // console.log(`console logs: userDetails`, userDetails);

      // check user existence in collections. if not then send 400 error
      if (!userDetails) {
        // user does not exist
        res.status(400).json({
          success: false,
          error: {
            status: utils.statusCode[400].status,
            name: utils.statusCode[400].name,
            message: `user don't exist.`,
          },
        });
      } else {
        // generate otp
        const otp = utils.otpGenerator(4);

        // send OTP
        const brand = `ONSI`;
        const domain = 'https://onsi.in';
        const message = `submit your otp to move towards next step.`;

        utils.email.otp(
          brand,
          domain,
          userDetails.firstName,
          userDetails.email,
          message,
          otp
        );

        // update on db
        const otpEmail = new Model.otps({
          otp,
          purpose: 'FORGET_PASSWORD',
          user_id: userDetails._id,
          receiver: [userDetails.email],
          type: 'EMAIL',
        });

        otpEmail.save().then(dbRes => {
          console.info('INFO: otp saved on DB.:\t', dbRes._id);
        });

        // send success response
        res.status(200).json({
          success: true,
          data: {
            user_id: userDetails._id,
            userName,
            type: 'EMAIL',
            message: `otp successfully send to your registered email address.`,
          },
        });
      }
    }
  },

  change: async (req, res) => {
    // TODO: old_password, new Password
    let errMessage = [];
    let errFlag = false;
    let { password, oldPassword } = req.body;
    let client_type = req.header('Client-Type');
    // check clientType existence
    if (!client_type) {
      errFlag = true;
      errMessage.push('Client_Type header is required.');
    }

    // check password existence
    if (!password) {
      errFlag = true;
      errMessage.push('password is required.');
    }

    // check oldPassword existence
    if (!oldPassword) {
      errFlag = true;
      errMessage.push('oldPassword is required.');
    } else {
      // Create a schema
      let schema = new passwordValidator();
      // Add properties to it
      schema
        .is()
        .min(6) // Minimum length 6
        .is()
        .max(100) // Maximum length 100
        .has()
        .uppercase() // Must have uppercase letters
        .has()
        .lowercase() // Must have lowercase letters
        .has()
        .digits() // Must have digits
        .has()
        .symbols() // Must have symbols
        .has()
        .not()
        .spaces() // Should not have spaces
        .is()
        .not(/[!]/)
        .oneOf(['password', 'Password']); // Blacklist these values
      if (!schema.validate(password)) {
        errFlag = true;

        const fail = schema.validate(password, { list: true });

        fail.forEach(item => {
          // console.log(item);
          if (item === 'not') {
            errMessage.push('special character ! is not allowed.');
          }
          if (item === 'max' || item === 'min') {
            errMessage.push('password must be 6 to 100 characters.');
          }

          if (item === 'digits') {
            errMessage.push('password must contain at least one NUMBER.');
          }

          if (item === 'symbols') {
            errMessage.push(
              'password must contain at least one SPECIAL character.'
            );
          }

          if (item === 'spaces') {
            errMessage.push('spaces are not allowed.');
          }

          if (item === 'uppercase') {
            errMessage.push(
              'password must contain at least one UPPERCASE character.'
            );
          }

          if (item === 'lowercase') {
            errMessage.push(
              'password must contain at least one LOWERCASE character.'
            );
          }

          if (item === 'oneOf') {
            errMessage.push('invalid password. eg: password ..etc.');
          }
        });
      } else {
        // generate the salt
        const salt = bcrypt.genSaltSync(10);
        // hash the password
        password = bcrypt.hashSync(password, salt);
      }
    }
    // check error if exist then send error response
    if (errFlag) {
      let err = new Error();
      err.code = utils.statusCode[412].status;
      err.name = utils.statusCode[412].name;
      err.message = errMessage.join(' ');
      throw err;
    } else {
      // check user not already exist
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        uri_decode_auth: true,
      });

      // Get the default connection
      const db = mongoose.connection;

      //Bind connection to error event (to get notification of connection statusCode)
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));
      // TODO: start from here. create db connection server. create token validator api
      // validate sessionToken using jwt
      try {
        // validate sessionToken
        const secret = `${'organizationId'}`;
        const decoded = jwt.verify(sessionToken, secret);
        // console.log(`console logs: decoded`, decoded);

        // update new password to the db
        if (
          user_id === decoded.user_id &&
          decoded.purpose === 'FORGET_PASSWORD'
        ) {
          await Model.users.findByIdAndUpdate(
            user_id,
            {
              password,
            },
            // eslint-disable-next-line no-unused-vars
            (err, dbRes) => {
              if (err) throw err;
              // console.log(dbRes);
            }
          );

          // send success response
          res.status(200).send({
            success: true,
            data: {
              user_id,
              message: 'your password changed Successfully',
            },
          });
        } else {
          // if invalid Token Credentials eg. Purpose or user_id
          res.status(401).json({
            success: false,
            error: {
              status: utils.statusCode[401].status,
              name: utils.statusCode[401].name,
              message: `Invalid sessionToken`,
            },
          });
        }
      } catch (err) {
        // err if sessionToken is invalid
        res.status(401).json({
          success: false,
          error: {
            status: utils.statusCode[401].status,
            name: utils.statusCode[401].name,
            message: `invalid session token`,
          },
        });
      }
    }
  },

  update: async (req, res) => {
    let errMessage = [];
    let errFlag = false;

    let { user_id, password, sessionToken } = req.body;
    let client_type = req.header('Client-Type');

    // check clientType existence
    if (!client_type) {
      errFlag = true;
      errMessage.push('Client-Type header is required.');
    }

    // check user_id existence
    if (!user_id) {
      errFlag = true;
      errMessage.push('user_id is required.');
    }

    // check sessionToken existence
    if (!sessionToken) {
      errFlag = true;
      errMessage.push('sessionToken is required.');
    }

    // check password existence and validate password
    if (!password) {
      errFlag = true;
      errMessage.push('password is required');
    } else {
      // Create a schema
      let schema = new passwordValidator();
      // Add properties to it
      schema
        .is()
        .min(6) // Minimum length 6
        .is()
        .max(100) // Maximum length 100
        .has()
        .uppercase() // Must have uppercase letters
        .has()
        .lowercase() // Must have lowercase letters
        .has()
        .digits() // Must have digits
        .has()
        .symbols() // Must have symbols
        .has()
        .not()
        .spaces() // Should not have spaces
        .is()
        .not(/[!]/)
        .oneOf(['password', 'Password']); // Blacklist these values
      if (!schema.validate(password)) {
        errFlag = true;

        const fail = schema.validate(password, { list: true });

        fail.forEach(item => {
          // console.log(item);
          if (item === 'not') {
            errMessage.push('special character ! is not allowed.');
          }
          if (item === 'max' || item === 'min') {
            errMessage.push('password must be 6 to 100 characters.');
          }

          if (item === 'digits') {
            errMessage.push('password must contain at least one NUMBER.');
          }

          if (item === 'symbols') {
            errMessage.push(
              'password must contain at least one SPECIAL character.'
            );
          }

          if (item === 'spaces') {
            errMessage.push('spaces are not allowed.');
          }

          if (item === 'uppercase') {
            errMessage.push(
              'password must contain at least one UPPERCASE character.'
            );
          }

          if (item === 'lowercase') {
            errMessage.push(
              'password must contain at least one LOWERCASE character.'
            );
          }

          if (item === 'oneOf') {
            errMessage.push('invalid password. eg: password ..etc.');
          }
        });
      } else {
        // generate the salt
        const salt = bcrypt.genSaltSync(10);
        // hash the password
        password = bcrypt.hashSync(password, salt);
      }
    }

    // check error if exist then send error response
    if (errFlag) {
      let err = new Error();
      err.code = utils.statusCode[412].status;
      err.name = utils.statusCode[412].name;
      err.message = errMessage.join(' ');
      throw err;
    } else {
      // check user not already exist
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        uri_decode_auth: true,
      });

      // Get the default connection
      const db = mongoose.connection;

      //Bind connection to error event (to get notification of connection statusCode)
      db.on('error', console.error.bind(console, 'MongoDB connection error:'));

      // validate sessionToken using jwt
      try {
        // validate sessionToken
        const secret = `${'organizationId'}`;
        const decoded = jwt.verify(sessionToken, secret);
        // console.log(`console logs: decoded`, decoded);

        // update new password to the db
        if (
          user_id === decoded.user_id &&
          decoded.purpose === 'FORGET_PASSWORD'
        ) {
          await Model.users.findByIdAndUpdate(
            user_id,
            {
              password,
            },
            // eslint-disable-next-line no-unused-vars
            (err, dbRes) => {
              if (err) throw err;
              // console.log(dbRes);
            }
          );

          // send success response
          res.status(200).send({
            success: true,
            data: {
              user_id,
              message: 'your password changed Successfully',
            },
          });
        } else {
          // if invalid Token Credentials eg. Purpose or user_id
          res.status(401).json({
            success: false,
            error: {
              status: utils.statusCode[401].status,
              name: utils.statusCode[401].name,
              message: `Invalid sessionToken`,
            },
          });
        }
      } catch (err) {
        // err if sessionToken is invalid
        res.status(401).json({
          success: false,
          error: {
            status: utils.statusCode[401].status,
            name: utils.statusCode[401].name,
            message: `invalid session token`,
          },
        });
      }
    }
  },
};

/**
 * ***********************************************
 * GLOBAL FUNCTIONS
 * ***********************************************
 */

// eslint-disable-next-line no-unused-vars
async function updatePasswordInCollection() {
  return 0;
}
