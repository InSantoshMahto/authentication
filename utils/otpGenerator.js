// Math.floor(Math.random() * 1000000);

module.exports = (length = 4) => {
  length = length >= 4 ? length : 4;
  return Math.floor(Math.random() * Math.pow(10, length));
};
