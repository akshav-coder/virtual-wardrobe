// API Configuration
export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: __DEV__
    ? "http://192.168.0.102:3001/api" // Development
    : "https://your-production-api.com/api", // Production

  // Timeout for API requests (in milliseconds)
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    attempts: 3,
    delay: 1000,
  },

  // Default headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // File upload configuration
  UPLOAD: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    timeout: 60000, // 60 seconds for file uploads
  },

  // Pagination defaults
  PAGINATION: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  // Cache configuration
  CACHE: {
    // RTK Query cache time (in milliseconds)
    // 5 minutes for most data, 1 hour for user data
    userData: 60 * 60 * 1000,
    wardrobeData: 5 * 60 * 1000,
    outfitData: 5 * 60 * 1000,
    weatherData: 10 * 60 * 1000, // 10 minutes for weather
    analyticsData: 30 * 60 * 1000, // 30 minutes for analytics
  },
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
  },

  // User
  USER: {
    PROFILE: "/user/profile",
    STATS: "/user/stats",
    PREFERENCES: "/user/preferences",
    MEASUREMENTS: "/user/measurements",
    PASSWORD: "/user/password",
    DELETE: "/user/delete",
    DASHBOARD: "/user/dashboard",
  },

  // Wardrobe
  WARDROBE: {
    ITEMS: "/wardrobe",
    SEARCH: "/wardrobe/search",
    FAVORITES: "/wardrobe/favorites",
    RECENT: "/wardrobe/recent",
    STATS: "/wardrobe/stats",
    OVERVIEW: "/wardrobe/stats/overview",
    BULK_DELETE: "/wardrobe/bulk/delete",
    BULK_UPDATE: "/wardrobe/bulk/update",
  },

  // Outfits
  OUTFIT: {
    OUTFITS: "/outfit",
    SEARCH: "/outfit/search",
    FAVORITES: "/outfit/favorites",
    TEMPLATES: "/outfit/templates",
    SCHEDULED: "/outfit/scheduled",
    WEATHER_BASED: "/outfit/weather-based",
    STATS: "/outfit/stats",
    ANALYTICS: "/outfit/analytics",
  },

  // Weather
  WEATHER: {
    LOCATION: "/weather/location",
    CURRENT: "/weather/current",
    FORECAST: "/weather/forecast",
    ALERTS: "/weather/alerts",
    HISTORY: "/weather/history",
    STATS: "/weather/stats",
    REFRESH: "/weather/refresh",
    RECOMMENDATIONS: "/weather/recommendations",
    COORDINATES: "/weather/coordinates",
    CITY: "/weather/city",
    COMPARISON: "/weather/comparison",
  },

  // AI
  AI: {
    RECOMMENDATIONS: "/ai/recommendations",
    GENERATE: "/ai/recommendations/generate",
    STATS: "/ai/stats",
    STYLE_ANALYSIS: "/ai/style-analysis",
    COLOR_RECOMMENDATIONS: "/ai/color-recommendations",
    OCCASION_RECOMMENDATIONS: "/ai/occasion-recommendations",
    WEATHER_RECOMMENDATIONS: "/ai/weather-recommendations",
    PERSONALIZED: "/ai/personalized",
    HISTORY: "/ai/history",
    PREFERENCES: "/ai/preferences",
  },

  // Calendar
  CALENDAR: {
    EVENTS: "/calendar",
    UPCOMING: "/calendar/upcoming",
    TODAY: "/calendar/today",
    BY_DATE: "/calendar/date",
    STATS: "/calendar/stats",
    BUSY_DAYS: "/calendar/busy-days",
    BULK_DELETE: "/calendar/bulk/delete",
    BULK_UPDATE: "/calendar/bulk/update",
  },

  // Image
  IMAGE: {
    IMAGES: "/image",
    STATS: "/image/stats",
    BY_COLOR: "/image/color",
    BY_STYLE: "/image/style",
    ANALYSIS: "/image/analysis",
    COLORS: "/image/colors",
    STYLE: "/image/style",
    THUMBNAILS: "/image/thumbnails",
    TAGS: "/image/tags",
    PRIVACY: "/image/privacy",
    BULK_DELETE: "/image/bulk/delete",
    BULK_UPDATE: "/image/bulk/update",
  },

  // Analytics
  ANALYTICS: {
    TRACK: "/analytics/track",
    EVENTS: "/analytics/events",
    DASHBOARD: "/analytics/dashboard",
    STATS: "/analytics/stats",
    EVENT_TYPES: "/analytics/event-types",
    CATEGORIES: "/analytics/categories",
    DAILY: "/analytics/daily",
    HOURLY: "/analytics/hourly",
    ITEMS: "/analytics/items",
    SEARCHES: "/analytics/searches",
    RECOMMENDATIONS: "/analytics/recommendations",
    WARDROBE: "/analytics/wardrobe",
    BEHAVIOR: "/analytics/behavior",
    PERFORMANCE: "/analytics/performance",
    EXPORT: "/analytics/export",
  },
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UPLOAD_ERROR: "Failed to upload file. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in!",
  REGISTER_SUCCESS: "Account created successfully!",
  LOGOUT_SUCCESS: "Successfully logged out!",
  PROFILE_UPDATED: "Profile updated successfully!",
  ITEM_CREATED: "Item created successfully!",
  ITEM_UPDATED: "Item updated successfully!",
  ITEM_DELETED: "Item deleted successfully!",
  OUTFIT_CREATED: "Outfit created successfully!",
  OUTFIT_UPDATED: "Outfit updated successfully!",
  OUTFIT_DELETED: "Outfit deleted successfully!",
  EVENT_CREATED: "Event created successfully!",
  EVENT_UPDATED: "Event updated successfully!",
  EVENT_DELETED: "Event deleted successfully!",
  IMAGE_UPLOADED: "Image uploaded successfully!",
  IMAGE_PROCESSED: "Image processed successfully!",
  RECOMMENDATION_GENERATED: "Recommendations generated successfully!",
  PASSWORD_CHANGED: "Password changed successfully!",
  PREFERENCES_UPDATED: "Preferences updated successfully!",
};

export default {
  API_CONFIG,
  ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
