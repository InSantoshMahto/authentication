const jwt = require('jsonwebtoken');
const errors = require('../../core/errors');

module.exports = {
  init: async (req, res) => {
    let errMessage = [];
    let errFlag = false;

    let { client_type, token } = req.headers;

    // check clientType existence
    if (!client_type) {
      errFlag = true;
      errMessage.push('Client_Type header is required.');
    }
    // check token existence
    if (!token) {
      errFlag = true;
      errMessage.push('token is required.');
    }

    // check error if exist then send error response
    if (errFlag) {
      let err = new Error();
      err.code = errors.statusCode[412].status;
      err.name = errors.statusCode[412].name;
      err.message = errMessage.join(' ');
      throw err;
    } else {
      // validate token
      const secret = `${'organizationId'}`;

      // invalid token - synchronous
      try {
        const decoded = jwt.verify(token, secret);
        console.log(`console logs: decoded`, decoded);
        res.status(200).send({
          success: true,
          userName: decoded.userName,
          user_id: decoded.user_id,
        });
      } catch (err) {
        // err if token is invalid
        res.status(401).json({
          success: false,
          error: {
            status: errors.statusCode[401].status,
            name: errors.statusCode[401].name,
            message: `invalid token`,
          },
        });
      }
    }
  },
};
