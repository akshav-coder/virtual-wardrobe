const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(morgan("combined")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files
app.use("/uploads", express.static("uploads"));

// MongoDB Connection (Optional for now)
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/virtual-wardrobe"
    );
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.warn(
      "⚠️ MongoDB not available, running without database:",
      error.message
    );
    console.log("💡 Server will continue without database connection");
  }
};

// Connect to database (non-blocking)
connectDB();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const wardrobeRoutes = require("./routes/wardrobe");
const outfitRoutes = require("./routes/outfit");
const weatherRoutes = require("./routes/weather");
const aiRoutes = require("./routes/ai");
const calendarRoutes = require("./routes/calendar");
const imageRoutes = require("./routes/image");
const analyticsRoutes = require("./routes/analytics");
const { auth } = require("./middleware/auth");

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Virtual Wardrobe API is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/wardrobe", wardrobeRoutes);
app.use("/api/outfit", outfitRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/analytics", analyticsRoutes);

// Protected route example
app.get("/api/protected", auth, (req, res) => {
  res.json({
    success: true,
    message: "This is a protected route",
    user: req.user.getPublicProfile(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
