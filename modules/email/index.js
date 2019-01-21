'use strict'

const nodemailer = require('nodemailer');
/*
 * html messege
 */
let html = "<section> <style>*{padding: 0; margin: 0}.pageTitle{text-align: center; padding: .7rem 0; background: #E91E63; color: #fff;}.container-fluid{padding: 0 2rem; background-color: #f7f7f7; color: #000; font-family: tahoma;}.flexContainer{display: flex; flex-wrap: wrap; align-items: stretch; padding-top: 1rem; padding-bottom: .5rem;}.item{padding: 0 1rem}.pageHedaing{text-align: center; font-size: 1.5rem; background: #e91e63; padding: .7rem 0; color: #fff;}.footer, .otp{background: #000; color: #fff; text-align: center}.msg{padding: 1rem 0; text-align: center;}.otp{width: 50%; margin: auto; padding: 1.5rem .2rem; font-weight: bolder; letter-spacing: .5rem}.footer{padding: 1.3rem 0 1rem; margin-bottom: 0; width: 100%; height: 2rem}.link{display: block; text-decoration: none; text-align: center; padding: 2rem 0; font-weight: 700;}@media (max-width:575.98px){.container-fluid{padding: 0 .5rem;}}</style> <h1 class='pageTitle'>ONSI</h1> <div class='container-fluid'> <div class='flexContainer'> <div class='item' style='flex-grow: 4;'> <div style='display:flex; justify-content: center;'> <img src='https://onsi.in/assets/images/logo-transparent-256x256.png' alt='onsiLogo'> </div></div><div class='item' style='flex-grow: 8;'> <h3 class='pageHedaing'>OTP</h3> <p class='msg'> This one time password (OTP) is valide for 5 minutes only. </p><p class='otp'> 7856 </p><p> <a href='#!' target='_blank' rel='noopener noreferrer' class='link'>Home</a> </p></div></div></div><div class='footer'> <p class='footerMsg'> One Net Software Info </p></div></section>";
// async..await is not allowed in global scope, must use a wrapper
async function main() {

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let account = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465, // 587
        secure: true, // true for 465, false for other ports
        auth: {
            user: "support@onsi.in", // generated ethereal user
            pass: "Support@12345" // generated ethereal password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"ONSI" <support@onsi.in>', // sender address
        to: "onsihero@gmail.com", // list of receivers
        subject: "Testing", // Subject line
        text: "onsi", // plain text body
        html: html // html body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);


// console.log("I am from email module");