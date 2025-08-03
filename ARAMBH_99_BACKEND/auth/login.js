const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Utility: Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Find user
        const user = await User.findOne({ email: trimmedEmail.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, notification: user.notification },
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};