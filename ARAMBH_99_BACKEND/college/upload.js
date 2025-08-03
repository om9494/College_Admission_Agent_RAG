const College = require("../models/College");
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");

const mongoURI = process.env.MONGO_URI;

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = `${Date.now()}-${file.originalname}`;
            const fileInfo = {
                filename: filename,
                bucketName: "uploads"
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({
    storage
});

exports.fileUploader = upload.array("files", 10); //Allows up to 10 files

exports.getFile = async (req, res) => {
    try {
        const collegeName = req.query.name;
        const college = await College.findOne({ name: collegeName });
        if (!college) {
            return res.status(404).json({ message: "College not found" });
        }
        res.json({ files: college.files });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
