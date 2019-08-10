const lib = {};

lib.init = (req, res) => {
  res.status(200).json({ route: 'v1/self' });
};

module.exports = lib;
