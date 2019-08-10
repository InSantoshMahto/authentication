const lib = {};

lib.init = (req, res) => {
  res.status(200).json({ route: 'v1/login' });
};

module.exports = lib;
