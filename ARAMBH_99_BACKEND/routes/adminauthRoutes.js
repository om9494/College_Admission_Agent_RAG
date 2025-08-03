const express = require("express");
const { adminsignup } = require("../admin/signup");
const { adminlogin } = require("../admin/login");


const router = express.Router();

// Routes
router.post("/signup", adminsignup);
router.post("/login", adminlogin);

module.exports = router;



