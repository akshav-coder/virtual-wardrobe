const mongoose = require("mongoose");

const outfitItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WardrobeItem",
    required: [true, "Wardrobe item reference is required"],
  },
  category: {
    type: String,
    required: [true, "Item category is required"],
    enum: [
      "top",
      "bottom",
      "dress",
      "shoes",
      "accessory",
      "outerwear",
      "underwear",
      "swimwear",
      "sportswear",
      "formal",
      "casual",
    ],
  },
  position: {
    type: String,
    enum: ["primary", "secondary", "accent"],
    default: "primary",
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, "Notes cannot exceed 200 characters"],
  },
});

const outfitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Outfit name is required"],
      trim: true,
      minlength: [1, "Outfit name must be at least 1 character"],
      maxlength: [100, "Outfit name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    items: [outfitItemSchema],
    category: {
      type: String,
      required: [true, "Outfit category is required"],
      enum: [
        "casual",
        "formal",
        "business",
        "party",
        "wedding",
        "funeral",
        "vacation",
        "gym",
        "date",
        "everyday",
        "seasonal",
      ],
    },
    season: {
      type: String,
      enum: ["spring", "summer", "fall", "winter", "all-season"],
      default: "all-season",
    },
    weather: {
      temperature: {
        min: Number,
        max: Number,
      },
      conditions: [
        {
          type: String,
          enum: ["sunny", "cloudy", "rainy", "snowy", "windy", "humid"],
        },
      ],
    },
    colors: [
      {
        type: String,
        enum: [
          "White",
          "Black",
          "Blue",
          "Gray",
          "Brown",
          "Red",
          "Green",
          "Yellow",
          "Purple",
          "Pink",
          "Orange",
          "Navy",
          "Beige",
          "Multi",
          "Other",
        ],
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
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    wearCount: {
      type: Number,
      default: 0,
      min: [0, "Wear count cannot be negative"],
    },
    lastWorn: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    scheduledDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, "Notes cannot exceed 300 characters"],
    },
    images: [
      {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: "Image must be a valid URL",
        },
      },
    ],
    metadata: {
      totalCost: Number,
      colorScheme: String,
      styleTags: [String],
      occasionTags: [String],
      seasonTags: [String],
      weatherTags: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
outfitSchema.index({ user: 1, category: 1 });
outfitSchema.index({ user: 1, isFavorite: 1 });
outfitSchema.index({ user: 1, isTemplate: 1 });
outfitSchema.index({ user: 1, scheduledDate: 1 });
outfitSchema.index({ user: 1, createdAt: -1 });
outfitSchema.index({ user: 1, lastWorn: -1 });
outfitSchema.index({
  user: 1,
  name: "text",
  description: "text",
  tags: "text",
});

// Instance methods
outfitSchema.methods.incrementWearCount = function () {
  this.wearCount += 1;
  this.lastWorn = new Date();
  return this.save();
};

outfitSchema.methods.toggleFavorite = function () {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

outfitSchema.methods.addTag = function (tag) {
  if (!this.tags.includes(tag.toLowerCase())) {
    this.tags.push(tag.toLowerCase());
  }
  return this.save();
};

outfitSchema.methods.removeTag = function (tag) {
  this.tags = this.tags.filter((t) => t !== tag.toLowerCase());
  return this.save();
};

outfitSchema.methods.addItem = function (
  itemId,
  category,
  position = "primary",
  notes = ""
) {
  const newItem = {
    item: itemId,
    category,
    position,
    notes,
  };
  this.items.push(newItem);
  return this.save();
};

outfitSchema.methods.removeItem = function (itemId) {
  this.items = this.items.filter(
    (item) => item.item.toString() !== itemId.toString()
  );
  return this.save();
};

outfitSchema.methods.updateItem = function (itemId, updates) {
  const item = this.items.find(
    (item) => item.item.toString() === itemId.toString()
  );
  if (item) {
    Object.assign(item, updates);
    return this.save();
  }
  return Promise.reject(new Error("Item not found in outfit"));
};

// Static methods
outfitSchema.statics.getUserOutfits = function (userId, filters = {}) {
  const query = { user: userId, isActive: true };

  // Apply filters
  if (filters.category) query.category = filters.category;
  if (filters.season) query.season = filters.season;
  if (filters.isFavorite !== undefined) query.isFavorite = filters.isFavorite;
  if (filters.isTemplate !== undefined) query.isTemplate = filters.isTemplate;
  if (filters.scheduledDate) {
    const date = new Date(filters.scheduledDate);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    query.scheduledDate = { $gte: startOfDay, $lte: endOfDay };
  }
  if (filters.minTemperature !== undefined) {
    query["weather.temperature.min"] = { $gte: filters.minTemperature };
  }
  if (filters.maxTemperature !== undefined) {
    query["weather.temperature.max"] = { $lte: filters.maxTemperature };
  }
  if (filters.weatherCondition) {
    query["weather.conditions"] = filters.weatherCondition;
  }

  return this.find(query).populate("items.item").sort({ createdAt: -1 });
};

outfitSchema.statics.searchUserOutfits = function (userId, searchTerm) {
  if (!searchTerm) return this.getUserOutfits(userId);

  return this.find({
    user: userId,
    isActive: true,
    $text: { $search: searchTerm },
  })
    .populate("items.item")
    .sort({ score: { $meta: "textScore" } });
};

outfitSchema.statics.getUserStats = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: null,
        totalOutfits: { $sum: 1 },
        favoriteOutfits: { $sum: { $cond: ["$isFavorite", 1, 0] } },
        templateOutfits: { $sum: { $cond: ["$isTemplate", 1, 0] } },
        totalWearCount: { $sum: "$wearCount" },
        averageWearCount: { $avg: "$wearCount" },
        categories: { $addToSet: "$category" },
        seasons: { $addToSet: "$season" },
        colors: { $addToSet: "$colors" },
      },
    },
  ]);
};

