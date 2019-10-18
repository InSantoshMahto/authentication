// access control list

module.exports = async (req, res, next) => {
  const query = req.query;
  console.log(`console logs: query`, query);
  next();
};
