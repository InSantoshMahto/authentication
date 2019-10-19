// Math.floor(Math.random() * 1000000);

const getOtp = length => {
  const otp = Math.floor(Math.random() * Math.pow(10, length));
  if (otp.toString().length !== length) {
    getOtp();
  }
  return otp;
};

module.exports = (length = 4) => {
  length = length >= 4 ? length : 4;
  return getOtp(length);
};
