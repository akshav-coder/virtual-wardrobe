const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/calendarController");
const { auth } = require("../middleware/auth");

// All calendar routes require authentication
router.use(auth);

// Calendar statistics and lists (must come before /:id routes)
router.get("/stats", getStats);
router.get("/upcoming", getUpcomingEvents);
router.get("/today", getTodayEvents);
router.get("/date/:date", getEventsByDate);

// Basic CRUD operations
router.route("/").get(getEvents).post(createEvent);
router.route("/:id").get(getEvent).put(updateEvent).delete(deleteEvent);

// Event actions
router.put("/:id/outfit", assignOutfit);
router.get("/:id/recommendations", getOutfitRecommendations);
router.put("/:id/reminders/add", addReminder);
router.put("/:id/reminders/remove", removeReminder);

module.exports = router;
