const nodemailer = require('nodemailer');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const ejs = require('ejs');

const config = require('../../../config');

// async..await is not allowed in global scope, must use a wrapper
module.exports = async function(brand, domain, firstName, to, message, otp) {
  const transporter = nodemailer.createTransport({
    service: 'zoho',
    auth: {
      user: config.email.userId,
      pass: config.email.password,
    },
  });

  const options = {
    cidPrefix: `auth_${Math.floor(Date.now())}`,
  };

  transporter.use('compile', inlineBase64(options));

  ejs.renderFile(
    __dirname + '/index.html',
    { brand, domain, otp, firstName, message },
    async (err, html) => {
      if (err) {
        console.error(err);
      } else {
        transporter
          .sendMail({
            from: '"ONSI" <noreply@onsi.in>',
            to,
            subject: 'Verification',
            html,
          })
          .then(info => {
            console.log('Message sent: %s', info.messageId);
          })
          .catch(err => {
            console.error('ERROR: during sending the mail.:\t', err.message);
          })
          .finally(() => {
            // console.log('INFO: Email Block Executed Successfully');
          });
      }
    }
  );
};
