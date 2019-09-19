const register = require('./register'),
  login = require('./login'),
  password = require('./password'),
  self = require('./self'),
  verify = require('./verify'),
  profile = require('./profile');

module.exports = {
  register: register.init,
  login: login.init,
  forgetPassword: password.forget,
  updatePassword: password.update,
  changePassword: password.change,
  self: self.init,
  verify: verify.init,
  resendOtp: verify.resendOtp,
  getProfile: profile.getProfile,
  setProfile: profile.setProfile,
};
