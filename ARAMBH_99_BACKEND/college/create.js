const College = require("../models/College");

exports.createCollege = async (req, res) => {
    try {
        const { name, administrator, information, address, contact, websites, infrastructure, courses, admission_process, cutoff, placement, alumni, events_activities, governance, committees, other } = req.body;

        const existingCollege = await College.findOne({ name });
        if (existingCollege) {
            return res.status(400).json({ message: "College already exists" });
        }

        const college = new College({ name, administrator, information, address, contact, websites, infrastructure, courses, admission_process, cutoff, placement, alumni, events_activities, governance, committees, other });
        await college.save();
        res.status(201).json({
            message: "College created successfully",
            college: { id: college._id, name: college.name, administrator: college.administrator, information: college.information, address: college.address, contact: college.contact, websites: college.websites, infrastructure: college.infrastructure, courses: college.courses, admission_process: college.admission_process, cutoff: college.cutoff, placement: college.placement, alumni: college.alumni, events_activities: college.events_activities, governance: college.governance, committees: college.committees, other: college.other }
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}