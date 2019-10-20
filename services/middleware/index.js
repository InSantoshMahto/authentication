const middleware = require('./app.middleware');
const auth = require('./auth.middleware');

module.exports = {
  authorization: auth.authorization,
  acl: auth.acl,
  errorHandler: middleware.errorHandler,
};
