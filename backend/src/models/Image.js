const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    originalName: {
      type: String,
      required: [true, "Original filename is required"],
      trim: true,
    },
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    path: {
      type: String,
      required: [true, "File path is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
      enum: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
      min: [0, "File size cannot be negative"],
    },
    dimensions: {
      width: {
        type: Number,
        required: [true, "Image width is required"],
        min: [1, "Width must be at least 1 pixel"],
      },
      height: {
        type: Number,
        required: [true, "Image height is required"],
        min: [1, "Height must be at least 1 pixel"],
      },
    },
    processing: {
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },
      steps: [
        {
          name: {
            type: String,
            enum: [
              "upload",
              "resize",
              "optimize",
              "thumbnail",
              "color_extraction",
              "object_detection",
              "style_analysis",
            ],
          },
          status: {
            type: String,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending",
          },
          startedAt: Date,
          completedAt: Date,
          error: String,
          metadata: mongoose.Schema.Types.Mixed,
        },
      ],
      startedAt: Date,
      completedAt: Date,
    },
    analysis: {
      colors: [
        {
          color: String,
          hex: String,
          rgb: {
            r: Number,
            g: Number,
            b: Number,
          },
          percentage: Number,
          isDominant: Boolean,
        },
      ],
      objects: [
        {
          name: String,
          confidence: Number,
          boundingBox: {
            x: Number,
            y: Number,
            width: Number,
            height: Number,
          },
        },
      ],
      style: {
        dominantColors: [String],
        styleTags: [String],
        mood: String,
        brightness: Number,
        contrast: Number,
        saturation: Number,
      },
      metadata: {
        hasFaces: Boolean,
        faceCount: Number,
        backgroundType: String,
        imageQuality: Number,
      },
    },
    thumbnails: [
      {
        size: {
          type: String,
          enum: ["small", "medium", "large"],
        },
        width: Number,
        height: Number,
        url: String,
        path: String,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      uploadSource: {
        type: String,
        enum: ["web", "mobile", "api", "import"],
        default: "web",
      },
      userAgent: String,
      ipAddress: String,
      processingTime: Number,
      originalFormat: String,
      compressionRatio: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
imageSchema.index({ user: 1, createdAt: -1 });
imageSchema.index({ user: 1, "processing.status": 1 });
imageSchema.index({ user: 1, isActive: 1 });
imageSchema.index({ user: 1, isPublic: 1 });
imageSchema.index({ "analysis.colors.color": 1 });
imageSchema.index({ "analysis.style.styleTags": 1 });
imageSchema.index({ mimeType: 1 });

// Instance methods
imageSchema.methods.getDominantColor = function () {
  const dominantColor = this.analysis.colors.find((color) => color.isDominant);
  return dominantColor ? dominantColor.color : null;
};

imageSchema.methods.getColorPalette = function () {
  return this.analysis.colors.map((color) => ({
    color: color.color,
    hex: color.hex,
    percentage: color.percentage,
  }));
};

imageSchema.methods.getStyleTags = function () {
  return this.analysis.style.styleTags || [];
};

imageSchema.methods.getThumbnail = function (size = "medium") {
  const thumbnail = this.thumbnails.find((thumb) => thumb.size === size);
  return thumbnail ? thumbnail.url : this.url;
};

imageSchema.methods.addProcessingStep = function (
  name,
  status = "pending",
  metadata = {}
) {
  this.processing.steps.push({
    name,
    status,
    startedAt: new Date(),
    metadata,
  });
  return this.save();
};

imageSchema.methods.updateProcessingStep = function (
  name,
  status,
  metadata = {}
) {
  const step = this.processing.steps.find((step) => step.name === name);
  if (step) {
    step.status = status;
    step.completedAt = new Date();
    step.metadata = { ...step.metadata, ...metadata };
  }
  return this.save();
};

imageSchema.methods.addColor = function (
  color,
  hex,
  rgb,
  percentage,
  isDominant = false
) {
  this.analysis.colors.push({
    color,
    hex,
    rgb,
    percentage,
    isDominant,
  });
  return this.save();
};

imageSchema.methods.addObject = function (name, confidence, boundingBox) {
  this.analysis.objects.push({
    name,
    confidence,
    boundingBox,
  });
  return this.save();
};

imageSchema.methods.addStyleTag = function (tag) {
  if (!this.analysis.style.styleTags.includes(tag.toLowerCase())) {
    this.analysis.style.styleTags.push(tag.toLowerCase());
  }
  return this.save();
};

imageSchema.methods.addThumbnail = function (size, width, height, url, path) {
  this.thumbnails.push({
    size,
    width,
    height,
    url,
    path,
  });
  return this.save();
};

// Static methods
imageSchema.statics.getUserImages = function (
  userId,
  filters = {},
  options = {}
) {
  const query = { user: userId, isActive: true };
  const { limit = 20, skip = 0 } = options;

  // Apply filters
  if (filters.mimeType) query.mimeType = filters.mimeType;
  if (filters.isPublic !== undefined) query.isPublic = filters.isPublic;
  if (filters.processingStatus)
    query["processing.status"] = filters.processingStatus;
  if (filters.hasAnalysis !== undefined) {
    if (filters.hasAnalysis) {
      query["analysis.colors.0"] = { $exists: true };
    } else {
      query["analysis.colors.0"] = { $exists: false };
    }
  }

  return this.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

imageSchema.statics.getImagesByColor = function (userId, color) {
  return this.find({
    user: userId,
    isActive: true,
    "analysis.colors.color": color,
  }).sort({ createdAt: -1 });
};

imageSchema.statics.getImagesByStyle = function (userId, styleTag) {
  return this.find({
    user: userId,
    isActive: true,
    "analysis.style.styleTags": styleTag,
  }).sort({ createdAt: -1 });
};

imageSchema.statics.getImageStats = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: null,
        totalImages: { $sum: 1 },
        totalSize: { $sum: "$size" },
        averageSize: { $avg: "$size" },
        processingCompleted: {
          $sum: {
            $cond: [{ $eq: ["$processing.status", "completed"] }, 1, 0],
          },
        },
        processingFailed: {
          $sum: {
            $cond: [{ $eq: ["$processing.status", "failed"] }, 1, 0],
          },
        },
        mimeTypes: { $addToSet: "$mimeType" },
        dominantColors: { $addToSet: "$analysis.colors.color" },
        styleTags: { $addToSet: "$analysis.style.styleTags" },
      },
    },
  ]);
};

