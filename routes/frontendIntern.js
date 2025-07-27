const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");

const upload = multer({ dest: "uploads/" });

router.post("/web-intern", upload.single("resume"), async (req, res) => {
  const { name, email, portfolio, reason } = req.body;
  const resumeFile = req.file;

  if (!resumeFile) {
    return res.status(400).json({ error: "Resume upload failed." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // your gmail
      pass: process.env.MAIL_PASS, // your app password
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MAIL_RECEIVER,
    subject: `Frontend Developer Internship Application - ${name}`,
    html: `
      <h3>Frontend Developer Internship Application</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Portfolio:</strong> ${portfolio}</p>
      <p><strong>Reason:</strong> ${reason}</p>
    `,
    attachments: [
      {
        filename: resumeFile.originalname,
        path: resumeFile.path,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ error: "Email failed", details: error });
  }
});

module.exports = router;
