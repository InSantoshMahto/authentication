const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * schema for otps
 */
const otps = new Schema({
  user_id: { type: Schema.Types.ObjectId },
  otp: { type: String, minlength: 4, maxlength: 8 },
  type: { type: Object, uppercase: true, trim: true, default: 'EMAIL' },
  clientType: { type: String, uppercase: true, trim: true, default: 'WEB' },
  receiver: { type: Array, default: [] },
  purpose: { type: String, default: 'login' },
  isValid: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

/**
 * schema for users
 */
const users = new Schema({
  userName: { type: String, lowercase: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  privilegeType: {
    type: String,
    lowercase: true,
    trim: true,
    default: 'CUSTOMER',
  }, // SUPPER_ADMIN or ADMIN or CLIENT or CUSTOMER (ACL)
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
  clientType: { type: String, uppercase: true, trim: true, default: 'WEB' },
  address: {
    type: Schema.Types.Mixed,
    lowercase: true,
    trim: true,
    default: null,
  },
  remark: { type: String, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

module.exports = {
  otps: mongoose.model('otps', otps),
  users: mongoose.model('users', users),
};
