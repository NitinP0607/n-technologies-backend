const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");

const upload = multer({ dest: "uploads/" });

router.post("/digital-marketing-intern", upload.single("resume"), async (req, res) => {
  const { name, email, linkedin, reason } = req.body;
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
    subject: `Digital Marketing Internship Application - ${name}`,
    html: `
      <h3>Digital Marketing Internship Application</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>LinkedIn:</strong> ${linkedin}</p>
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
  } catch (err) {
    res.status(500).json({ error: "Email failed", details: err });
  }
});

module.exports = router;
