const mongoose = require('mongoose');
const users = require('./users');
const otps = require('./otps');

mongoose.set('useFindAndModify', false);

const Model = {};

Model.users = users;
Model.otps = otps;

module.exports = Model;
