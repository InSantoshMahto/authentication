const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const lib = {};

const users = new Schema({
  userName: { type: String },
  email: { type: String },
  mobile: { type: String, minlength: 10, maxlength: 10 },
  firstName: { type: String },
  middleName: { type: String, default: null },
  lastName: { type: String, default: null },
  password: { type: String },
  gender: { type: String },
  dob: { type: String },
  lastLogin: { type: String },
  hash: { type: String },
  emailStatus: { type: Boolean },
  mobileStatus: { type: Boolean },
  accountStatus: { type: Boolean },
  remark: { type: String },
  createdAt: { type: Date, default: Date.now },
});

lib.users = mongoose.model('users', users);

module.exports = lib.users;
