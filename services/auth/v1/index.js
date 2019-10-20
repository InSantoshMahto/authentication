const register = require('./register.service'),
  login = require('./login.service'),
  password = require('./password.service'),
  verify = require('./verify.service'),
  profile = require('./profile.service');

module.exports = {
  register: register.init,
  login: login.init,
  forgetPassword: password.forget,
  updatePassword: password.update,
  changePassword: password.change,
  self: require('./self.service'),
  verify: verify.init,
  resendOtp: verify.resendOtp,
  getProfile: profile.getProfile,
  setProfile: profile.setProfile,
};
