const Notification = require("../models/Notification");

exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.body.notificationId;
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        notification.read = true;
        await notification.save();
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
