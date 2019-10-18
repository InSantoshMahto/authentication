const mongoose = require('mongoose');
const moment = require('moment');
const utils = require('../../utils');
const Model = require('../../models');
const jwt = require('jsonwebtoken');
// const utils = require('../../utils');
const mongoURI = require('../../config').mongoURI;

module.exports = {
  init: async (req, res) => {
    let errMessage = [];
    let errFlag = false;

    let { user_id, otp, type, purpose } = req.body;
    let client_type = req.header('Client-Type');

    // check clientType existence
    if (!client_type) {
      errFlag = true;
      errMessage.push('Client_Type header is required.');
    }

    // check Type existence
    if (!type) {
      errFlag = true;
      errMessage.push('type is required.');
    } else if (
      type.toUpperCase() !== 'EMAIL' &&
      type.toUpperCase() !== 'MOBILE' &&
      type.toUpperCase() !== 'BOTH'
    ) {
      errFlag = true;
      errMessage.push('invalid type');
    } else {
      type = type.toUpperCase();
    }

    // check user_id existence
    if (!user_id) {
      errFlag = true;
      errMessage.push('user_id is required.');
    }

    // check otp
    if (!otp) {
      errFlag = true;
      errMessage.push('otp is required.');
    }

    // decide purpose
    console.log(`console logs: purpose`, purpose);
    if (!purpose) {
      purpose = 'login';
    } else {
      purpose = purpose.toLowerCase();
      if (
        !(
          purpose === 'forget-password' ||
          purpose === 'change-password' ||
          purpose === 'email-verification' ||
          purpose === 'mobile-verification' ||
          purpose === 'account-enabling' ||
          purpose === 'user-activation' ||
          purpose === 'login'
        )
      ) {
        errFlag = true;
        errMessage.push('invalid verification purpose');
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

      let otpDetails;
      await Model.otps.findOne({ user_id, client_type }, (err, dbRes) => {
        if (err) throw err;
        otpDetails = dbRes;
      });
      // console.log(`console logs: otpDetails`, otpDetails);

      if (!otpDetails) {
        res.status(400).json({
          success: false,
          error: 'There is No Active Session For Authentications',
        });
      } else if (otpDetails.type !== type) {
        res
          .status(403)
          .json({ success: false, error: 'invalid receiver type' });
      } else if (otpDetails.otp === otp) {
        const now = moment(new Date()); //todays date
        const end = moment(otpDetails.createdAt); // another date
        const duration = moment.duration(now.diff(end));
        const times = duration.asMinutes();
        // console.log(times);
        if (times <= 10) {
          // delete the existing otp from db
          await deleteOtp(otpDetails._id);

          //update users collection
          let isEmailVerified = false;
          let isMobileVerified = false;
          // update account status
          const isAccountStatus = true;
          // update account verification status
          const isAccountVerify = true;
          // update remark
          const remark = 'user registered And verified';
          // update contact info
          if (type === 'EMAIL') {
            isEmailVerified = true;
          } else if (type === 'MOBILE') {
            isMobileVerified = true;
          } else {
            isEmailVerified = true;
            isMobileVerified = true;
          }
          // calling updateUsers function for account activations
          await updateUsers(
            otpDetails.user_id,
            isAccountStatus,
            isAccountVerify,
            isMobileVerified,
            isEmailVerified,
            remark
          );

          // generate token
          const secret = `${'organizationId'}`;
          const valid = 15 * 60 * 10000;
          const info = {
            purpose,
            user_id: otpDetails.user_id,
          };
          const sessionToken = await generateAuthToken(secret, valid, info);

          // send success response to the client
          res.status(200).json({
            success: true,
            data: {
              'Client-Type': client_type,
              user_id,
              purpose,
              sessionToken,
            },
          });
        } else {
          // delete the existing otp from db
          await deleteOtp(otpDetails._id);
          res.status(403).json({ success: false, error: 'OTP Expired' });
        }
      } else {
        res.status(403).json({ success: false, error: 'invalid OTP' });
      }
    }
  },
  /**
   * reSendOtp
   * @description use to re send the existing otp.
   */
  resendOtp: async (req, res) => {
    // TODO: validate user info
    res.send({ route: 'resend otp' });
  },
};

/**
 * ***********************************************
 * GLOBAL FUNCTIONS
 * ***********************************************
 */

/**
 *deleteOtp
 * @param {sting} _id
 * @description use to delete the otp from otps collections
 */
async function deleteOtp(_id) {
  // eslint-disable-next-line no-unused-vars
  await Model.otps.findByIdAndDelete(_id, (err, dbRes) => {
    if (err) throw err;
    // console.log(dbRes);
  });
}

/**
 *updateUsers
 * @param {boolean} isAccountStatus status for account is disabled or enabled
 * @param {boolean} isAccountVerify status for account is active or not
 * @param {boolean} isMobileVerified mobile verified or not
 * @param {boolean} isEmailVerified email verified or not
 * @param {string} remark remark update
 * @param {string} _id user_id
 * @description  use to update the users collection for account activation
 */
async function updateUsers(
  _id,
  isAccountStatus,
  isAccountVerify,
  isMobileVerified,
  isEmailVerified,
  remark
) {
  const modifiedAt = new Date();
  await Model.users.findByIdAndUpdate(
    _id,
    {
      isAccountStatus,
      isAccountVerify,
      isEmailVerified,
      isMobileVerified,
      remark,
      modifiedAt,
    },
    // eslint-disable-next-line no-unused-vars
    (err, dbRes) => {
      if (err) throw err;
      // console.log(dbRes);
    }
  );
}

/**
 * generateAuthToken
 * @param {sting} secret
 * @param {string | number} valid
 * @param {object} data
 * @returns {string} token
 * @description generate temporary token to identify the otp verification purpose
 */
async function generateAuthToken(secret, valid, data) {
  const token = jwt.sign(data, secret, { expiresIn: valid });
  return token;
}
