const dte = require("../models/DTE");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateDTEToken = (dte) => {
    return jwt.sign({ id: dte._id }, process.env.JWT_SECRET_DTE, { expiresIn: "1h" });
};


exports.dtesignup = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;


        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Check if user already exists
        const existingdte = await dte.findOne({ email: trimmedEmail.toLowerCase() });
        if (existingdte) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        // console.log("Password: " + hashedPassword);

        // Save user
        const DTE = new dte({ name, surname, email, password: hashedPassword});
        await DTE.save();
        const token = generateDTEToken(DTE);
        res.status(201).json({
            message: "dte registered successfully",
            token,
            dte: { id: DTE._id, name: DTE.name, email: DTE.email }, // Send user data
        });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};