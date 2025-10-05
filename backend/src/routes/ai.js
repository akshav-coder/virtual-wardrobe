const express = require("express");
const router = express.Router();
const {
  getRecommendations,
  generateRecommendations,
  addFeedback,
  getStats,
  getStyleAnalysis,
} = require("../controllers/aiController");
const { auth } = require("../middleware/auth");

// All AI routes require authentication
router.use(auth);

// AI recommendation operations
router.get("/recommendations", getRecommendations);
router.post("/recommendations/generate", generateRecommendations);
router.put("/recommendations/:id/feedback", addFeedback);

// AI analytics and analysis
router.get("/stats", getStats);
router.get("/style-analysis", getStyleAnalysis);

module.exports = router;
