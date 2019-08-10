const lib = {};

lib.verify = (req, res) => {
  res.status(200).json({ route: 'v1/verify' });
};

lib.verifyEmail = (req, res) => {
  res.status(200).json({ route: 'v1/verify-email' });
};

lib.verifyMobile = (req, res) => {
  res.status(200).json({ route: 'v1/verify-mobile' });
};

module.exports = lib;
