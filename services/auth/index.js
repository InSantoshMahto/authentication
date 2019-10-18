const v1 = require('./v1'),
  v2 = require('./v2');

const auth = {};

auth.v1 = v1;
auth.v2 = v2;

module.exports = auth;
