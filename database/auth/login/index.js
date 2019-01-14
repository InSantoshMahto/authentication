let login = () => {
    console.log("i am from login");
    res.send('login  from db');
}

let otpVerification = () => {
    console.log("i am from otpVerification  from db");
    res.send('otpVerification');
}

module.exports = {
    login: login,
    otpVerification: otpVerification
};