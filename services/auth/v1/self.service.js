const jwt = require('jsonwebtoken');
const utils = require('../../../utils');

module.exports = {
  init: async (req, res) => {
    let errMessage = [];
    let errFlag = false;

    let client_type = req.header('Client-Type');
    let access_token = req.header('Access-Token');

    // check clientType existence
    if (!client_type) {
      errFlag = true;
      errMessage.push('Client_Type header is required.');
    }
    // check access_token existence
    if (!access_token) {
      errFlag = true;
      errMessage.push('Access-Token header is required.');
    }

    // check error if exist then send error response
    if (errFlag) {
      let err = new Error();
      err.code = utils.statusCode[412].status;
      err.name = utils.statusCode[412].name;
      err.message = errMessage.join(' ');
      throw err;
    } else {
      // invalid token - synchronous
      try {
        // validate access_token
        const secret = `${'organizationId'}`;
        const decoded = jwt.verify(access_token, secret);
        // console.log(`console logs: decoded`, decoded);
        res.status(200).send({
          success: true,
          userName: decoded.userName,
          user_id: decoded.user_id,
        });
      } catch (err) {
        // err if access_token is invalid
        res.status(401).json({
          success: false,
          error: {
            status: utils.statusCode[401].status,
            name: utils.statusCode[401].name,
            message: `invalid access token`,
          },
        });
      }
    }
  },
};
