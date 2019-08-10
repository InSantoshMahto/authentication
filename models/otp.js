const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const lib = {};

const otp = new Schema({
  userName: { type: String },
  type: { type: String },
  email: { type: String },
  client: { type: String },
  validFor: { type: String },
  createdAt: { type: Date, default: Date.now },
});

lib.otp = mongoose.model('otp', otp);

module.exports = lib.otp;
