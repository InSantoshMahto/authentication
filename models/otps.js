const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const lib = {};

const otps = new Schema({
  user_id: { type: Schema.Types.ObjectId },
  otp: { type: String, minlength: 4, maxlength: 8 },
  type: { type: Object, uppercase: true, trim: true, default: 'EMAIL' },
  client_type: { type: String, uppercase: true, trim: true, default: 'WEB' },
  receiver: { type: Array, default: [] },
  isValid: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

lib.otps = mongoose.model('otps', otps);

module.exports = lib.otps;
