const utils = require('../../utils');

module.exports = {
  errorHandler: async (err, req, res, next) => {
    if (!err) {
      next();
      return;
    }

    if (err.stack) {
      console.error(err.stack);
    }

    err.status = err.status ? err.status : 500;
    err.name = utils.statusCode[err.status].name;
    err.message = err.message ? err.message : 'Something Went Wrong';

    res.status(err.status).send({
      success: false,
      error: {
        status: err.status,
        name: err.name,
        message: err.message,
      },
    });
  },
};
