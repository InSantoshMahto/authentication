let login = (req, res) => {
    console.log("i am from login  from auth");
    res.send('login');
}

let otpVerification = (req, res) => {
    console.log("i am from otpVerification  from auth");
    res.send('otpVerification');
}

module.exports = {
    login: login,
    otpVerification: otpVerification
};