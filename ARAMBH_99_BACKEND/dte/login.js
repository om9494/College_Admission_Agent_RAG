const DTE = require("../models/DTE");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateDTEToken = (DTE) => {
    return jwt.sign({ id: DTE._id }, process.env.JWT_SECRET_DTE, { expiresIn: "1h" });
};


exports.dtelogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Find user
        const DTE = await DTE.findOne({ email: trimmedEmail.toLowerCase() });
        if (!DTE) {
            return res.status(404).json({ message: "DTE Admin not found" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(trimmedPassword, DTE.password);
        // console.log("isPasswordValid: "+isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = generateDTEToken(DTE);

        res.status(200).json({
            message: "DTE Admin Login successful",
            token,
            DTE: { id: DTE._id, name: DTE.name, email: DTE.email, college: DTE.college },
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
