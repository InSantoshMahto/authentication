const moment = require('moment');
const Model = require('../../../models');
const jwt = require('jsonwebtoken');
const utils = require('../../../utils');

module.exports = {
  init: async (req, res, next) => {
    let errMessage = [];
    let errFlag = false;

    let { user_id, otp, type, purpose } = req.body;
    let clientType = req.header('Client-Type');

    // check clientType existence
    if (!clientType) {
      errFlag = true;
      errMessage.push('Client-Type header is required.');
    }

    // check Type existence
    if (!type) {
      errFlag = true;
      errMessage.push('type is required.');
    } else {
      type = type.toUpperCase();
      if (type !== 'EMAIL' && type !== 'MOBILE' && type !== 'BOTH') {
        errFlag = true;
        errMessage.push('invalid type');
      }
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
    if (!purpose) {
      purpose = 'LOGIN';
    } else {
      purpose = purpose.toUpperCase();
      if (
        !(
          purpose === 'FORGET_PASSWORD' ||
          purpose === 'CHANGE_PASSWORD' ||
          purpose === 'EMAIL_VERIFICATION' ||
          purpose === 'MOBILE_VERIFICATION' ||
          purpose === 'ACCOUNT_ENABLING' ||
          purpose === 'USER_ACTIVATION' ||
          purpose === 'LOGIN'
        )
      ) {
        errFlag = true;
        errMessage.push('invalid verification purpose');
      }
    }

    // check error if exist then send error response
    if (errFlag) {
      return next({ status: 412, message: errMessage.join(' ') });
    } else {
      // check user not already exist

      let otpDetails;
      await Model.otps.findOne({ user_id, clientType }, (err, dbRes) => {
        if (err) throw err;
        otpDetails = dbRes;
      });

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
              'Client-Type': clientType,
              user_id,
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
  resendOtp: async (req, res, next) => {
    // TODO: validate user info
    let errMessage = [];
    let errFlag = false;

    let { user_id, type, purpose } = req.body;
    let clientType = req.header('Client-Type');

    // check clientType existence
    if (!clientType) {
      errFlag = true;
      errMessage.push('Client-Type header is required.');
    }

    // check Type existence
    if (!type) {
      errFlag = true;
      errMessage.push('type is required.');
    } else {
      type = type.toUpperCase();
      if (type !== 'EMAIL' && type !== 'MOBILE' && type !== 'BOTH') {
        errFlag = true;
        errMessage.push('invalid type. i.e, receiver type');
      }
    }

    // check user_id existence
    if (!user_id) {
      errFlag = true;
      errMessage.push('user_id is required.');
    }

    // decide purpose
    if (!purpose) {
      purpose = 'LOGIN';
    } else {
      purpose = purpose.toUpperCase();
      if (
        !(
          purpose === 'FORGET_PASSWORD' ||
          purpose === 'CHANGE_PASSWORD' ||
          purpose === 'EMAIL_VERIFICATION' ||
          purpose === 'MOBILE_VERIFICATION' ||
          purpose === 'ACCOUNT_ENABLING' ||
          purpose === 'USER_ACTIVATION' ||
          purpose === 'LOGIN'
        )
      ) {
        errFlag = true;
        errMessage.push('invalid verification purpose');
      }
    }

    let otpDetails, userDetails, otp;
    // check error if exist then send error response
    if (errFlag) {
      return next({ status: 412, message: errMessage.join(' ') });
    } else {
      // check user not already exist
      await Model.otps.findOne(
        { user_id, purpose, type, clientType },
        (err, dbRes) => {
          if (err) throw err;
          otpDetails = dbRes;
        }
      );
      // if otp found the send resend the otp
      if (!otpDetails) {
        // regenerate otp and send to the client

        // generate otp
        otp = utils.otpGenerator(4); // console.log(`generated otp:\t`, otp);

        // get complete user details
        await Model.users.findById(user_id, (err, dbRes) => {
          if (err) throw err;
          userDetails = dbRes;
        });

        // update on db
        const otpEmail = new Model.otps({
          otp,
          user_id,
          purpose: 'USER_ACTIVATION',
          receiver: [userDetails.email],
          type: 'EMAIL',
        });

        await otpEmail.save().then(dbRes => {
          console.info('INFO: otp saved on DB.:\t', dbRes._id);
          otpDetails = dbRes;
        });
      }

      // if type email then send otp to the email address
      if (otpDetails.type === 'EMAIL') {
        // send OTP
        const brand = `ONSI`;
        const domain = 'https://onsi.in';
        const message = `verify your account by submitting the otp given below.`;
        const userName =
          userDetails && userDetails.userName
            ? userDetails.userName
            : 'resend user';

        utils.email.otp(
          brand,
          domain,
          userName,
          otpDetails.receiver[0],
          message,
          otpDetails.otp
        );

        res.send({
          success: true,
          data: {
            user_id,
            userName,
            type: 'EMAIL',
            message: 'otp has successfully resented.',
          },
        });
      } else if (otpDetails.type === 'MOBILE') {
        // TODO: implement mobile number otp send.
      } else {
        // TODO: implement mobile number & email both otp send.
      }
    }
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
