const User = require("../models/User");
const { generateToken } = require("../middleware/auth");

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
        message: "An account with this email already exists",
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
    });

    // Save user (password will be hashed by pre-save middleware)
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return user data without password
    const userData = user.getPublicProfile();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        error: "User already exists",
        message: "An account with this email already exists",
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Registration failed. Please try again.",
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Validation failed",
        message: "Email and password are required",
      });
    }

    // Find user by email (including password)
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: "Account deactivated",
        message: "Your account has been deactivated",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userData = user.getPublicProfile();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Login failed. Please try again.",
    });
  }
};

// Logout (client-side token removal, but we can log it server-side)
const logout = async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Logout failed",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};
