const express = require("express");
const router = express.Router();
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  toggleFavorite,
  incrementWearCount,
  addTag,
  removeTag,
  getStats,
  getFavorites,
  getRecentItems,
} = require("../controllers/wardrobeController");
const { auth } = require("../middleware/auth");

// All wardrobe routes require authentication
router.use(auth);

// Statistics and lists (must come before /:id routes)
router.get("/stats/overview", getStats);
router.get("/favorites", getFavorites);
router.get("/recent", getRecentItems);

// Basic CRUD operations
router.route("/").get(getItems).post(createItem);
router.route("/:id").get(getItem).put(updateItem).delete(deleteItem);

// Item actions
router.put("/:id/favorite", toggleFavorite);
router.put("/:id/wear", incrementWearCount);
router.put("/:id/tags/add", addTag);
router.put("/:id/tags/remove", removeTag);

module.exports = router;
