const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");




exports.notifyUser = async (req, res) => {
    try {
        const { notification, email, token } = req.body; //Get token from the body

        console.log(notification, email, token);
        if (!token) { //Check if token exists
            return res.status(401).json({ message: "Unauthorized: Token missing" }); //Server-side error response
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);  //Verify the token
            const userId = decoded.id; //Get the user ID from the token
            console.log(userId);
            //Find and update in one operation, and add case-insensitive email matching
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId, email: email.toLowerCase() },  //Find user by ID and email. Add email for verification.
                { notification: notification },
                { new: true } //To return the updated document.
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found or token invalid" });
            }

            res.status(200).json({ message: "Notification updated successfully", notification: updatedUser.notification });
        } catch (error) {
            console.error("Token Verification Error:", error);
            return res.status(401).json({ message: "Unauthorized: Invalid or expired token" }); //Token verification failed
        }

    } catch (err) {
        console.error("Notification Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};