const validator = require('validator');
const passwordValidator = require('password-validator');
const bcrypt = require('bcryptjs');
const objectHash = require('object-hash');
const Model = require('../../../models');
const utils = require('../../../utils');

module.exports = {
  init: async (req, res, next) => {
    let errMessage = [];
    let errFlag = false;

    let {
      privilegeType,
      firstName,
      middleName,
      lastName,
      mobile,
      email,
      dob,
      gender,
      password,
    } = req.body;

    let client_type = req.header('Client-Type');

    // formating the data
    middleName = middleName ? middleName : null;
    dob = dob ? dob : null;
    gender = gender ? gender : null;
    lastName = lastName ? lastName : null;

    // check clientType existence
    if (!client_type) {
      errFlag = true;
      errMessage.push('Client_Type header is required.');
    }

    // privilegeType validation
    if (!privilegeType) {
      errFlag = true;
      errMessage.push('privilegeType is required.');
    } else if (privilegeType.toUpperCase().indexOf('CUSTOMER') === -1) {
      errFlag = true;
      errMessage.push('invalid privilegeType');
    }

    // first name validation
    if (!firstName) {
      errFlag = true;
      errMessage.push('name is required.');
    } else if (!firstName.length > 2) {
      errFlag = true;
      errMessage.push('name must be greater than 2 characters');
    }

    // mobile validation
    if (!mobile) {
      // check number is exist or not
      errFlag = true;
      errMessage.push('mobile number is required.');
    } else if (mobile.length !== 10) {
      // check number is must be 10 digit
      errFlag = true;
      errMessage.push('mobile number must be 10 digit.');
    } else if (isNaN(mobile)) {
      // check number must be numeric value.
      errFlag = true;
      errMessage.push('mobile number only numbers.');
    } else if (!validator.isMobilePhone(mobile, 'en-IN')) {
      // check number is valid for india or not
      errFlag = true;
      errMessage.push('invalid mobile number.');
    }

    // validate email address
    if (!email) {
      // check email is exist or not
      errFlag = true;
      errMessage.push('email is required.');
    } else if (!validator.isEmail(email)) {
      errFlag = true;
      errMessage.push('invalid email');
    }

    // validate password
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

    // making email as a username
    const userName = email ? email : mobile;

    // generate hash
    const hash = objectHash(
      { userName, firstName, password },
      { algorithm: 'md5', encoding: 'hex' }
    );

    // adding remark
    const remark = 'user registered But Not verified';

    // if any error
    if (errFlag) {
      return next({ status: 412, message: errMessage.join(' ') });
    } else {
      // // check user not already exist

      const userExistence = { flag: false, type: null };

      // check user existence with mobile number
      await Model.users.findOne({ userName: mobile }, (dbErr, docs) => {
        if (dbErr) {
          console.error(
            `ERROR: during checking the existence (WITH_MOBILE) of user into db.: ${dbErr}`
          );
          return next({
            status: 500,
            message: `ERROR: during checking the existence (WITH_MOBILE) of user into db.: ${dbErr}`,
          });
        }
        if (docs) {
          userExistence.flag = true;
          userExistence.type = 'mobile';
        }
      });

      // check user existence with email
      await Model.users.findOne({ userName: email }, (dbErr, docs) => {
        if (dbErr) {
          console.error(
            `ERROR: during checking the existence (WITH_EMAIL) of user into db.: ${dbErr}`
          );
          return next({
            status: 500,
            message: `ERROR: during checking the existence (WITH_EMAIL) of user into db.: ${dbErr}`,
          });
        }
        if (docs) {
          userExistence.flag = true;
          userExistence.type = 'email';
        }
      });

      // check if user already exist or not
      if (userExistence.flag) {
        const message = userExistence.type === 'email' ? email : mobile;
        console.warn(
          `WARNING: user already exist with ${userExistence.type}: ${message}.`
        );

        return next({
          status: 400,
          message: `user already exist with ${userExistence.type}: ${message}.`,
        });
      } else {
        // insert user details
        const newUser = new Model.users({
          userName,
          email,
          mobile,
          firstName,
          middleName,
          lastName,
          password,
          gender,
          dob,
          hash,
          remark,
        });
        // executing query into db
        newUser
          .save()
          .then(dbRes => {
            // console.log('successfully inserted:', dbRes);
            const user_id = dbRes.id;

            // generate otp
            const otp = utils.otpGenerator(4); // console.log(`generated otp:\t`, otp);

            // send OTP
            const brand = `ONSI`;
            const domain = 'https://onsi.in';
            const message = `verify your account by submitting the otp given below.`;

            utils.email.otp(brand, domain, firstName, email, message, otp);

            // update on db
            const otpEmail = new Model.otps({
              otp,
              user_id,
              purpose: 'USER_ACTIVATION',
              receiver: [email],
              type: 'EMAIL',
            });

            otpEmail.save().then(dbRes => {
              console.info('INFO: otp saved on DB.:\t', dbRes._id);
            });

            // send response
            res.status(200).json({
              success: true,
              data: {
                user_id,
                userName,
                type: 'EMAIL',
                message: 'otp has successfully send.',
              },
            });
          })
          .catch(dbRrr => {
            console.error(
              `ERROR:  during inserting the data into db.: ${dbRrr}`
            );
            return next({
              status: 500,
              message: `ERROR:  during inserting the data into db.: ${dbRrr}`,
            });
          });
      }
    }
  },
};
