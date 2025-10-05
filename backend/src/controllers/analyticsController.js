const AnalyticsEvent = require("../models/Analytics");

// Track an analytics event
const trackEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventData = {
      ...req.body,
      user: userId,
      session: {
        sessionId: req.sessionID || req.headers["x-session-id"],
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
        referrer: req.get("Referer"),
        device: getDeviceType(req.get("User-Agent")),
        browser: getBrowser(req.get("User-Agent")),
        os: getOS(req.get("User-Agent")),
      },
    };

    const analyticsEvent = new AnalyticsEvent(eventData);
    await analyticsEvent.save();

    res.status(201).json({
      success: true,
      message: "Event tracked successfully",
      data: {
        event: analyticsEvent,
      },
    });
  } catch (error) {
    console.error("Track event error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to track event",
    });
  }
};

// Get analytics events
const getEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      eventType,
      eventCategory,
      eventAction,
      success,
      itemType,
      itemCategory,
      startDate,
      endDate,
      limit = 100,
      skip = 0,
    } = req.query;

    const filters = {
      eventType,
      eventCategory,
      eventAction,
      success: success !== undefined ? success === "true" : undefined,
      itemType,
      itemCategory,
    };
    const options = {
      startDate,
      endDate,
      limit: parseInt(limit),
      skip: parseInt(skip),
    };

    const events = await AnalyticsEvent.getUserEvents(userId, filters, options);

    res.status(200).json({
      success: true,
      message: "Analytics events retrieved successfully",
      data: {
        events,
        count: events.length,
        pagination: {
          limit: parseInt(limit),
          skip: parseInt(skip),
        },
      },
    });
  } catch (error) {
    console.error("Get analytics events error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve analytics events",
    });
  }
};

// Get analytics dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const [
      userStats,
      eventTypeStats,
      categoryStats,
      dailyActivity,
      hourlyActivity,
      recommendationStats,
      wardrobeInsights,
    ] = await Promise.all([
      AnalyticsEvent.getUserStats(userId, parseInt(days)),
      AnalyticsEvent.getEventTypeStats(userId, parseInt(days)),
      AnalyticsEvent.getCategoryStats(userId, parseInt(days)),
      AnalyticsEvent.getDailyActivity(userId, parseInt(days)),
      AnalyticsEvent.getHourlyActivity(userId, Math.min(7, parseInt(days))),
      AnalyticsEvent.getRecommendationStats(userId, parseInt(days)),
      AnalyticsEvent.getWardrobeInsights(userId, parseInt(days)),
    ]);

    res.status(200).json({
      success: true,
      message: "Analytics dashboard retrieved successfully",
      data: {
        overview: userStats[0] || {},
        eventTypes: eventTypeStats,
        categories: categoryStats,
        dailyActivity,
        hourlyActivity,
        recommendations: recommendationStats,
        wardrobe: wardrobeInsights[0] || {},
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get analytics dashboard error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve analytics dashboard",
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const stats = await AnalyticsEvent.getUserStats(userId, parseInt(days));

    res.status(200).json({
      success: true,
      message: "User statistics retrieved successfully",
      data: {
        stats: stats[0] || {},
        period: `${parseInt(days)} days`,
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

// Get event type statistics
const getEventTypeStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const stats = await AnalyticsEvent.getEventTypeStats(
      userId,
      parseInt(days)
    );

    res.status(200).json({
      success: true,
      message: "Event type statistics retrieved successfully",
      data: {
        eventTypes: stats,
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get event type stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve event type statistics",
    });
  }
};

// Get category statistics
const getCategoryStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const stats = await AnalyticsEvent.getCategoryStats(userId, parseInt(days));

    res.status(200).json({
      success: true,
      message: "Category statistics retrieved successfully",
      data: {
        categories: stats,
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get category stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve category statistics",
    });
  }
};

// Get daily activity
const getDailyActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const activity = await AnalyticsEvent.getDailyActivity(
      userId,
      parseInt(days)
    );

    res.status(200).json({
      success: true,
      message: "Daily activity retrieved successfully",
      data: {
        dailyActivity: activity,
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get daily activity error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve daily activity",
    });
  }
};

// Get hourly activity
const getHourlyActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 7 } = req.query;

    const activity = await AnalyticsEvent.getHourlyActivity(
      userId,
      parseInt(days)
    );

    res.status(200).json({
      success: true,
      message: "Hourly activity retrieved successfully",
      data: {
        hourlyActivity: activity,
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get hourly activity error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve hourly activity",
    });
  }
};

// Get item statistics
const getItemStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const stats = await AnalyticsEvent.getItemStats(userId, parseInt(days));

    res.status(200).json({
      success: true,
      message: "Item statistics retrieved successfully",
      data: {
        items: stats,
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get item stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve item statistics",
    });
  }
};

// Get search statistics
const getSearchStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const stats = await AnalyticsEvent.getSearchStats(userId, parseInt(days));

    res.status(200).json({
      success: true,
      message: "Search statistics retrieved successfully",
      data: {
        searches: stats,
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get search stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve search statistics",
    });
  }
};

// Get recommendation statistics
const getRecommendationStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const stats = await AnalyticsEvent.getRecommendationStats(
      userId,
      parseInt(days)
    );

    res.status(200).json({
      success: true,
      message: "Recommendation statistics retrieved successfully",
      data: {
        recommendations: stats,
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get recommendation stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve recommendation statistics",
    });
  }
};

// Get wardrobe insights
const getWardrobeInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const insights = await AnalyticsEvent.getWardrobeInsights(
      userId,
      parseInt(days)
    );

    res.status(200).json({
      success: true,
      message: "Wardrobe insights retrieved successfully",
      data: {
        insights: insights[0] || {},
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get wardrobe insights error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve wardrobe insights",
    });
  }
};

// Helper functions
function getDeviceType(userAgent) {
  if (!userAgent) return "unknown";

  const mobileRegex =
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletRegex = /iPad|Android(?=.*Tablet)|Kindle|Silk/i;

  if (tabletRegex.test(userAgent)) return "tablet";
  if (mobileRegex.test(userAgent)) return "mobile";
  return "desktop";
}

function getBrowser(userAgent) {
  if (!userAgent) return "unknown";

  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Opera")) return "Opera";

  return "unknown";
}

function getOS(userAgent) {
  if (!userAgent) return "unknown";

  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iOS")) return "iOS";

  return "unknown";
}

module.exports = {
  trackEvent,
  getEvents,
  getDashboard,
  getUserStats,
  getEventTypeStats,
  getCategoryStats,
  getDailyActivity,
  getHourlyActivity,
  getItemStats,
  getSearchStats,
  getRecommendationStats,
  getWardrobeInsights,
};
