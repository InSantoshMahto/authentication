if (process.env.NODE_ENV === 'prod') {
  // production config
  console.info('INFO: Running on PRODUCTION Environments');
  module.exports = require('./key_prod');
} else if (process.env.NODE_ENV === 'dev') {
  // development config
  console.info('INFO: Running on DEVELOPMENT Environments');
  module.exports = require('./key_dev');
} else {
  // local config
  console.info('INFO: Running on LOCAL Environments');
  module.exports = require('./key_local');
}
