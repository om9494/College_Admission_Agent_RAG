const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Utility: Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.signup = async (req, res) => {
    try {
        const { name, surname, email, password, notification } = req.body;


        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Check if user already exists
        const existingUser = await User.findOne({ email: trimmedEmail.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        // Save user
        const user = new User({ name, surname, email, password: hashedPassword, notification });
        await user.save();
        const token = generateToken(user);
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, notification: user.notification }, // Send user data
        });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};