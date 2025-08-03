const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAdminToken = (admin) => {
    return jwt.sign({ id: admin._id }, process.env.JWT_SECRET_ADMIN, { expiresIn: "1h" });
};


exports.adminsignup = async (req, res) => {
    try {
        const { name, surname, email, password, college } = req.body;


        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Check if user already exists
        const existingAdmin = await Admin.findOne({ email: trimmedEmail.toLowerCase() });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingCollege = await Admin.findOne({ college });
        if (existingCollege) {
            return res.status(400).json({ message: "College already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        // console.log("Password: " + hashedPassword);

        // Save user
        const admin = new Admin({ name, surname, email, password: hashedPassword, college });
        await admin.save();
        const token = generateAdminToken(admin);
        res.status(201).json({
            message: "Admin registered successfully",
            token,
            admin: { id: admin._id, name: admin.name, email: admin.email, college: admin.college }, // Send user data
        });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ message: "Internal Server Error: " + err.message });
    }
};