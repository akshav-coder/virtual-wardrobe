const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = req.user; // Set by auth middleware

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve profile",
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    delete updates.password;
    delete updates.email; // Email updates should be a separate endpoint
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User does not exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to update profile",
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Validation failed",
        message: "New password must be at least 6 characters",
      });
    }

    // Find user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User does not exist",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save(); // Password will be hashed by pre-save middleware

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to change password",
    });
  }
};

// Update user preferences
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const preferences = req.body;

    // Validate preferences
    const allowedPreferences = [
      "style",
      "colors",
      "brands",
      "budget",
      "notifications",
      "weatherAlerts",
      "styleTips",
      "newItemAlerts",
    ];

    const validPreferences = {};
    Object.keys(preferences).forEach((key) => {
      if (allowedPreferences.includes(key)) {
        validPreferences[key] = preferences[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: { preferences: { ...req.user.preferences, ...validPreferences } },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User does not exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      data: {
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Update preferences error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to update preferences",
    });
  }
};

// Update body measurements
const updateBodyMeasurements = async (req, res) => {
  try {
    const userId = req.user._id;
    const measurements = req.body;

    // Validate measurements
    const allowedMeasurements = [
      "height",
      "weight",
      "chest",
      "waist",
      "hips",
      "inseam",
      "shoulder",
      "sleeve",
      "neck",
      "shoeSize",
    ];

    const validMeasurements = {};
    Object.keys(measurements).forEach((key) => {
      if (allowedMeasurements.includes(key)) {
        validMeasurements[key] = measurements[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          bodyMeasurements: {
            ...req.user.bodyMeasurements,
            ...validMeasurements,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User does not exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Body measurements updated successfully",
      data: {
        bodyMeasurements: user.bodyMeasurements,
      },
    });
  } catch (error) {
    console.error("Update body measurements error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to update body measurements",
    });
  }
};

// Update email
const updateEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newEmail, password } = req.body;

    // Validation
    if (!newEmail || !password) {
      return res.status(400).json({
        error: "Validation failed",
        message: "New email and current password are required",
      });
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Please enter a valid email address",
      });
    }

    // Check if new email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      return res.status(409).json({
        error: "Email already exists",
        message: "An account with this email already exists",
      });
    }

    // Verify current password
    const user = await User.findById(userId).select("+password");
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
        message: "Current password is incorrect",
      });
    }

    // Update email
    user.email = newEmail;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Update email error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        error: "Email already exists",
        message: "An account with this email already exists",
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to update email",
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    // Validation
    if (!password) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Password is required to delete account",
      });
    }

    // Verify password
    const user = await User.findById(userId).select("+password");
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
        message: "Password is incorrect",
      });
    }

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to delete account",
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const user = req.user;

    // This would be expanded when we have wardrobe and outfit data
    const stats = {
      accountCreated: user.createdAt,
      lastLogin: user.lastLogin,
      profileComplete: {
        hasAvatar: !!user.avatar,
        hasMeasurements: Object.keys(user.bodyMeasurements).length > 0,
        hasPreferences:
          user.preferences.colors.length > 0 ||
          user.preferences.brands.length > 0,
      },
      // Future stats (when we implement wardrobe/outfit features)
      totalItems: 0,
      totalOutfits: 0,
      favoriteItems: 0,
      mostWornItem: null,
      styleScore: 0,
    };

    res.status(200).json({
      success: true,
      message: "User statistics retrieved successfully",
      data: {
        stats,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve user statistics",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updatePreferences,
  updateBodyMeasurements,
  updateEmail,
  deleteAccount,
  getUserStats,
};
