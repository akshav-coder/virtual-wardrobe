const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    isAllDay: {
      type: Boolean,
      default: false,
    },
    location: {
      name: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    outfit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outfit",
    },
    weather: {
      temperature: Number,
      conditions: String,
      forecast: String,
    },
    occasion: {
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
        "meeting",
        "interview",
        "presentation",
        "dinner",
        "lunch",
        "brunch",
        "coffee",
        "shopping",
        "travel",
        "sport",
        "outdoor",
        "indoor",
      ],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "cancelled", "completed"],
      default: "scheduled",
    },
    reminders: [
      {
        type: {
          type: String,
          enum: ["email", "push", "sms"],
        },
        time: {
          type: Number, // minutes before event
        },
        sent: {
          type: Boolean,
          default: false,
        },
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
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    attendees: [
      {
        name: String,
        email: String,
        status: {
          type: String,
          enum: ["invited", "accepted", "declined", "tentative"],
          default: "invited",
        },
      },
    ],
    recurrence: {
      type: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly", "yearly"],
        default: "none",
      },
      interval: {
        type: Number,
        default: 1,
      },
      endDate: Date,
      daysOfWeek: [Number], // 0 = Sunday, 1 = Monday, etc.
    },
    metadata: {
      source: {
        type: String,
        enum: ["manual", "import", "sync", "ai_generated"],
        default: "manual",
      },
      lastModified: {
        type: Date,
        default: Date.now,
      },
      version: {
        type: Number,
        default: 1,
      },
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
calendarEventSchema.index({ user: 1, startDate: 1 });
calendarEventSchema.index({ user: 1, endDate: 1 });
calendarEventSchema.index({ user: 1, occasion: 1 });
calendarEventSchema.index({ user: 1, priority: 1 });
calendarEventSchema.index({ user: 1, status: 1 });
calendarEventSchema.index({ user: 1, isActive: 1 });
calendarEventSchema.index({ startDate: 1, endDate: 1 });

// Instance methods
calendarEventSchema.methods.isUpcoming = function () {
  return this.startDate > new Date();
};

calendarEventSchema.methods.isToday = function () {
  const today = new Date();
  const eventDate = new Date(this.startDate);
  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
};

calendarEventSchema.methods.isOverlapping = function (otherEvent) {
  return (
    this.startDate < otherEvent.endDate && this.endDate > otherEvent.startDate
  );
};

calendarEventSchema.methods.getDuration = function () {
  return this.endDate.getTime() - this.startDate.getTime();
};

calendarEventSchema.methods.getDurationInHours = function () {
  return this.getDuration() / (1000 * 60 * 60);
};

calendarEventSchema.methods.addReminder = function (type, time) {
  this.reminders.push({ type, time });
  return this.save();
};

calendarEventSchema.methods.removeReminder = function (type, time) {
  this.reminders = this.reminders.filter(
    (reminder) => !(reminder.type === type && reminder.time === time)
  );
  return this.save();
};

calendarEventSchema.methods.addAttendee = function (name, email) {
  this.attendees.push({ name, email, status: "invited" });
  return this.save();
};

calendarEventSchema.methods.removeAttendee = function (email) {
  this.attendees = this.attendees.filter(
    (attendee) => attendee.email !== email
  );
  return this.save();
};

// Static methods
calendarEventSchema.statics.getUserEvents = function (
  userId,
  filters = {},
  options = {}
) {
  const query = { user: userId, isActive: true };
  const { startDate, endDate, limit = 50, skip = 0 } = options;

  // Apply filters
  if (filters.occasion) query.occasion = filters.occasion;
  if (filters.priority) query.priority = filters.priority;
  if (filters.status) query.status = filters.status;
  if (filters.hasOutfit !== undefined) {
    if (filters.hasOutfit) {
      query.outfit = { $exists: true, $ne: null };
    } else {
      query.outfit = { $exists: false };
    }
  }

  // Date filtering
  if (startDate || endDate) {
    query.startDate = {};
    if (startDate) query.startDate.$gte = new Date(startDate);
    if (endDate) query.startDate.$lte = new Date(endDate);
  }

  return this.find(query)
    .populate("outfit")
    .sort({ startDate: 1 })
    .skip(skip)
    .limit(limit);
};

calendarEventSchema.statics.getUpcomingEvents = function (userId, days = 7) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  return this.getUserEvents(userId, {}, { startDate, endDate });
};

calendarEventSchema.statics.getTodayEvents = function (userId) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  return this.getUserEvents(
    userId,
    {},
    {
      startDate: startOfDay,
      endDate: endOfDay,
    }
  );
};

calendarEventSchema.statics.getEventsByDate = function (userId, date) {
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  return this.getUserEvents(
    userId,
    {},
    {
      startDate: startOfDay,
      endDate: endOfDay,
    }
  );
};

calendarEventSchema.statics.getCalendarStats = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const endDate = new Date();

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isActive: true,
        startDate: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalEvents: { $sum: 1 },
        eventsWithOutfits: {
          $sum: { $cond: [{ $ne: ["$outfit", null] }, 1, 0] },
        },
        totalDuration: { $sum: { $subtract: ["$endDate", "$startDate"] } },
        averageDuration: {
          $avg: { $subtract: ["$endDate", "$startDate"] },
        },
        occasions: { $addToSet: "$occasion" },
        priorities: { $addToSet: "$priority" },
        statuses: { $addToSet: "$status" },
      },
    },
  ]);
};

calendarEventSchema.statics.getOccasionStats = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isActive: true,
        startDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$occasion",
        count: { $sum: 1 },
        eventsWithOutfits: {
          $sum: { $cond: [{ $ne: ["$outfit", null] }, 1, 0] },
        },
        averageDuration: {
          $avg: { $subtract: ["$endDate", "$startDate"] },
        },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

calendarEventSchema.statics.getBusyDays = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isActive: true,
        startDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$startDate" },
        },
        eventCount: { $sum: 1 },
        totalDuration: { $sum: { $subtract: ["$endDate", "$startDate"] } },
        occasions: { $addToSet: "$occasion" },
      },
    },
    { $sort: { _id: -1 } },
  ]);
};

// Pre-save middleware
calendarEventSchema.pre("save", function (next) {
  // Ensure endDate is after startDate
  if (this.endDate <= this.startDate) {
    this.endDate = new Date(this.startDate.getTime() + 60 * 60 * 1000); // 1 hour default
  }

  // Update metadata
  this.metadata.lastModified = new Date();

  // Increment version
  if (this.isModified() && !this.isNew) {
    this.metadata.version += 1;
  }

  next();
});

// Virtual for event duration in minutes
calendarEventSchema.virtual("durationInMinutes").get(function () {
  return Math.round(this.getDuration() / (1000 * 60));
});

// Virtual for event duration in hours
calendarEventSchema.virtual("durationInHours").get(function () {
  return Math.round((this.getDuration() / (1000 * 60 * 60)) * 100) / 100;
});

// Virtual for checking if event is in the past
calendarEventSchema.virtual("isPast").get(function () {
  return this.endDate < new Date();
});

// Virtual for checking if event is currently happening
calendarEventSchema.virtual("isCurrent").get(function () {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
