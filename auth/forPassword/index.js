let getUseDetails = (req, res) => {
    console.log("i am from forget password getUseDetails from auth");
    res.send('getUseDetails');
}
let verification = (req, res) => {
    console.log("i am from forget password otpVerification  from auth");
    res.send('otpVerification');
}
let chaPassword = (req, res) => {
    console.log("i am from forget password chaPassword  from auth");
    res.send('chaPassword');
}
module.exports = {
    getUseDetails: getUseDetails,
    verification: verification,
    chaPassword: chaPassword
};