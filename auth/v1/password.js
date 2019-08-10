const lib = {};

lib.init = (req, res) => {
  const type = req.params.type;
  console.log(`console logs: type`, type);
  res.status(200).json({ route: 'v1/update password' });
};

module.exports = lib;
