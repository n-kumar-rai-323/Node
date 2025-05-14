const nodemailer = require("nodemailer");

const transporter = new nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
    if (error) {
      console.error("Error connecting to SMTP server:", error);
      //  Consider throwing an error here to prevent the app from starting
    } else {
      console.log("Server is ready to take our messages");
    }
  });


const sendEmail = async ({ to, subject, htmlMessage }) => {
  try {
    const info = await transporter.sendMail({
      from: `"From Jatra" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html: htmlMessage,
    });
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; //  Re-throw the error for the caller to handle
  }
};
module.exports = {sendEmail }
