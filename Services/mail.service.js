// utils/mailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password, not your real Gmail password
  }
});

const sendVerificationEmail = async (toEmail, token) => {
  const link = `${process.env.BASE_URL}/mail/verify-email?token=${token}`;

  const options = {
    from: `"Business Nexus" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your email',
    html: `
      <h3>Click the button below to verify your email</h3>
      <a href="${link}" style="background:#4F46E5; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Verify Email</a>
      <p>If the button doesn't work, click this link: <br /><a href="${link}">${link}</a></p>
    `
  };
  console.log('Sending email to in mail service:', toEmail);

  await transporter.sendMail(options);
};

module.exports = sendVerificationEmail;