imageSchema.statics.getColorDistribution = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    { $unwind: "$analysis.colors" },
    {
      $group: {
        _id: "$analysis.colors.color",
        count: { $sum: 1 },
        averagePercentage: { $avg: "$analysis.colors.percentage" },
        totalImages: { $addToSet: "$_id" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

imageSchema.statics.getStyleDistribution = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    { $unwind: "$analysis.style.styleTags" },
    {
      $group: {
        _id: "$analysis.style.styleTags",
        count: { $sum: 1 },
        images: { $addToSet: "$_id" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

imageSchema.statics.getProcessingStats = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: "$processing.status",
        count: { $sum: 1 },
        averageProcessingTime: { $avg: "$metadata.processingTime" },
      },
    },
  ]);
};

// Pre-save middleware
imageSchema.pre("save", function (next) {
  // Update processing status based on steps
  if (this.processing.steps.length > 0) {
    const allCompleted = this.processing.steps.every(
      (step) => step.status === "completed"
    );
    const anyFailed = this.processing.steps.some(
      (step) => step.status === "failed"
    );

    if (anyFailed) {
      this.processing.status = "failed";
    } else if (allCompleted) {
      this.processing.status = "completed";
    } else {
      this.processing.status = "processing";
    }
  }

  // Calculate compression ratio if original size is available
  if (this.size && this.metadata.originalFormat) {
    // This would need the original file size to calculate properly
    // For now, we'll set a default value
    this.metadata.compressionRatio = 0.8; // 80% compression
  }

  next();
});

// Virtual for image aspect ratio
imageSchema.virtual("aspectRatio").get(function () {
  return this.dimensions.width / this.dimensions.height;
});

// Virtual for image size in MB
imageSchema.virtual("sizeInMB").get(function () {
  return Math.round((this.size / (1024 * 1024)) * 100) / 100;
});

// Virtual for checking if image is processed
imageSchema.virtual("isProcessed").get(function () {
  return this.processing.status === "completed";
});

// Virtual for getting primary color
imageSchema.virtual("primaryColor").get(function () {
  return this.getDominantColor();
});

module.exports = mongoose.model("Image", imageSchema);
