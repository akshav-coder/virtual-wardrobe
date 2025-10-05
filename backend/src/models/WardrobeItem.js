const mongoose = require("mongoose");

const wardrobeItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: [1, "Item name must be at least 1 character"],
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
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
    subcategory: {
      type: String,
      trim: true,
      maxlength: [50, "Subcategory cannot exceed 50 characters"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
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
    size: {
      type: String,
      required: [true, "Size is required"],
      trim: true,
      maxlength: [20, "Size cannot exceed 20 characters"],
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      max: [100000, "Price cannot exceed 100,000"],
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "CAD", "AUD"],
    },
    image: {
      type: String,
      trim: true,
      // Validate URL format if provided
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow empty
          return /^https?:\/\/.+/.test(v);
        },
        message: "Image must be a valid URL",
      },
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
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, "Notes cannot exceed 200 characters"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair", "poor"],
      default: "good",
    },
    season: {
      type: String,
      enum: ["spring", "summer", "fall", "winter", "all-season"],
      default: "all-season",
    },
    occasions: [
      {
        type: String,
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
        ],
      },
    ],
    isNew: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    wearCount: {
      type: Number,
      default: 0,
      min: [0, "Wear count cannot be negative"],
    },
    lastWorn: {
      type: Date,
    },
    purchaseDate: {
      type: Date,
    },
    purchaseLocation: {
      type: String,
      trim: true,
      maxlength: [100, "Purchase location cannot exceed 100 characters"],
    },
    careInstructions: {
      type: String,
      trim: true,
      maxlength: [300, "Care instructions cannot exceed 300 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      colorExtracted: {
        type: String,
        trim: true,
      },
      dominantColors: [String],
      imageHash: {
        type: String,
        trim: true,
      },
      fileSize: Number,
      dimensions: {
        width: Number,
        height: Number,
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for better performance
wardrobeItemSchema.index({ user: 1, category: 1 });
wardrobeItemSchema.index({ user: 1, color: 1 });
wardrobeItemSchema.index({ user: 1, brand: 1 });
wardrobeItemSchema.index({ user: 1, isFavorite: 1 });
wardrobeItemSchema.index({ user: 1, createdAt: -1 });
wardrobeItemSchema.index({
  user: 1,
  name: "text",
  description: "text",
  tags: "text",
});

// Instance methods
wardrobeItemSchema.methods.incrementWearCount = function () {
  this.wearCount += 1;
  this.lastWorn = new Date();
  return this.save();
};

wardrobeItemSchema.methods.toggleFavorite = function () {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

wardrobeItemSchema.methods.addTag = function (tag) {
  if (!this.tags.includes(tag.toLowerCase())) {
    this.tags.push(tag.toLowerCase());
  }
  return this.save();
};

wardrobeItemSchema.methods.removeTag = function (tag) {
  this.tags = this.tags.filter((t) => t !== tag.toLowerCase());
  return this.save();
};

// Static methods
wardrobeItemSchema.statics.getUserItems = function (userId, filters = {}) {
  const query = { user: userId, isActive: true };

  // Apply filters
  if (filters.category) query.category = filters.category;
  if (filters.color) query.color = filters.color;
  if (filters.brand) query.brand = filters.brand;
  if (filters.isFavorite !== undefined) query.isFavorite = filters.isFavorite;
  if (filters.season) query.season = filters.season;
  if (filters.occasion) query.occasions = filters.occasion;
  if (filters.minPrice !== undefined)
    query.price = { ...query.price, $gte: filters.minPrice };
  if (filters.maxPrice !== undefined)
    query.price = { ...query.price, $lte: filters.maxPrice };
  if (filters.minWearCount !== undefined)
    query.wearCount = { ...query.wearCount, $gte: filters.minWearCount };
  if (filters.maxWearCount !== undefined)
    query.wearCount = { ...query.wearCount, $lte: filters.maxWearCount };

  return this.find(query).sort({ createdAt: -1 });
};

wardrobeItemSchema.statics.searchUserItems = function (userId, searchTerm) {
  if (!searchTerm) return this.getUserItems(userId);

  return this.find({
    user: userId,
    isActive: true,
    $text: { $search: searchTerm },
  }).sort({ score: { $meta: "textScore" } });
};

wardrobeItemSchema.statics.getUserStats = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        totalValue: { $sum: "$price" },
        averagePrice: { $avg: "$price" },
        favoriteItems: { $sum: { $cond: ["$isFavorite", 1, 0] } },
        categories: { $addToSet: "$category" },
        colors: { $addToSet: "$color" },
        brands: { $addToSet: "$brand" },
        totalWearCount: { $sum: "$wearCount" },
        averageWearCount: { $avg: "$wearCount" },
      },
    },
  ]);
};

wardrobeItemSchema.statics.getCategoryStats = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalValue: { $sum: "$price" },
        averagePrice: { $avg: "$price" },
        favoriteCount: { $sum: { $cond: ["$isFavorite", 1, 0] } },
        totalWearCount: { $sum: "$wearCount" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

wardrobeItemSchema.statics.getColorStats = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: "$color",
        count: { $sum: 1 },
        totalValue: { $sum: "$price" },
        averagePrice: { $avg: "$price" },
        favoriteCount: { $sum: { $cond: ["$isFavorite", 1, 0] } },
        categories: { $addToSet: "$category" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

wardrobeItemSchema.statics.getBrandStats = function (userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), isActive: true } },
    {
      $group: {
        _id: "$brand",
        count: { $sum: 1 },
        totalValue: { $sum: "$price" },
        averagePrice: { $avg: "$price" },
        favoriteCount: { $sum: { $cond: ["$isFavorite", 1, 0] } },
        categories: { $addToSet: "$category" },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

module.exports = mongoose.model("WardrobeItem", wardrobeItemSchema);
