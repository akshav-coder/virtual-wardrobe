const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const { auth } = require("../middleware/auth");

// Public routes (no authentication required)
router.post("/register", register);
router.post("/login", login);

// Protected routes (authentication required)
router.post("/logout", auth, logout);

module.exports = router;
