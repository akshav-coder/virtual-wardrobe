const CalendarEvent = require("../models/Calendar");
const Outfit = require("../models/Outfit");
const Weather = require("../models/Weather");

// Get calendar events
const getEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      startDate,
      endDate,
      occasion,
      priority,
      status,
      hasOutfit,
      limit = 50,
      skip = 0,
    } = req.query;

    const filters = { occasion, priority, status, hasOutfit };
    const options = {
      startDate,
      endDate,
      limit: parseInt(limit),
      skip: parseInt(skip),
    };

    const events = await CalendarEvent.getUserEvents(userId, filters, options);

    res.status(200).json({
      success: true,
      message: "Calendar events retrieved successfully",
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
    console.error("Get events error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve calendar events",
    });
  }
};

// Get a single event
const getEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const event = await CalendarEvent.findOne({
      _id: id,
      user: userId,
      isActive: true,
    }).populate("outfit");

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
        message: "Event does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve event",
    });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventData = {
      ...req.body,
      user: userId,
    };

    // Validate outfit if provided
    if (eventData.outfit) {
      const outfit = await Outfit.findOne({
        _id: eventData.outfit,
        user: userId,
        isActive: true,
      });

      if (!outfit) {
        return res.status(400).json({
          error: "Invalid outfit",
          message: "Outfit does not exist or belongs to another user",
        });
      }
    }

    const event = new CalendarEvent(eventData);
    await event.save();
    await event.populate("outfit");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Create event error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to create event",
    });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const updates = req.body;

    // Validate outfit if provided
    if (updates.outfit) {
      const outfit = await Outfit.findOne({
        _id: updates.outfit,
        user: userId,
        isActive: true,
      });

      if (!outfit) {
        return res.status(400).json({
          error: "Invalid outfit",
          message: "Outfit does not exist or belongs to another user",
        });
      }
    }

    // Remove fields that shouldn't be updated directly
    delete updates.user;
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const event = await CalendarEvent.findOneAndUpdate(
      { _id: id, user: userId, isActive: true },
      updates,
      { new: true, runValidators: true }
    ).populate("outfit");

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
        message: "Event does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Update event error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        message: errors.join(", "),
      });
    }

    res.status(500).json({
      error: "Server error",
      message: "Failed to update event",
    });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const event = await CalendarEvent.findOneAndUpdate(
      { _id: id, user: userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
        message: "Event does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to delete event",
    });
  }
};

// Get upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 7 } = req.query;

    const events = await CalendarEvent.getUpcomingEvents(
      userId,
      parseInt(days)
    );

    res.status(200).json({
      success: true,
      message: "Upcoming events retrieved successfully",
      data: {
        events,
        count: events.length,
        days: parseInt(days),
      },
    });
  } catch (error) {
    console.error("Get upcoming events error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve upcoming events",
    });
  }
};

// Get today's events
const getTodayEvents = async (req, res) => {
  try {
    const userId = req.user._id;

    const events = await CalendarEvent.getTodayEvents(userId);

    res.status(200).json({
      success: true,
      message: "Today's events retrieved successfully",
      data: {
        events,
        count: events.length,
        date: new Date().toISOString().split("T")[0],
      },
    });
  } catch (error) {
    console.error("Get today's events error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve today's events",
    });
  }
};

// Get events by date
const getEventsByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;

    const events = await CalendarEvent.getEventsByDate(userId, date);

    res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: {
        events,
        count: events.length,
        date,
      },
    });
  } catch (error) {
    console.error("Get events by date error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve events for date",
    });
  }
};

// Get calendar statistics
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const [stats, occasionStats, busyDays] = await Promise.all([
      CalendarEvent.getCalendarStats(userId, parseInt(days)),
      CalendarEvent.getOccasionStats(userId, parseInt(days)),
      CalendarEvent.getBusyDays(userId, parseInt(days)),
    ]);

    res.status(200).json({
      success: true,
      message: "Calendar statistics retrieved successfully",
      data: {
        stats: stats[0] || {},
        occasionStats,
        busyDays,
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get calendar stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve calendar statistics",
    });
  }
};

// Assign outfit to event
const assignOutfit = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { outfitId } = req.body;

    // Validate outfit
    const outfit = await Outfit.findOne({
      _id: outfitId,
      user: userId,
      isActive: true,
    });

    if (!outfit) {
      return res.status(400).json({
        error: "Invalid outfit",
        message: "Outfit does not exist or belongs to another user",
      });
    }

    const event = await CalendarEvent.findOneAndUpdate(
      { _id: id, user: userId, isActive: true },
      { outfit: outfitId },
      { new: true, runValidators: true }
    ).populate("outfit");

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
        message: "Event does not exist or belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      message: "Outfit assigned to event successfully",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Assign outfit error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to assign outfit to event",
    });
  }
};

// Get outfit recommendations for event
const getOutfitRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const event = await CalendarEvent.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
        message: "Event does not exist or belongs to another user",
      });
    }

    // Get weather data for event date
    let weatherData = null;
    try {
      const weather = await Weather.getUserWeather(userId, true);
      if (weather) {
        weatherData = weather.current;
      }
    } catch (weatherError) {
      console.log("Weather data not available for recommendations");
    }

    // Get outfit recommendations based on event context
    const recommendations = await Outfit.getWeatherBasedOutfits(
      userId,
      weatherData?.temperature?.current || 20,
      weatherData?.conditions ? [weatherData.conditions.main] : []
    );

    // Filter by occasion if specified
    let filteredRecommendations = recommendations;
    if (event.occasion) {
      filteredRecommendations = recommendations.filter(
        (outfit) =>
          outfit.occasions && outfit.occasions.includes(event.occasion)
      );
    }

    res.status(200).json({
      success: true,
      message: "Outfit recommendations retrieved successfully",
      data: {
        event,
        recommendations: filteredRecommendations.slice(0, 5), // Top 5 recommendations
        weatherData,
      },
    });
  } catch (error) {
    console.error("Get outfit recommendations error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to get outfit recommendations",
    });
  }
};

// Add reminder to event
const addReminder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { type, time } = req.body;

    const event = await CalendarEvent.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
        message: "Event does not exist or belongs to another user",
      });
    }

    await event.addReminder(type, time);

    res.status(200).json({
      success: true,
      message: "Reminder added successfully",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Add reminder error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to add reminder",
    });
  }
};

// Remove reminder from event
const removeReminder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { type, time } = req.body;

    const event = await CalendarEvent.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
        message: "Event does not exist or belongs to another user",
      });
    }

    await event.removeReminder(type, time);

    res.status(200).json({
      success: true,
      message: "Reminder removed successfully",
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Remove reminder error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to remove reminder",
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getTodayEvents,
  getEventsByDate,
  getStats,
  assignOutfit,
  getOutfitRecommendations,
  addReminder,
  removeReminder,
};
