const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAdminToken = (admin) => {
    return jwt.sign({ id: admin._id }, process.env.JWT_SECRET_ADMIN, { expiresIn: "1h" });
};


exports.adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Find user
        const admin = await Admin.findOne({ email: trimmedEmail.toLowerCase() });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(trimmedPassword, admin.password);
        // console.log("isPasswordValid: "+isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = generateAdminToken(admin);

        res.status(200).json({
            message: "Login successful",
            token,
            admin: { id: admin._id, name: admin.name, email: admin.email, college: admin.college },
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
