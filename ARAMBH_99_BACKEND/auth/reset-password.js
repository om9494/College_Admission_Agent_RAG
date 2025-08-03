const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Verify the token
        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);

        // Find user by ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the password
        user.password = await bcrypt.hash(newPassword, 10); // Ensure hashing happens here if needed
        await user.save();

        res.status(200).json({ message: "Password successfully reset" });
    } catch (err) {
        console.error("Reset Password Error:", err.message);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};