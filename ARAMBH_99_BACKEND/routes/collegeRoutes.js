const express = require("express");
const { createCollege } = require("../college/create");
const { updateCollege } = require("../college/update");
const { getCollegeData } = require("../college/get");
const { emailler } = require("../college/emailer");


const router = express.Router();

// Routes
router.post("/create", createCollege);
router.post("/update", updateCollege);
router.get("/get", getCollegeData);
router.post("/emailler", emailler);




module.exports = router;