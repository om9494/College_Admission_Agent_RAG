const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
    try {
       const recipientEmail = req.query.recipient;
       console.log(recipientEmail);
       const notifications = await Notification.find({ recipient: recipientEmail });
       console.log(notifications.length);
       res.json(notifications);

    } catch (error) {
       res.status(500).json({ message: error.message });
    }

};