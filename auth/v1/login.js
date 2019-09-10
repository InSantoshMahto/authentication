module.exports = {
  init: (req, res) => {
    res.status(200).json({ route: 'v1/login' });
  },
};
