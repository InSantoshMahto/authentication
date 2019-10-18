const otpGenerator = require('./otpGenerator');
const email = require('../utils/email');
const sms = require('../utils/sms');
const statusCode = require('./statusCode');

// exports
module.exports = {
  otpGenerator,
  email,
  sms,
  statusCode,
};
