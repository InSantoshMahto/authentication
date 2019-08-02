// importing functionalities
let connections = require('./connections');
let credentials = require('./credentials');

let db = {
  credentials: credentials,
  connections: connections,
};
// exports
module.exports = db;
