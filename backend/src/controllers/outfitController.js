const Outfit = require("../models/Outfit");
const WardrobeItem = require("../models/WardrobeItem");

// Get all outfits for a user
const getOutfits = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      category,
      season,
      isFavorite,
      isTemplate,
      scheduledDate,
      minTemperature,
      maxTemperature,
      weatherCondition,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    let query = Outfit.getUserOutfits(userId, {
      category,
      season,
      isFavorite: isFavorite === "true",
      isTemplate: isTemplate === "true",
      scheduledDate,
      minTemperature: minTemperature ? parseInt(minTemperature) : undefined,
      maxTemperature: maxTemperature ? parseInt(maxTemperature) : undefined,
      weatherCondition,
    });

    // Handle search
    if (search) {
      query = Outfit.searchUserOutfits(userId, search);
    }

    // Handle sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    query = query.sort(sortOptions);

    // Handle pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

    const outfits = await query;

    // Get total count for pagination
    const totalOutfits = await Outfit.countDocuments({
      user: userId,
      isActive: true,
      ...(category && { category }),
      ...(season && { season }),
      ...(isFavorite !== undefined && { isFavorite: isFavorite === "true" }),
      ...(isTemplate !== undefined && { isTemplate: isTemplate === "true" }),
      ...(scheduledDate && {
        scheduledDate: {
          $gte: new Date(new Date(scheduledDate).setHours(0, 0, 0, 0)),
          $lte: new Date(new Date(scheduledDate).setHours(23, 59, 59, 999)),
        },
      }),
      ...(minTemperature !== undefined && {
        "weather.temperature.min": { $gte: parseInt(minTemperature) },
      }),
      ...(maxTemperature !== undefined && {
        "weather.temperature.max": { $lte: parseInt(maxTemperature) },
      }),
      ...(weatherCondition && { "weather.conditions": weatherCondition }),
    });

    res.status(200).json({
      success: true,
      message: "Outfits retrieved successfully",
      data: {
        outfits,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOutfits / parseInt(limit)),
          totalItems: totalOutfits,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get outfits error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve outfits",
    });
  }
};

// Get a single outfit
const getOutfit = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const outfit = await Outfit.findOne({
      _id: id,
      user: userId,
      isActive: true,
    }).populate("items.item");

    if (!outfit) {
      return res.status(404).json({
        error: "Outfit not found",
        message: "Outfit does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Outfit retrieved successfully",
      data: {
        outfit,
      },
    });
  } catch (error) {
    console.error("Get outfit error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve outfit",
    });
  }
};

// Create a new outfit
const createOutfit = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, ...outfitData } = req.body;

    // Validate that all items belong to the user
    if (items && items.length > 0) {
      const itemIds = items.map((item) => item.item);
      const userItems = await WardrobeItem.find({
        _id: { $in: itemIds },
        user: userId,
        isActive: true,
      });

      if (userItems.length !== itemIds.length) {
        return res.status(400).json({
          error: "Invalid items",
          message: "Some items do not exist or belong to another user",
        });
      }
    }

    const outfit = new Outfit({
      ...outfitData,
      user: userId,
      items: items || [],
    });

    await outfit.save();
    await outfit.populate("items.item");

    res.status(201).json({
      success: true,
      message: "Outfit created successfully",
      data: {
        outfit,
      },
    });
  } catch (error) {
    console.error("Create outfit error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to create outfit",
    });
  }
};

// Update an outfit
const updateOutfit = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { items, ...updates } = req.body;

    // Validate items if provided
    if (items && items.length > 0) {
      const itemIds = items.map((item) => item.item);
      const userItems = await WardrobeItem.find({
        _id: { $in: itemIds },
        user: userId,
        isActive: true,
      });

      if (userItems.length !== itemIds.length) {
        return res.status(400).json({
          error: "Invalid items",
          message: "Some items do not exist or belong to another user",
        });
      }
    }

    // Remove fields that shouldn't be updated directly
    delete updates.user;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const outfit = await Outfit.findOneAndUpdate(
      { _id: id, user: userId, isActive: true },
      { ...updates, items: items || undefined },
      { new: true, runValidators: true }
    ).populate("items.item");

    if (!outfit) {
      return res.status(404).json({
        error: "Outfit not found",
        message: "Outfit does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Outfit updated successfully",
      data: {
        outfit,
      },
    });
  } catch (error) {
    console.error("Update outfit error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to update outfit",
    });
  }
};

// Delete an outfit (soft delete)
const deleteOutfit = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const outfit = await Outfit.findOneAndUpdate(
      { _id: id, user: userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!outfit) {
      return res.status(404).json({
        error: "Outfit not found",
        message: "Outfit does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Outfit deleted successfully",
    });
  } catch (error) {
    console.error("Delete outfit error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to delete outfit",
    });
  }
};

