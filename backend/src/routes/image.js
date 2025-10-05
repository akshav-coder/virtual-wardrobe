const express = require("express");
const router = express.Router();
const {
  uploadImage,
  getImages,
  getImage,
  deleteImage,
  processImage,
  getImageStats,
  getImagesByColor,
  getImagesByStyle,
  uploadMiddleware,
} = require("../controllers/imageController");
const { auth } = require("../middleware/auth");

// All image routes require authentication
router.use(auth);

// Image statistics and lists (must come before /:id routes)
router.get("/stats", getImageStats);
router.get("/color/:color", getImagesByColor);
router.get("/style/:styleTag", getImagesByStyle);

// Basic CRUD operations
router.route("/").get(getImages).post(uploadMiddleware, uploadImage);
router.route("/:id").get(getImage).delete(deleteImage);

// Image processing
router.post("/:id/process", processImage);

module.exports = router;
