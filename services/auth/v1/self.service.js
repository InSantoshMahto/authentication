const jwt = require('jsonwebtoken');
const utils = require('../../../utils');

module.exports = async (req, res, next) => {
  let errMessage = [];
  let errFlag = false;

  let clientType = req.header('Client-Type');
  let authorizationToken = req.header('Authorization');

  // check clientType existence
  if (!clientType) {
    errFlag = true;
    errMessage.push('Client-Type header is required.');
  }

  // check authorizationToken existence
  if (!authorizationToken) {
    errFlag = true;
    errMessage.push('Authorization header is required.');
  } else {
    authorizationToken = authorizationToken.split(' ')[1];
  }

  // check error if exist then send error response
  if (errFlag) {
    return next({ status: 412, message: errMessage.join(' ') });
  } else {
    // invalid token - synchronous
    try {
      // validate authorizationToken
      const secret = `${'organizationId'}`;
      const decoded = jwt.verify(authorizationToken, secret);
      res.status(200).send({
        success: true,
        data: decoded.userDetails,
      });
    } catch (err) {
      // err if authorizationToken is invalid
      res.status(401).json({
        success: false,
        error: {
          status: utils.statusCode[401].status,
          name: utils.statusCode[401].name,
          message: `Authorization Token`,
        },
      });
    }
  }
};
