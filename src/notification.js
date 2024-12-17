const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object that will send the email, rember to replace the user and pass with your own
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Function that sends an email if you wanna set it
async function sendEmail(to, subject, text) {
  try {
    const mailOptions = {
      from: "leocolgucci@gmail.com", // Sender
      to, // Recipient
      subject, // Object
      text, // Text of the email
    };

    await transporter.sendMail(mailOptions);
    console.log("Email send it successfully:", to);
  } catch (error) {
    console.error("Error sending the email:", error);
  }
}

module.exports = { sendEmail };