// Toggle favorite status
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const outfit = await Outfit.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!outfit) {
      return res.status(404).json({
        error: "Outfit not found",
        message: "Outfit does not exist or belongs to another user",
      });
    }

    await outfit.toggleFavorite();

    res.status(200).json({
      success: true,
      message: `Outfit ${
        outfit.isFavorite ? "added to" : "removed from"
      } favorites`,
      data: {
        outfit,
      },
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to toggle favorite status",
    });
  }
};

// Increment wear count
const incrementWearCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const outfit = await Outfit.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!outfit) {
      return res.status(404).json({
        error: "Outfit not found",
        message: "Outfit does not exist or belongs to another user",
      });
    }

    await outfit.incrementWearCount();

    res.status(200).json({
      success: true,
      message: "Wear count incremented successfully",
      data: {
        outfit,
      },
    });
  } catch (error) {
    console.error("Increment wear count error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to increment wear count",
    });
  }
};

// Add item to outfit
const addItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { itemId, category, position = "primary", notes = "" } = req.body;

    // Validate that the item belongs to the user
    const wardrobeItem = await WardrobeItem.findOne({
      _id: itemId,
      user: userId,
      isActive: true,
    });

    if (!wardrobeItem) {
      return res.status(400).json({
        error: "Invalid item",
        message: "Item does not exist or belongs to another user",
      });
    }

    const outfit = await Outfit.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!outfit) {
      return res.status(404).json({
        error: "Outfit not found",
        message: "Outfit does not exist or belongs to another user",
      });
    }

    await outfit.addItem(itemId, category, position, notes);
    await outfit.populate("items.item");

    res.status(200).json({
      success: true,
      message: "Item added to outfit successfully",
      data: {
        outfit,
      },
    });
  } catch (error) {
    console.error("Add item error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to add item to outfit",
    });
  }
};

// Remove item from outfit
const removeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { itemId } = req.body;

    const outfit = await Outfit.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!outfit) {
      return res.status(404).json({
        error: "Outfit not found",
        message: "Outfit does not exist or belongs to another user",
      });
    }

    await outfit.removeItem(itemId);
    await outfit.populate("items.item");

    res.status(200).json({
      success: true,
      message: "Item removed from outfit successfully",
      data: {
        outfit,
      },
    });
  } catch (error) {
    console.error("Remove item error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to remove item from outfit",
    });
  }
};

// Get outfit statistics
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [userStats, categoryStats] = await Promise.all([
      Outfit.getUserStats(userId),
      Outfit.getCategoryStats(userId),
    ]);

    const stats = userStats[0] || {
      totalOutfits: 0,
      favoriteOutfits: 0,
      templateOutfits: 0,
      totalWearCount: 0,
      averageWearCount: 0,
      categories: [],
      seasons: [],
      colors: [],
    };

    res.status(200).json({
      success: true,
      message: "Outfit statistics retrieved successfully",
      data: {
        stats,
        categoryStats,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve outfit statistics",
    });
  }
};

// Get favorite outfits
const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const outfits = await Outfit.find({
      user: userId,
      isActive: true,
      isFavorite: true,
    })
      .populate("items.item")
      .sort({ updatedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalFavorites = await Outfit.countDocuments({
      user: userId,
      isActive: true,
      isFavorite: true,
    });

    res.status(200).json({
      success: true,
      message: "Favorite outfits retrieved successfully",
      data: {
        outfits,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalFavorites / parseInt(limit)),
          totalItems: totalFavorites,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve favorite outfits",
    });
  }
};

// Get outfit templates
const getTemplates = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const outfits = await Outfit.find({
      user: userId,
      isActive: true,
      isTemplate: true,
    })
      .populate("items.item")
      .sort({ updatedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalTemplates = await Outfit.countDocuments({
      user: userId,
      isActive: true,
      isTemplate: true,
    });

    res.status(200).json({
      success: true,
      message: "Outfit templates retrieved successfully",
      data: {
        outfits,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalTemplates / parseInt(limit)),
          totalItems: totalTemplates,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get templates error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve outfit templates",
    });
  }
};

// Get scheduled outfits
const getScheduledOutfits = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "Missing parameters",
        message: "startDate and endDate are required",
      });
    }

    const outfits = await Outfit.getScheduledOutfits(
      userId,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      message: "Scheduled outfits retrieved successfully",
      data: {
        outfits,
      },
    });
  } catch (error) {
    console.error("Get scheduled outfits error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve scheduled outfits",
    });
  }
};

// Get weather-based outfit suggestions
const getWeatherBasedOutfits = async (req, res) => {
  try {
    const userId = req.user._id;
    const { temperature, conditions } = req.query;

    if (!temperature) {
      return res.status(400).json({
        error: "Missing parameters",
        message: "temperature is required",
      });
    }

    const weatherConditions = conditions ? conditions.split(",") : [];
    const outfits = await Outfit.getWeatherBasedOutfits(
      userId,
      parseInt(temperature),
      weatherConditions
    );

    res.status(200).json({
      success: true,
      message: "Weather-based outfits retrieved successfully",
      data: {
        outfits,
      },
    });
  } catch (error) {
    console.error("Get weather-based outfits error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve weather-based outfits",
    });
  }
};

module.exports = {
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
};
