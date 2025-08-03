const User = require("../models/User");
const Admin = require("../models/Admin");
const DTE = require("../models/DTE");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const generateAdminToken = (admin) => {
    return jwt.sign({ id: admin._id }, process.env.JWT_SECRET_ADMIN, { expiresIn: "1h" });
};

const generateDTEToken = (dte) => {
    return jwt.sign({ id: dte._id }, process.env.JWT_SECRET_DTE, { expiresIn: "1h" });
};



exports.combinedLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const trimmedEmail = email.trim().toLowerCase(); //Consistent trimming and lowercasing

        // Check User collection
        let user = await User.findOne({ email: trimmedEmail });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const token = generateToken(user);
                return res.status(200).json({
                    message: "Login successful",
                    token,
                    user: { id: user._id, name: user.name, email: user.email, notification: user.notification },
                    role: "user" //Add role information to the response
                });
            }
        }


        // Check Admin collection (only if user login fails)
        let admin = await Admin.findOne({ email: trimmedEmail });
        if (admin) {
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (isPasswordValid) {
                const token = generateAdminToken(admin);
                return res.status(200).json({
                    message: "Login successful",
                    token,
                    admin: { id: admin._id, name: admin.name, email: admin.email, college: admin.college },
                    role: "admin" // Add role information to the response
                });
            }
        }


        // Check DTE collection (only if admin login fails)
        let dte = await DTE.findOne({ email: trimmedEmail });
        if (dte) {
            const isPasswordValid = await bcrypt.compare(password, dte.password);
            if (isPasswordValid) {
                const token = generateDTEToken(dte);
                return res.status(200).json({
                    message: "Login successful",
                    token,
                    dte: { id: dte._id, name: dte.name, email: dte.email, college: dte.college },
                    role: "dte" // Add role information to the response
                });
            }
        }

        return res.status(401).json({ message: "Invalid credentials" }); //No user or admin found with those credentials
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
