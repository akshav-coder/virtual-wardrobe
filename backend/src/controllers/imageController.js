const Image = require("../models/Image");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/images";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."
        ),
        false
      );
    }
  },
});

// Upload single image
const uploadImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "No file uploaded",
        message: "Please select an image file to upload",
      });
    }

    // Get image dimensions (simplified - in production, use sharp or jimp)
    const dimensions = { width: 800, height: 600 }; // Default dimensions

    const image = new Image({
      user: userId,
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: `/uploads/images/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
      dimensions,
      metadata: {
        uploadSource: "web",
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
        originalFormat: path.extname(file.originalname).toLowerCase(),
      },
    });

    await image.save();

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        image,
      },
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to upload image",
    });
  }
};

// Get user images
const getImages = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      mimeType,
      isPublic,
      processingStatus,
      hasAnalysis,
      limit = 20,
      skip = 0,
    } = req.query;

    const filters = { mimeType, isPublic, processingStatus, hasAnalysis };
    const options = { limit: parseInt(limit), skip: parseInt(skip) };

    const images = await Image.getUserImages(userId, filters, options);

    res.status(200).json({
      success: true,
      message: "Images retrieved successfully",
      data: {
        images,
        count: images.length,
        pagination: {
          limit: parseInt(limit),
          skip: parseInt(skip),
        },
      },
    });
  } catch (error) {
    console.error("Get images error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve images",
    });
  }
};

// Get single image
const getImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const image = await Image.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!image) {
      return res.status(404).json({
        error: "Image not found",
        message: "Image does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image retrieved successfully",
      data: {
        image,
      },
    });
  } catch (error) {
    console.error("Get image error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve image",
    });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const image = await Image.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!image) {
      return res.status(404).json({
        error: "Image not found",
        message: "Image does not exist or belongs to another user",
      });
    }

    // Delete file from filesystem
    try {
      if (fs.existsSync(image.path)) {
        fs.unlinkSync(image.path);
      }
    } catch (fileError) {
      console.error("Error deleting file:", fileError);
    }

    // Soft delete from database
    await Image.findOneAndUpdate(
      { _id: id, user: userId },
      { isActive: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to delete image",
    });
  }
};

// Process image (color extraction, style analysis, etc.)
const processImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const image = await Image.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!image) {
      return res.status(404).json({
        error: "Image not found",
        message: "Image does not exist or belongs to another user",
      });
    }

    if (image.processing.status === "completed") {
      return res.status(400).json({
        error: "Already processed",
        message: "Image has already been processed",
      });
    }

    // Start processing
    image.processing.status = "processing";
    image.processing.startedAt = new Date();
    await image.save();

    // Simulate image processing (in production, use actual image processing libraries)
    await simulateImageProcessing(image);

    res.status(200).json({
      success: true,
      message: "Image processing started successfully",
      data: {
        image,
      },
    });
  } catch (error) {
    console.error("Process image error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to process image",
    });
  }
};

// Get image statistics
const getImageStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [stats, colorDistribution, styleDistribution, processingStats] =
      await Promise.all([
        Image.getImageStats(userId),
        Image.getColorDistribution(userId),
        Image.getStyleDistribution(userId),
        Image.getProcessingStats(userId),
      ]);

    res.status(200).json({
      success: true,
      message: "Image statistics retrieved successfully",
      data: {
        stats: stats[0] || {},
        colorDistribution,
        styleDistribution,
        processingStats,
      },
    });
  } catch (error) {
    console.error("Get image stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve image statistics",
    });
  }
};

// Get images by color
const getImagesByColor = async (req, res) => {
  try {
    const userId = req.user._id;
    const { color } = req.params;

    const images = await Image.getImagesByColor(userId, color);

    res.status(200).json({
      success: true,
      message: "Images retrieved successfully",
      data: {
        images,
        color,
        count: images.length,
      },
    });
  } catch (error) {
    console.error("Get images by color error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve images by color",
    });
  }
};

// Get images by style
const getImagesByStyle = async (req, res) => {
  try {
    const userId = req.user._id;
    const { styleTag } = req.params;

    const images = await Image.getImagesByStyle(userId, styleTag);

    res.status(200).json({
      success: true,
      message: "Images retrieved successfully",
      data: {
        images,
        styleTag,
        count: images.length,
      },
    });
  } catch (error) {
    console.error("Get images by style error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve images by style",
    });
  }
};

// Simulate image processing (replace with actual processing in production)
async function simulateImageProcessing(image) {
  try {
    // Simulate color extraction
    await image.addProcessingStep("color_extraction", "processing");

    // Simulate extracting colors
    const colors = [
      {
        color: "Blue",
        hex: "#3498db",
        rgb: { r: 52, g: 152, b: 219 },
        percentage: 35,
        isDominant: true,
      },
      {
        color: "White",
        hex: "#ffffff",
        rgb: { r: 255, g: 255, b: 255 },
        percentage: 25,
        isDominant: false,
      },
      {
        color: "Gray",
        hex: "#95a5a6",
        rgb: { r: 149, g: 165, b: 166 },
        percentage: 20,
        isDominant: false,
      },
      {
        color: "Black",
        hex: "#2c3e50",
        rgb: { r: 44, g: 62, b: 80 },
        percentage: 20,
        isDominant: false,
      },
    ];

    for (const color of colors) {
      await image.addColor(
        color.color,
        color.hex,
        color.rgb,
        color.percentage,
        color.isDominant
      );
    }

    await image.updateProcessingStep("color_extraction", "completed", {
      colorsExtracted: colors.length,
    });

    // Simulate object detection
    await image.addProcessingStep("object_detection", "processing");

    // Simulate detecting objects
    const objects = [
      {
        name: "shirt",
        confidence: 0.95,
        boundingBox: { x: 100, y: 50, width: 200, height: 300 },
      },
      {
        name: "person",
        confidence: 0.88,
        boundingBox: { x: 80, y: 30, width: 240, height: 400 },
      },
    ];

    for (const obj of objects) {
      await image.addObject(obj.name, obj.confidence, obj.boundingBox);
    }

    await image.updateProcessingStep("object_detection", "completed", {
      objectsDetected: objects.length,
    });

    // Simulate style analysis
    await image.addProcessingStep("style_analysis", "processing");

    // Simulate style analysis
    const styleTags = ["casual", "comfortable", "modern"];
    for (const tag of styleTags) {
      await image.addStyleTag(tag);
    }

    image.analysis.style = {
      dominantColors: ["Blue"],
      styleTags,
      mood: "relaxed",
      brightness: 0.7,
      contrast: 0.6,
      saturation: 0.5,
    };

    image.analysis.metadata = {
      hasFaces: true,
      faceCount: 1,
      backgroundType: "neutral",
      imageQuality: 0.85,
    };

    await image.updateProcessingStep("style_analysis", "completed", {
      styleTags,
    });

    // Mark processing as completed
    image.processing.status = "completed";
    image.processing.completedAt = new Date();
    image.metadata.processingTime =
      Date.now() - image.processing.startedAt.getTime();

    await image.save();
  } catch (error) {
    console.error("Error in image processing simulation:", error);

    // Mark processing as failed
    image.processing.status = "failed";
    await image.save();
  }
}

// Middleware for file upload
const uploadMiddleware = upload.single("image");

module.exports = {
  uploadImage,
  getImages,
  getImage,
  deleteImage,
  processImage,
  getImageStats,
  getImagesByColor,
  getImagesByStyle,
  uploadMiddleware,
};
