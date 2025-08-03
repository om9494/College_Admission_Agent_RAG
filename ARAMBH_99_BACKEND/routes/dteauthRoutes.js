const express = require("express");
const { dtesignup } = require("../dte/signup");
const { dtelogin } = require("../dte/login");


const router = express.Router();

// Routes
router.post("/signup", dtesignup);
router.post("/login", dtelogin);

module.exports = router;



