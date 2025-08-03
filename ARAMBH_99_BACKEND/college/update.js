const College = require("../models/College");

exports.updateCollege = async (req, res) => {
    try {
        const { name, administrator, information, address, contact, websites, infrastructure, courses, admission_process, cutoff, placement, alumni, events_activities, governance, committees, other } = req.body;

        const college = await College.findOneAndUpdate({ name }, { administrator, information, address, contact, websites, infrastructure, courses, admission_process, cutoff, placement, alumni, events_activities, governance, committees, other }, { new: true });

        if (!college) {
            return res.status(404).json({ message: "College not found" });
        }

        res.json({ message: "College updated successfully", college });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
