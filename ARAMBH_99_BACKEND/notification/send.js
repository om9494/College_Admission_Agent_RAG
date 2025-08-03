const Notification = require("../models/Notification");

exports.sendNotification = async (req, res) => {
    try {
        const { recipient, sender, message, college, type } = req.body;
        console.log(req.body);
        const notification = new Notification({
            recipient,
            sender,
            message,
            college,
            type,
        });
        await notification.save();
        res.status(201).json({ message: "Notification sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}