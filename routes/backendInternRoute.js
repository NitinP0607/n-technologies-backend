const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");

const upload = multer({ dest: "uploads/" });

router.post("/backend-intern", upload.single("resume"), async (req, res) => {
  const { fullName, email, github, linkedin, reason, language } = req.body;
  const resumeFile = req.file;

  if (!resumeFile) {
    return res.status(400).json({ error: "Resume upload failed." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MAIL_RECEIVER,
    subject: `Backend Developer Internship Application - ${fullName}`,
    html: `
      <h3>Backend Internship Application</h3>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>GitHub:</strong> ${github}</p>
      <p><strong>LinkedIn:</strong> ${linkedin}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Preferred Language:</strong> ${language}</p>
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
  } catch (err) {
    res.status(500).json({ error: "Email failed", details: err });
  }
});

module.exports = router;
