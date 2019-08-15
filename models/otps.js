const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const lib = {};

const otps = new Schema({
  user_id: { type: Schema.Types.ObjectId },
  otp: { type: Number, min: 4 },
  type: { type: String, uppercase: true, trim: true, default: 'EMAIL' },
  clientType: { type: String, uppercase: true, trim: true, default: 'WEB' },
  receiver: { type: String },
  isValid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

lib.otps = mongoose.model('otps', otps);

module.exports = lib.otps;