outfitSchema.statics.getCategoryStats = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        favoriteCount: { $sum: { $cond: ["$isFavorite", 1, 0] } },
        totalWearCount: { $sum: "$wearCount" },
        averageWearCount: { $avg: "$wearCount" },
        averageRating: { $avg: "$rating" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

outfitSchema.statics.getScheduledOutfits = function (
  userId,
  startDate,
  endDate
) {
  return this.find({
    user: userId,
    isActive: true,
    scheduledDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  })
    .populate("items.item")
    .sort({ scheduledDate: 1 });
};

outfitSchema.statics.getWeatherBasedOutfits = function (
  userId,
  temperature,
  conditions = []
) {
  const query = {
    user: userId,
    isActive: true,
    $or: [
      {
        "weather.temperature.min": { $lte: temperature },
        "weather.temperature.max": { $gte: temperature },
      },
      {
        "weather.temperature.min": { $exists: false },
        "weather.temperature.max": { $exists: false },
      },
    ],
  };

  if (conditions.length > 0) {
    query["weather.conditions"] = { $in: conditions };
  }

  return this.find(query).populate("items.item").sort({ wearCount: -1 });
};

// Pre-save middleware to update metadata
outfitSchema.pre("save", async function (next) {
  if (this.isModified("items") && this.items.length > 0) {
    try {
      // Populate items to calculate total cost and colors
      await this.populate("items.item");

      // Calculate total cost
      this.metadata.totalCost = this.items.reduce((total, outfitItem) => {
        return total + (outfitItem.item?.price || 0);
      }, 0);

      // Extract colors
      this.colors = [
        ...new Set(this.items.map((item) => item.item?.color).filter(Boolean)),
      ];

      // Update timestamp
      this.updatedAt = new Date();
    } catch (error) {
      console.error("Error in pre-save middleware:", error);
    }
  }
  next();
});

module.exports = mongoose.model("Outfit", outfitSchema);
