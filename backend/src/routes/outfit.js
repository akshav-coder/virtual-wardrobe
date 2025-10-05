const express = require("express");
const router = express.Router();
const {
  getOutfits,
  getOutfit,
  createOutfit,
  updateOutfit,
  deleteOutfit,
  toggleFavorite,
  incrementWearCount,
  addItem,
  removeItem,
  getStats,
  getFavorites,
  getTemplates,
  getScheduledOutfits,
  getWeatherBasedOutfits,
} = require("../controllers/outfitController");
const { auth } = require("../middleware/auth");

// All outfit routes require authentication
router.use(auth);

// Statistics and lists (must come before /:id routes)
router.get("/stats/overview", getStats);
router.get("/favorites", getFavorites);
router.get("/templates", getTemplates);
router.get("/scheduled", getScheduledOutfits);
router.get("/weather-based", getWeatherBasedOutfits);

// Basic CRUD operations
router.route("/").get(getOutfits).post(createOutfit);
router.route("/:id").get(getOutfit).put(updateOutfit).delete(deleteOutfit);

// Outfit actions
router.put("/:id/favorite", toggleFavorite);
router.put("/:id/wear", incrementWearCount);

// Item management
router.put("/:id/items/add", addItem);
router.put("/:id/items/remove", removeItem);

module.exports = router;
