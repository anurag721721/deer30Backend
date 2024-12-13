const nodemailer = require("nodemailer");

require("dotenv").config();

const sendEmail = async (recipient, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Ignore certificate validation errors
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
