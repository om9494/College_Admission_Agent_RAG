const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token for password reset
    const resetToken = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET, {
      expiresIn: "15m",
    });

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: true, // Use SSL/TLS
      port: 465,
    });

    // console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

    // Email content
    const resetLink = `${process.env.FRONTEND_URL}reset-password/:token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: `
      <!DOCTYPE html>
  <html>
  <head>
    <title>Password Reset Request</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        margin: 0;
        padding: 0;
      }
  
      .container {
        max-width: 600px;
        margin: 0 auto;
  
        padding: 20px;
  
        background-color: #f2f2f2;
      }
  
      .header {
        background-color: #333;
        color: #fff;
        padding: 20px;
        text-align: center;
      }
  
      .content {
        background-color: #fff;
        padding: 20px;
      }
  
      .footer {
        background-color: #333;
        color: #fff;
        padding: 20px;
        text-align: center;
      }
  
      .button {
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
  
        text-decoration: none;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
  
        <h2>Password Reset Request</h2>
      </div>
      <div class="content">
        <p>You recently requested to reset your password.</p>
        <p>To reset your password, please click the link below:</p>
        <a style="color:white" href="${resetLink}" target="_blank" class="button">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>© SIH2024 Arambh_99</p>
      </div>
    </div>
  </body>
  </html>
    `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
