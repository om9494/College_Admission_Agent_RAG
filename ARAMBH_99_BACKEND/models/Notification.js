const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { type: String, required: true },
    sender: { type: String, required: true }, // Refers to the User model
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    college: { type: String, required: true }, // Name of the college updated
    read: { type: Boolean, default: false }, // To track read/unread status
    type: {type: String, enum: ['update', 'message'], required: true} // Type of notification (update or direct message)
});

module.exports = mongoose.model('Notification', notificationSchema);