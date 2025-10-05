const mongoose = require("mongoose");

const analyticsEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    event: {
      type: {
        type: String,
        required: [true, "Event type is required"],
        enum: [
          "user_registration",
          "user_login",
          "user_logout",
          "wardrobe_item_added",
          "wardrobe_item_updated",
          "wardrobe_item_deleted",
          "wardrobe_item_viewed",
          "outfit_created",
          "outfit_updated",
          "outfit_deleted",
          "outfit_viewed",
          "outfit_worn",
          "outfit_favorited",
          "calendar_event_created",
          "calendar_event_updated",
          "calendar_event_deleted",
          "calendar_event_viewed",
          "weather_viewed",
          "weather_location_set",
          "ai_recommendation_generated",
          "ai_recommendation_viewed",
          "ai_recommendation_feedback",
          "image_uploaded",
          "image_processed",
          "image_viewed",
          "search_performed",
          "filter_applied",
          "export_performed",
          "import_performed",
          "settings_updated",
          "profile_updated",
          "password_changed",
          "preferences_updated",
        ],
      },
      category: {
        type: String,
        required: [true, "Event category is required"],
        enum: [
          "authentication",
          "wardrobe",
          "outfit",
          "calendar",
          "weather",
          "ai",
          "image",
          "search",
          "settings",
          "profile",
          "system",
        ],
      },
      action: {
        type: String,
        required: [true, "Event action is required"],
        enum: [
          "create",
          "read",
          "update",
          "delete",
          "view",
          "search",
          "filter",
          "export",
          "import",
          "upload",
          "process",
          "generate",
          "feedback",
          "favorite",
          "wear",
          "schedule",
          "recommend",
          "analyze",
        ],
      },
    },
    data: {
      itemId: mongoose.Schema.Types.ObjectId,
      itemType: {
        type: String,
        enum: [
          "wardrobe_item",
          "outfit",
          "calendar_event",
          "image",
          "recommendation",
        ],
      },
      itemCategory: String,
      itemBrand: String,
      itemColor: String,
      itemSeason: String,
      occasion: String,
      weather: {
        temperature: Number,
        conditions: String,
      },
      location: {
        name: String,
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
      searchQuery: String,
      filterCriteria: mongoose.Schema.Types.Mixed,
      recommendationType: String,
      recommendationConfidence: Number,
      feedback: {
        rating: Number,
        liked: Boolean,
        used: Boolean,
      },
      imageProcessing: {
        steps: [String],
        processingTime: Number,
        colorsExtracted: Number,
        objectsDetected: Number,
      },
      metadata: mongoose.Schema.Types.Mixed,
    },
    session: {
      sessionId: String,
      userAgent: String,
      ipAddress: String,
      referrer: String,
      device: {
        type: String,
        enum: ["desktop", "mobile", "tablet"],
      },
      browser: String,
      os: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number, // milliseconds
    },
    success: {
      type: Boolean,
      default: true,
    },
    error: {
      code: String,
      message: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
analyticsEventSchema.index({ user: 1, timestamp: -1 });
analyticsEventSchema.index({ user: 1, "event.type": 1, timestamp: -1 });
analyticsEventSchema.index({ user: 1, "event.category": 1, timestamp: -1 });
analyticsEventSchema.index({ user: 1, "event.action": 1, timestamp: -1 });
analyticsEventSchema.index({ timestamp: -1 });
analyticsEventSchema.index({ "session.sessionId": 1 });
analyticsEventSchema.index({ "data.itemId": 1, "data.itemType": 1 });

// Static methods
analyticsEventSchema.statics.getUserEvents = function (
  userId,
  filters = {},
  options = {}
) {
  const query = { user: userId };
  const { startDate, endDate, limit = 100, skip = 0 } = options;

  // Apply filters
  if (filters.eventType) query["event.type"] = filters.eventType;
  if (filters.eventCategory) query["event.category"] = filters.eventCategory;
  if (filters.eventAction) query["event.action"] = filters.eventAction;
  if (filters.success !== undefined) query.success = filters.success;
  if (filters.itemType) query["data.itemType"] = filters.itemType;
  if (filters.itemCategory) query["data.itemCategory"] = filters.itemCategory;

  // Date filtering
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  return this.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit);
};

analyticsEventSchema.statics.getUserStats = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        totalEvents: { $sum: 1 },
        successfulEvents: {
          $sum: { $cond: ["$success", 1, 0] },
        },
        failedEvents: {
          $sum: { $cond: ["$success", 0, 1] },
        },
        averageDuration: { $avg: "$duration" },
        totalDuration: { $sum: "$duration" },
        eventTypes: { $addToSet: "$event.type" },
        eventCategories: { $addToSet: "$event.category" },
        eventActions: { $addToSet: "$event.action" },
        devices: { $addToSet: "$session.device" },
        browsers: { $addToSet: "$session.browser" },
      },
    },
  ]);
};

