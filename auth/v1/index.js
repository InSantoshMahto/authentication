const register = require('./register'),
  login = require('./login'),
  password = require('./password'),
  self = require('./self'),
  verify = require('./verify');

const v1 = {};

v1.register = register.init;
v1.login = login.init;
v1.forgetPassword = password.init;
v1.updatePassword = password.init;
v1.self = self.init;
v1.verify = verify.verify;

module.exports = v1;
