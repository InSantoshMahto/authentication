const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  // production config
  console.info('INFO: Running on PRODUCTION Environments');
  module.exports = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'key_prod.config.json'), {
      encoding: 'utf-8',
    })
  );
} else if (process.env.NODE_ENV === 'development') {
  // development config
  console.info('INFO: Running on DEVELOPMENT Environments');
  module.exports = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'key_dev.config.json'), {
      encoding: 'utf-8',
    })
  );
} else {
  // local config
  console.info('INFO: Running on LOCAL Environments');
  module.exports = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'key_local.config.json'), {
      encoding: 'utf-8',
    })
  );
}

// export constants.
module.exports.constant = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'constants.json'), {
    encoding: 'utf-8',
  })
);
