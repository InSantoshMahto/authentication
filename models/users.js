const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const lib = {};

const users = new Schema({
  userName: { type: String, lowercase: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  mobile: {
    type: String,
    minlength: 10,
    maxlength: 10,
    lowercase: true,
    trim: true,
  },
  firstName: { type: String, lowercase: true, trim: true },
  middleName: { type: String, lowercase: true, trim: true, default: null },
  lastName: { type: String, lowercase: true, trim: true, default: null },
  password: { type: String },
  gender: { type: String, lowercase: true, trim: true },
  dob: { type: String, lowercase: true, trim: true },
  hash: { type: String, lowercase: true, trim: true },
  isEmailVerified: { type: Boolean, default: false },
  isMobileVerified: { type: Boolean, default: false },
  isAccountVerify: { type: Boolean, default: false },
  isAccountStatus: { type: Boolean, default: false },
  address: {
    type: Schema.Types.Mixed,
    lowercase: true,
    trim: true,
    default: null,
  },
  remark: { type: String, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

lib.users = mongoose.model('users', users);

module.exports = lib.users;
