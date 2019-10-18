const otpGenerator = require('./otpGenerator.util');
const email = require('../utils/email');
const sms = require('../utils/sms');
const statusCode = require('./statusCode.util');

// exports
module.exports = {
  otpGenerator,
  email,
  sms,
  statusCode,
};
