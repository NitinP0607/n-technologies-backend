
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/send-service-request", async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail", // Or use your email service
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.MAIL_RECEIVER,
    subject: `New Service Request: ${service}`,
    html: `
      <h3>Service Inquiry</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Form Submitted successfully, our team will get back to you soon" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit form", error: err.message });
  }
});

module.exports = router;
