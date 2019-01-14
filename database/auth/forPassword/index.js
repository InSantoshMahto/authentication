let getUseDetails = () => {
    console.log("i am from forget password getUseDetails  from db");
    res.send('getUseDetails');
}
let otpVerification = () => {
    console.log("i am from forget password otpVerification  from db");
    res.send('otpVerification');
}
let chaPassword = () => {
    console.log("i am from forget password chaPassword  from db");
    res.send('chaPassword');
}
module.exports = {
    getUseDetails: getUseDetails,
    otpVerification: otpVerification,
    chaPassword: chaPassword
};