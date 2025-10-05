const express = require("express");
const router = express.Router();
const {
  getCurrentWeather,
  setLocation,
  getOutfitRecommendations,
  getForecast,
  getAlerts,
  getWeatherHistory,
  getWeatherStats,
  refreshWeather,
} = require("../controllers/weatherController");
const { auth } = require("../middleware/auth");

// All weather routes require authentication
router.use(auth);

// Basic weather operations
router.get("/current", getCurrentWeather);
router.post("/location", setLocation);
router.put("/refresh", refreshWeather);

// Weather-based recommendations
router.get("/recommendations", getOutfitRecommendations);

// Weather data and forecasts
router.get("/forecast", getForecast);
router.get("/alerts", getAlerts);
router.get("/history", getWeatherHistory);
router.get("/stats", getWeatherStats);

module.exports = router;
