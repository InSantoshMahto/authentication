const jwt = require('jsonwebtoken');

module.exports = {
  authorization: async (req, res, next) => {
    let errMessage = [];
    let errFlag = false;

    let authorizationToken = req.header('Authorization');

    // check authorizationToken existence
    if (!authorizationToken) {
      errFlag = true;
      errMessage.push('Authorization header is required.');
    } else {
      authorizationToken = authorizationToken.split(' ')[1];
    }

    // check error if exist then send error response
    if (errFlag) {
      return next({
        status: 401,
        message: errMessage.join(' '),
      });
    } else {
      try {
        // validate authorizationToken
        const secret = `${'organizationId'}`;
        const decoded = jwt.verify(authorizationToken, secret);
        req.userDetails = decoded.userDetails;
      } catch (err) {
        // err if authorizationToken is invalid
        return next({
          status: 401,
          message: 'Fail to extract the token details.',
        });
      }
      next();
    }
  },
  acl: async (req, res, next) => {
    console.log('acl');
    next();
  },
};
