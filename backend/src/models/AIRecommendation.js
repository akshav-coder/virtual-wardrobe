const mongoose = require("mongoose");

const recommendationItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WardrobeItem",
    required: [true, "Wardrobe item reference is required"],
  },
  category: {
    type: String,
    required: [true, "Item category is required"],
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5,
  },
  reason: {
    type: String,
    trim: true,
    maxlength: [200, "Reason cannot exceed 200 characters"],
  },
  position: {
    type: String,
    enum: ["primary", "secondary", "accent"],
    default: "primary",
  },
});

const aiRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    type: {
      type: String,
      required: [true, "Recommendation type is required"],
      enum: [
        "daily_outfit",
        "occasion_outfit",
        "weather_outfit",
        "color_coordination",
        "style_suggestion",
        "missing_item",
        "trend_suggestion",
        "personalized",
      ],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    items: [recommendationItemSchema],
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: [true, "Confidence score is required"],
    },
    reasoning: {
      type: String,
      trim: true,
      maxlength: [300, "Reasoning cannot exceed 300 characters"],
    },
    context: {
      occasion: {
        type: String,
        enum: [
          "casual",
          "formal",
          "business",
          "party",
          "wedding",
          "date",
          "gym",
          "travel",
          "everyday",
        ],
      },
      weather: {
        temperature: Number,
        conditions: String,
      },
      season: {
        type: String,
        enum: ["spring", "summer", "fall", "winter", "all-season"],
      },
      timeOfDay: {
        type: String,
        enum: ["morning", "afternoon", "evening", "night", "day"],
      },
      location: String,
    },
    styleTags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    colorScheme: {
      primary: String,
      secondary: String,
      accent: String,
      neutral: String,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      liked: Boolean,
      used: Boolean,
      comments: {
        type: String,
        trim: true,
        maxlength: [200, "Comments cannot exceed 200 characters"],
      },
      feedbackDate: Date,
    },
    metadata: {
      algorithm: {
        type: String,
        enum: [
          "color_matching",
          "style_analysis",
          "weather_based",
          "occasion_based",
          "hybrid",
          "basic",
          "fallback",
        ],
      },
      version: {
        type: String,
        default: "1.0",
      },
      processingTime: Number, // milliseconds
      dataPoints: Number,
      userPreferences: {
        favoriteColors: [String],
        preferredStyles: [String],
        avoidColors: [String],
        sizePreferences: [String],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
aiRecommendationSchema.index({ user: 1, type: 1 });
aiRecommendationSchema.index({ user: 1, confidence: -1 });
aiRecommendationSchema.index({ user: 1, createdAt: -1 });
aiRecommendationSchema.index({ user: 1, isActive: 1 });
aiRecommendationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Instance methods
aiRecommendationSchema.methods.addFeedback = function (
  rating,
  liked,
  used,
  comments
) {
  this.feedback = {
    rating,
    liked,
    used,
    comments,
    feedbackDate: new Date(),
  };
  return this.save();
};

aiRecommendationSchema.methods.updateConfidence = function (newConfidence) {
  this.confidence = Math.max(0, Math.min(1, newConfidence));
  return this.save();
};

aiRecommendationSchema.methods.addStyleTag = function (tag) {
  if (!this.styleTags.includes(tag.toLowerCase())) {
    this.styleTags.push(tag.toLowerCase());
  }
  return this.save();
};

// Static methods
aiRecommendationSchema.statics.getUserRecommendations = function (
  userId,
  filters = {}
) {
  const query = {
    user: userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  };

  // Apply filters
  if (filters.type) query.type = filters.type;
  if (filters.minConfidence) query.confidence = { $gte: filters.minConfidence };
  if (filters.occasion) query["context.occasion"] = filters.occasion;
  if (filters.season) query["context.season"] = filters.season;
  if (filters.weatherCondition)
    query["context.weather.conditions"] = filters.weatherCondition;
  if (filters.minTemperature !== undefined) {
    query["context.weather.temperature"] = { $gte: filters.minTemperature };
  }
  if (filters.maxTemperature !== undefined) {
    query["context.weather.temperature"] = {
      ...query["context.weather.temperature"],
      $lte: filters.maxTemperature,
    };
  }

  return this.find(query)
    .populate("items.item")
    .sort({ confidence: -1, createdAt: -1 });
};

aiRecommendationSchema.statics.getRecommendationStats = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: null,
        totalRecommendations: { $sum: 1 },
        averageConfidence: { $avg: "$confidence" },
        averageRating: { $avg: "$feedback.rating" },
        totalUsed: { $sum: { $cond: ["$feedback.used", 1, 0] } },
        totalLiked: { $sum: { $cond: ["$feedback.liked", 1, 0] } },
        types: { $addToSet: "$type" },
        algorithms: { $addToSet: "$metadata.algorithm" },
      },
    },
  ]);
};

