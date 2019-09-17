const mongoose = require('mongoose');
// const moment = require('moment');
const errors = require('../../core/errors');
const Model = require('../../models');
// const core = require('../../core');
const utils = require('../../utils');
const mongoURI = require('../../config').mongoURI;
module.exports = {
  init: async (req, res) => {
    // TODO: send otp
    let errMessage = [];
    let errFlag = false;

    let { userName } = req.body;
    let { client_type } = req.header('Client-Type');

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
      err.code = errors.statusCode[412].status;
      err.name = errors.statusCode[412].name;
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

      //Bind connection to error event (to get notification of connection errors)
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
            status: errors.statusCode[400].status,
            name: errors.statusCode[400].name,
            message: `user don't exist.`,
          },
        });
      } else {
        // generate otp
        const otp = utils.otpGenerator(4);
        // TODO: store in collection

        // send success response
        res.status(200).json({
          success: true,
          error: {
            status: errors.statusCode[200].status,
            name: errors.statusCode[20].name,
            message: `otp successfully send to your registered email address.`,
          },
        });
      }
    }
  },

  forget: async (req, res) => {
    // TODO: new password & auth_token
    console.log(`console logs: res`, res);
    console.log(`console logs: req`, req);
    res.send({ type: 'forget' });
  },

  change: async (req, res) => {
    // TODO: old_password, new Password
    console.log(`console logs: res`, res);
    console.log(`console logs: req`, req);
    res.send({ type: 'update' });
  },
};
