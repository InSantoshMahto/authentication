const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  // production config
  console.info('INFO: Running on PRODUCTION Environments');
  module.exports = require('./key_prod.config');
} else if (process.env.NODE_ENV === 'development') {
  // development config
  console.info('INFO: Running on DEVELOPMENT Environments');
  module.exports = require('./key_dev.config');
} else {
  // local config
  console.info('INFO: Running on LOCAL Environments');
  module.exports = require('./key_local.config');
}

// export constants.
module.exports.constant = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'constants.json'), {
    encoding: 'utf-8',
  })
);
