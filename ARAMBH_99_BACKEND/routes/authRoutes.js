const express = require("express");
const { signup } = require("../auth/signup.js");
const { login } = require("../auth/login.js");
const { forgotPassword } = require("../auth/forget-password.js");
const { resetPassword } = require("../auth/reset-password.js");
const { notifyUser } = require("../auth/notify-user.js");
const { combinedLogin } = require("../auth/combinedLogin.js");

const router = express.Router();

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/notify-user", notifyUser);
router.post("/combinedLogin", combinedLogin);

module.exports = router;

