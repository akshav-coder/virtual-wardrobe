const express = require("express");
const router = express.Router();
const {
  trackEvent,
  getEvents,
  getDashboard,
  getUserStats,
  getEventTypeStats,
  getCategoryStats,
  getDailyActivity,
  getHourlyActivity,
  getItemStats,
  getSearchStats,
  getRecommendationStats,
  getWardrobeInsights,
} = require("../controllers/analyticsController");
const { auth } = require("../middleware/auth");

// All analytics routes require authentication
router.use(auth);

// Analytics dashboard and overview
router.get("/dashboard", getDashboard);
router.get("/stats", getUserStats);

// Detailed analytics
router.get("/events", getEvents);
router.get("/event-types", getEventTypeStats);
router.get("/categories", getCategoryStats);
router.get("/daily", getDailyActivity);
router.get("/hourly", getHourlyActivity);

// Item and content analytics
router.get("/items", getItemStats);
router.get("/searches", getSearchStats);
router.get("/recommendations", getRecommendationStats);
router.get("/wardrobe", getWardrobeInsights);

// Event tracking
router.post("/track", trackEvent);

module.exports = router;
