const mongoose = require('mongoose');
const auth = require('./auth.model');

/**
 * mongoose config
 */
mongoose.set('useFindAndModify', false);

module.exports = {
  users: auth.users,
  otps: auth.otps,
};
