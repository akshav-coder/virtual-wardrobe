const WardrobeItem = require("../models/WardrobeItem");

// Get all wardrobe items for a user
const getItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      category,
      color,
      brand,
      isFavorite,
      season,
      occasion,
      minPrice,
      maxPrice,
      minWearCount,
      maxWearCount,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    let query = WardrobeItem.getUserItems(userId, {
      category,
      color,
      brand,
      isFavorite: isFavorite === "true",
      season,
      occasion,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      minWearCount: minWearCount ? parseInt(minWearCount) : undefined,
      maxWearCount: maxWearCount ? parseInt(maxWearCount) : undefined,
    });

    // Handle search
    if (search) {
      query = WardrobeItem.searchUserItems(userId, search);
    }

    // Handle sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    query = query.sort(sortOptions);

    // Handle pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

    const items = await query;

    // Get total count for pagination
    const totalItems = await WardrobeItem.countDocuments({
      user: userId,
      isActive: true,
      ...(category && { category }),
      ...(color && { color }),
      ...(brand && { brand }),
      ...(isFavorite !== undefined && { isFavorite: isFavorite === "true" }),
      ...(season && { season }),
      ...(occasion && { occasions: occasion }),
      ...(minPrice !== undefined && { price: { $gte: parseInt(minPrice) } }),
      ...(maxPrice !== undefined && { price: { $lte: parseInt(maxPrice) } }),
      ...(minWearCount !== undefined && {
        wearCount: { $gte: parseInt(minWearCount) },
      }),
      ...(maxWearCount !== undefined && {
        wearCount: { $lte: parseInt(maxWearCount) },
      }),
    });

    res.status(200).json({
      success: true,
      message: "Wardrobe items retrieved successfully",
      data: {
        items,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / parseInt(limit)),
          totalItems,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve wardrobe items",
    });
  }
};

// Get a single wardrobe item
const getItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const item = await WardrobeItem.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!item) {
      return res.status(404).json({
        error: "Item not found",
        message: "Wardrobe item does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wardrobe item retrieved successfully",
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve wardrobe item",
    });
  }
};

// Create a new wardrobe item
const createItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemData = {
      ...req.body,
      user: userId,
    };

    const item = new WardrobeItem(itemData);
    await item.save();

    res.status(201).json({
      success: true,
      message: "Wardrobe item created successfully",
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Create item error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to create wardrobe item",
    });
  }
};

// Update a wardrobe item
const updateItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.user;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const item = await WardrobeItem.findOneAndUpdate(
      { _id: id, user: userId, isActive: true },
      updates,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        error: "Item not found",
        message: "Wardrobe item does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wardrobe item updated successfully",
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Update item error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to update wardrobe item",
    });
  }
};

// Delete a wardrobe item (soft delete)
const deleteItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const item = await WardrobeItem.findOneAndUpdate(
      { _id: id, user: userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        error: "Item not found",
        message: "Wardrobe item does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wardrobe item deleted successfully",
    });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to delete wardrobe item",
    });
  }
};

// Toggle favorite status
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const item = await WardrobeItem.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!item) {
      return res.status(404).json({
        error: "Item not found",
        message: "Wardrobe item does not exist or belongs to another user",
      });
    }

    await item.toggleFavorite();

    res.status(200).json({
      success: true,
      message: `Item ${
        item.isFavorite ? "added to" : "removed from"
      } favorites`,
      data: {
        item,
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

    const item = await WardrobeItem.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!item) {
      return res.status(404).json({
        error: "Item not found",
        message: "Wardrobe item does not exist or belongs to another user",
      });
    }

    await item.incrementWearCount();

    res.status(200).json({
      success: true,
      message: "Wear count incremented successfully",
      data: {
        item,
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

// Add tag to item
const addTag = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { tag } = req.body;

    if (!tag || typeof tag !== "string") {
      return res.status(400).json({
        error: "Validation failed",
        message: "Tag is required and must be a string",
      });
    }

    const item = await WardrobeItem.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!item) {
      return res.status(404).json({
        error: "Item not found",
        message: "Wardrobe item does not exist or belongs to another user",
      });
    }

    await item.addTag(tag);

    res.status(200).json({
      success: true,
      message: "Tag added successfully",
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Add tag error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to add tag",
    });
  }
};

// Remove tag from item
const removeTag = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { tag } = req.body;

    if (!tag || typeof tag !== "string") {
      return res.status(400).json({
        error: "Validation failed",
        message: "Tag is required and must be a string",
      });
    }

    const item = await WardrobeItem.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!item) {
      return res.status(404).json({
        error: "Item not found",
        message: "Wardrobe item does not exist or belongs to another user",
      });
    }

    await item.removeTag(tag);

    res.status(200).json({
      success: true,
      message: "Tag removed successfully",
      data: {
        item,
      },
    });
  } catch (error) {
    console.error("Remove tag error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to remove tag",
    });
  }
};

// Get wardrobe statistics
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [userStats, categoryStats, colorStats, brandStats] =
      await Promise.all([
        WardrobeItem.getUserStats(userId),
        WardrobeItem.getCategoryStats(userId),
        WardrobeItem.getColorStats(userId),
        WardrobeItem.getBrandStats(userId),
      ]);

    const stats = userStats[0] || {
      totalItems: 0,
      totalValue: 0,
      averagePrice: 0,
      favoriteItems: 0,
      categories: [],
      colors: [],
      brands: [],
      totalWearCount: 0,
      averageWearCount: 0,
    };

    res.status(200).json({
      success: true,
      message: "Wardrobe statistics retrieved successfully",
      data: {
        stats,
        categoryStats,
        colorStats,
        brandStats,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve wardrobe statistics",
    });
  }
};

// Get favorite items
const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const items = await WardrobeItem.find({
      user: userId,
      isActive: true,
      isFavorite: true,
    })
      .sort({ updatedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalFavorites = await WardrobeItem.countDocuments({
      user: userId,
      isActive: true,
      isFavorite: true,
    });

    res.status(200).json({
      success: true,
      message: "Favorite items retrieved successfully",
      data: {
        items,
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
      message: "Failed to retrieve favorite items",
    });
  }
};

// Get recently added items
const getRecentItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 10 } = req.query;

    const items = await WardrobeItem.find({
      user: userId,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: "Recent items retrieved successfully",
      data: {
        items,
      },
    });
  } catch (error) {
    console.error("Get recent items error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve recent items",
    });
  }
};

module.exports = {
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
};
