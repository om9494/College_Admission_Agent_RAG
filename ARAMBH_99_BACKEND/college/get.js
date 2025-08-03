const College = require("../models/College");

exports.getCollegeData = async (req, res) => {
    try {
        const collegeName = req.query.name;
        // console.log("College Name: "+collegeName);
        const college = await College.findOne({ name: collegeName });

        if (!college) {
            return res.status(404).json({ message: "College not found" });
        }

        res.json({ college });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