analyticsEventSchema.statics.getEventTypeStats = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$event.type",
        count: { $sum: 1 },
        successRate: {
          $avg: { $cond: ["$success", 1, 0] },
        },
        averageDuration: { $avg: "$duration" },
        lastOccurrence: { $max: "$timestamp" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

analyticsEventSchema.statics.getCategoryStats = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$event.category",
        count: { $sum: 1 },
        successRate: {
          $avg: { $cond: ["$success", 1, 0] },
        },
        averageDuration: { $avg: "$duration" },
        eventTypes: { $addToSet: "$event.type" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

analyticsEventSchema.statics.getDailyActivity = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
        },
        eventCount: { $sum: 1 },
        successfulEvents: {
          $sum: { $cond: ["$success", 1, 0] },
        },
        averageDuration: { $avg: "$duration" },
        categories: { $addToSet: "$event.category" },
        actions: { $addToSet: "$event.action" },
      },
    },
    { $sort: { _id: -1 } },
  ]);
};

analyticsEventSchema.statics.getHourlyActivity = function (userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $hour: "$timestamp" },
        eventCount: { $sum: 1 },
        averageDuration: { $avg: "$duration" },
        categories: { $addToSet: "$event.category" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

analyticsEventSchema.statics.getItemStats = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
        "data.itemId": { $exists: true },
      },
    },
    {
      $group: {
        _id: {
          itemId: "$data.itemId",
          itemType: "$data.itemType",
          itemCategory: "$data.itemCategory",
        },
        viewCount: {
          $sum: { $cond: [{ $eq: ["$event.action", "view"] }, 1, 0] },
        },
        actionCount: { $sum: 1 },
        lastViewed: {
          $max: {
            $cond: [{ $eq: ["$event.action", "view"] }, "$timestamp", null],
          },
        },
        actions: { $addToSet: "$event.action" },
      },
    },
    { $sort: { viewCount: -1 } },
  ]);
};

analyticsEventSchema.statics.getSearchStats = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
        "event.type": "search_performed",
        "data.searchQuery": { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$data.searchQuery",
        count: { $sum: 1 },
        lastSearched: { $max: "$timestamp" },
        filters: { $addToSet: "$data.filterCriteria" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

analyticsEventSchema.statics.getRecommendationStats = function (
  userId,
  days = 30
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
        "event.category": "ai",
      },
    },
    {
      $group: {
        _id: "$data.recommendationType",
        generated: {
          $sum: {
            $cond: [
              { $eq: ["$event.type", "ai_recommendation_generated"] },
              1,
              0,
            ],
          },
        },
        viewed: {
          $sum: {
            $cond: [{ $eq: ["$event.type", "ai_recommendation_viewed"] }, 1, 0],
          },
        },
        feedback: {
          $sum: {
            $cond: [
              { $eq: ["$event.type", "ai_recommendation_feedback"] },
              1,
              0,
            ],
          },
        },
        averageConfidence: { $avg: "$data.recommendationConfidence" },
        averageRating: { $avg: "$data.feedback.rating" },
        likeRate: {
          $avg: { $cond: ["$data.feedback.liked", 1, 0] },
        },
        usageRate: {
          $avg: { $cond: ["$data.feedback.used", 1, 0] },
        },
      },
    },
    { $sort: { generated: -1 } },
  ]);
};

analyticsEventSchema.statics.getWardrobeInsights = function (
  userId,
  days = 30
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate },
        "event.category": { $in: ["wardrobe", "outfit"] },
      },
    },
    {
      $group: {
        _id: null,
        wardrobeItemsAdded: {
          $sum: {
            $cond: [{ $eq: ["$event.type", "wardrobe_item_added"] }, 1, 0],
          },
        },
        outfitsCreated: {
          $sum: { $cond: [{ $eq: ["$event.type", "outfit_created"] }, 1, 0] },
        },
        outfitsWorn: {
          $sum: { $cond: [{ $eq: ["$event.type", "outfit_worn"] }, 1, 0] },
        },
        outfitsFavorited: {
          $sum: { $cond: [{ $eq: ["$event.type", "outfit_favorited"] }, 1, 0] },
        },
        mostViewedCategory: { $addToSet: "$data.itemCategory" },
        mostUsedColor: { $addToSet: "$data.itemColor" },
        mostWornSeason: { $addToSet: "$data.itemSeason" },
        favoriteOccasion: { $addToSet: "$data.occasion" },
      },
    },
  ]);
};

// Pre-save middleware
analyticsEventSchema.pre("save", function (next) {
  // Set timestamp if not provided
  if (!this.timestamp) {
    this.timestamp = new Date();
  }

  // Calculate duration if not provided
  if (!this.duration && this.createdAt) {
    this.duration = Date.now() - this.createdAt.getTime();
  }

  next();
});

// Virtual for event age in days
analyticsEventSchema.virtual("ageInDays").get(function () {
  return Math.floor(
    (Date.now() - this.timestamp.getTime()) / (1000 * 60 * 60 * 24)
  );
});

// Virtual for event age in hours
analyticsEventSchema.virtual("ageInHours").get(function () {
  return Math.floor((Date.now() - this.timestamp.getTime()) / (1000 * 60 * 60));
});

module.exports = mongoose.model("AnalyticsEvent", analyticsEventSchema);
