const express = require("express");
const { getNotifications } = require("../notification/get");
const { sendNotification } = require("../notification/send");
const { markAsRead } = require("../notification/markread");




const router = express.Router();

// Routes
router.get("/get", getNotifications);
router.post("/send", sendNotification);
router.post("/markread", markAsRead);

module.exports = router;