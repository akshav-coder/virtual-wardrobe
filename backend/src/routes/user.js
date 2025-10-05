const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  updatePreferences,
  updateBodyMeasurements,
  updateEmail,
  deleteAccount,
  getUserStats,
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");

// All user routes require authentication
router.use(auth);

// Profile management
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/stats", getUserStats);

// Password management
router.put("/password", changePassword);

// Email management
router.put("/email", updateEmail);

// Preferences management
router.put("/preferences", updatePreferences);

// Body measurements management
router.put("/measurements", updateBodyMeasurements);

// Account management
router.delete("/account", deleteAccount);

module.exports = router;
