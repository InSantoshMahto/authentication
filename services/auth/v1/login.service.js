const mongoose = require('mongoose');
const passwordValidator = require('password-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const moment = require('moment');
const utils = require('../../../utils');
const Model = require('../../../models');
const mongoURI = require('../../../config').mongoURI;

module.exports = {
  init: async (req, res) => {
    let errMessage = [];
    let errFlag = false;

    let { userName, password } = req.body;
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

    // check password existence and validate
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
      } else if (!bcrypt.compareSync(password, userDetails.password)) {
        // incorrect password
        res.status(400).json({
          success: false,
          error: {
            status: utils.statusCode[400].status,
            name: utils.statusCode[400].name,
            message: `incorrect password`,
          },
        });
      } else if (!userDetails.isAccountVerify) {
        // account is not verified
        res.status(403).json({
          success: false,
          error: {
            status: utils.statusCode[403].status,
            name: utils.statusCode[403].name,
            message: `Your account is not verified`,
          },
        });
      } else if (!userDetails.isAccountStatus) {
        // account is disabled
        res.status(403).json({
          success: false,
          error: {
            status: utils.statusCode[403].status,
            name: utils.statusCode[403].name,
            message: `Your account is not Disabled. please contact to support team.`,
          },
        });
      } else {
        // generate token
        const secret = `${'organizationId'}`;
        const valid = `7d`;

        delete userDetails.hash;
        delete userDetails.createdAt;
        delete userDetails.modifiedAt;
        delete userDetails.__v;

        const authorizationToken = jwt.sign(
          {
            userDetails,
          },
          secret,
          { expiresIn: valid }
        );

        // delete unnecessary data from userDetails objects
        userDetails.hash = userDetails.modifiedAt = userDetails.password = userDetails.isAccountStatus = userDetails.isAccountVerify = userDetails.remark = undefined;
        // send token with userDetails
        res.status(200).json({
          success: true,
          data: {
            authorizationToken,
            userDetails: userDetails,
          },
        });
      }
    }
  },
};