aiRecommendationSchema.statics.getUserPreferences = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: null,
        favoriteColors: {
          $addToSet: {
            $concatArrays: ["$colorScheme.primary", "$colorScheme.secondary"],
          },
        },
        preferredStyles: { $addToSet: "$styleTags" },
        favoriteOccasions: { $addToSet: "$context.occasion" },
        averageConfidence: { $avg: "$confidence" },
      },
    },
  ]);
};

aiRecommendationSchema.statics.getFeedbackAnalysis = function (
  userId,
  days = 30
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isActive: true,
        "feedback.feedbackDate": { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        averageRating: { $avg: "$feedback.rating" },
        usageRate: { $avg: { $cond: ["$feedback.used", 1, 0] } },
        likeRate: { $avg: { $cond: ["$feedback.liked", 1, 0] } },
        averageConfidence: { $avg: "$confidence" },
      },
    },
    { $sort: { usageRate: -1 } },
  ]);
};

aiRecommendationSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
};

// Pre-save middleware
aiRecommendationSchema.pre("save", function (next) {
  // Ensure confidence is within bounds
  this.confidence = Math.max(0, Math.min(1, this.confidence));

  // Update metadata
  if (this.isModified("items") && this.items.length > 0) {
    this.metadata.dataPoints = this.items.length;
  }

  // Set default expiration if not set
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  next();
});

// Color coordination helper
aiRecommendationSchema.statics.getColorCompatibility = function (
  color1,
  color2
) {
  const colorWheel = {
    red: 0,
    orange: 30,
    yellow: 60,
    green: 120,
    blue: 240,
    purple: 300,
    pink: 330,
  };

  const getHue = (color) => {
    const normalizedColor = color.toLowerCase().replace(/\s+/g, "");
    return colorWheel[normalizedColor] || 0;
  };

  const hue1 = getHue(color1);
  const hue2 = getHue(color2);

  const difference = Math.abs(hue1 - hue2);
  const normalizedDiff = Math.min(difference, 360 - difference);

  // Complementary colors (180° apart)
  if (normalizedDiff >= 150 && normalizedDiff <= 210) {
    return { compatibility: "complementary", score: 0.9 };
  }

  // Analogous colors (30° apart)
  if (normalizedDiff <= 30) {
    return { compatibility: "analogous", score: 0.8 };
  }

  // Triadic colors (120° apart)
  if (normalizedDiff >= 100 && normalizedDiff <= 140) {
    return { compatibility: "triadic", score: 0.7 };
  }

  // Neutral colors
  const neutrals = ["black", "white", "gray", "beige", "brown"];
  if (
    neutrals.includes(color1.toLowerCase()) ||
    neutrals.includes(color2.toLowerCase())
  ) {
    return { compatibility: "neutral", score: 0.8 };
  }

  // Default
  return { compatibility: "unknown", score: 0.5 };
};

// Style analysis helper
aiRecommendationSchema.statics.analyzeStyle = function (items) {
  const styleProfile = {
    casual: 0,
    formal: 0,
    trendy: 0,
    classic: 0,
    bohemian: 0,
    minimalist: 0,
  };

  const colorProfile = {};
  const categoryProfile = {};

  items.forEach((item) => {
    // Analyze categories
    if (item.category) {
      categoryProfile[item.category] =
        (categoryProfile[item.category] || 0) + 1;
    }

    // Analyze colors
    if (item.color) {
      colorProfile[item.color] = (colorProfile[item.color] || 0) + 1;
    }

    // Analyze style tags
    if (item.tags) {
      item.tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase();
        if (styleProfile.hasOwnProperty(normalizedTag)) {
          styleProfile[normalizedTag]++;
        }
      });
    }
  });

  return {
    styleProfile,
    colorProfile,
    categoryProfile,
    dominantStyle: Object.keys(styleProfile).reduce((a, b) =>
      styleProfile[a] > styleProfile[b] ? a : b
    ),
    dominantColor: Object.keys(colorProfile).reduce((a, b) =>
      colorProfile[a] > colorProfile[b] ? a : b
    ),
  };
};

module.exports = mongoose.model("AIRecommendation", aiRecommendationSchema);
