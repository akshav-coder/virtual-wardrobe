const mongoose = require("mongoose");

const weatherDataSchema = new mongoose.Schema({
  temperature: {
    current: Number,
    min: Number,
    max: Number,
    feelsLike: Number,
    unit: {
      type: String,
      enum: ["celsius", "fahrenheit"],
      default: "celsius",
    },
  },
  humidity: {
    type: Number,
    min: 0,
    max: 100,
  },
  wind: {
    speed: Number,
    direction: Number, // degrees
    gust: Number,
  },
  pressure: {
    type: Number,
  },
  visibility: {
    type: Number,
  },
  uvIndex: {
    type: Number,
    min: 0,
    max: 11,
  },
  conditions: {
    main: {
      type: String,
      enum: [
        "clear",
        "clouds",
        "rain",
        "drizzle",
        "thunderstorm",
        "snow",
        "mist",
        "fog",
        "haze",
        "dust",
        "sand",
        "ash",
        "squall",
        "tornado",
      ],
    },
    description: String,
    icon: String,
  },
  precipitation: {
    probability: Number, // 0-100
    amount: Number,
    type: {
      type: String,
      enum: ["rain", "snow", "sleet", "hail"],
    },
  },
  sunrise: Date,
  sunset: Date,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const weatherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    location: {
      name: {
        type: String,
        required: [true, "Location name is required"],
        trim: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          required: [true, "Latitude is required"],
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          required: [true, "Longitude is required"],
          min: -180,
          max: 180,
        },
      },
      country: String,
      state: String,
      city: String,
      postalCode: String,
    },
    current: weatherDataSchema,
    forecast: [
      {
        date: {
          type: Date,
          required: true,
        },
        day: weatherDataSchema,
        night: weatherDataSchema,
        hourly: [weatherDataSchema],
      },
    ],
    alerts: [
      {
        type: {
          type: String,
          enum: [
            "weather",
            "flood",
            "wind",
            "tornado",
            "hurricane",
            "snow",
            "ice",
            "heat",
            "cold",
            "fire",
            "air_quality",
          ],
        },
        severity: {
          type: String,
          enum: ["minor", "moderate", "severe", "extreme"],
        },
        title: String,
        description: String,
        startTime: Date,
        endTime: Date,
        areas: [String],
        source: String,
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      default: "openweathermap",
    },
    isDefault: {
      type: Boolean,
      default: false,
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
weatherSchema.index({ user: 1, "location.coordinates": "2dsphere" });
weatherSchema.index({ user: 1, isDefault: 1 });
weatherSchema.index({ user: 1, lastUpdated: -1 });
weatherSchema.index({ user: 1, isActive: 1 });

// Instance methods
weatherSchema.methods.getOutfitRecommendations = function () {
  const recommendations = [];
  const current = this.current;

  // Temperature-based recommendations
  if (current.temperature.current < 0) {
    recommendations.push({
      type: "temperature",
      priority: "high",
      message: "Extremely cold weather - wear heavy winter clothing",
      items: [
        "winter_coat",
        "thermal_underwear",
        "winter_boots",
        "gloves",
        "hat",
      ],
    });
  } else if (current.temperature.current < 10) {
    recommendations.push({
      type: "temperature",
      priority: "high",
      message: "Cold weather - layer up with warm clothing",
      items: ["jacket", "sweater", "long_pants", "closed_shoes"],
    });
  } else if (current.temperature.current < 20) {
    recommendations.push({
      type: "temperature",
      priority: "medium",
      message: "Cool weather - light layers recommended",
      items: ["light_jacket", "long_sleeves", "jeans", "sneakers"],
    });
  } else if (current.temperature.current > 30) {
    recommendations.push({
      type: "temperature",
      priority: "high",
      message: "Hot weather - wear light, breathable clothing",
      items: ["shorts", "t_shirt", "sandals", "hat", "sunglasses"],
    });
  }

  // Weather condition-based recommendations
  if (
    current.conditions.main === "rain" ||
    current.precipitation.probability > 50
  ) {
    recommendations.push({
      type: "precipitation",
      priority: "high",
      message: "Rain expected - bring rain protection",
      items: ["rain_jacket", "umbrella", "waterproof_shoes", "waterproof_bag"],
    });
  }

  if (current.conditions.main === "snow") {
    recommendations.push({
      type: "snow",
      priority: "high",
      message: "Snow expected - wear winter gear",
      items: ["winter_boots", "winter_coat", "gloves", "hat", "scarf"],
    });
  }

  if (current.uvIndex > 6) {
    recommendations.push({
      type: "uv",
      priority: "medium",
      message: "High UV index - protect from sun",
      items: ["sunglasses", "hat", "sunscreen", "light_clothing"],
    });
  }

  if (current.wind.speed > 20) {
    recommendations.push({
      type: "wind",
      priority: "medium",
      message: "Windy conditions - secure loose clothing",
      items: ["windbreaker", "secure_hat", "layered_clothing"],
    });
  }

  return recommendations;
};

weatherSchema.methods.getComfortLevel = function () {
  const current = this.current;
  let score = 50; // Base score

  // Temperature comfort (optimal range: 18-24°C)
  const temp = current.temperature.current;
  if (temp >= 18 && temp <= 24) {
    score += 20;
  } else if (temp >= 15 && temp <= 27) {
    score += 10;
  } else if (temp < 5 || temp > 35) {
    score -= 30;
  } else {
    score -= 10;
  }

  // Humidity comfort (optimal range: 30-60%)
  const humidity = current.humidity;
  if (humidity >= 30 && humidity <= 60) {
    score += 10;
  } else if (humidity > 80) {
    score -= 15;
  } else if (humidity < 20) {
    score -= 10;
  }

  // Wind comfort
  if (current.wind.speed > 25) {
    score -= 15;
  } else if (current.wind.speed > 15) {
    score -= 5;
  }

  // UV comfort
  if (current.uvIndex > 8) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
};

weatherSchema.methods.getWeatherMood = function () {
  const current = this.current;
  const comfortLevel = this.getComfortLevel();

  if (comfortLevel >= 80) {
    return "excellent";
  } else if (comfortLevel >= 60) {
    return "good";
  } else if (comfortLevel >= 40) {
    return "fair";
  } else {
    return "poor";
  }
};

// Static methods
weatherSchema.statics.getUserWeather = function (userId, isDefault = false) {
  const query = { user: userId, isActive: true };
  if (isDefault) {
    query.isDefault = true;
  }
  return this.findOne(query).sort({ lastUpdated: -1 });
};

weatherSchema.statics.updateWeatherData = function (userId, weatherData) {
  return this.findOneAndUpdate(
    { user: userId, isActive: true },
    {
      ...weatherData,
      lastUpdated: new Date(),
    },
    { new: true, upsert: true }
  );
};

weatherSchema.statics.getWeatherHistory = function (userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.find({
    user: userId,
    isActive: true,
    lastUpdated: { $gte: startDate },
  }).sort({ lastUpdated: -1 });
};

weatherSchema.statics.getWeatherStats = function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        isActive: true,
        lastUpdated: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        averageTemperature: { $avg: "$current.temperature.current" },
        minTemperature: { $min: "$current.temperature.current" },
        maxTemperature: { $max: "$current.temperature.current" },
        averageHumidity: { $avg: "$current.humidity" },
        averageWindSpeed: { $avg: "$current.wind.speed" },
        averageUVIndex: { $avg: "$current.uvIndex" },
        mostCommonCondition: {
          $first: {
            $arrayElemAt: [
              {
                $map: {
                  input: { $objectToArray: "$current.conditions" },
                  as: "condition",
                  in: "$$condition.k",
                },
              },
              0,
            ],
          },
        },
        totalRecords: { $sum: 1 },
      },
    },
  ]);
};

weatherSchema.statics.findNearbyWeather = function (
  latitude,
  longitude,
  radiusKm = 50
) {
  return this.find({
    isActive: true,
    "location.coordinates": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: radiusKm * 1000, // Convert km to meters
      },
    },
  }).sort({ lastUpdated: -1 });
};

// Pre-save middleware
weatherSchema.pre("save", function (next) {
  // Ensure only one default location per user
  if (this.isDefault && this.isModified("isDefault")) {
    this.constructor
      .updateMany({ user: this.user, isDefault: true }, { isDefault: false })
      .exec();
  }

  // Update lastUpdated timestamp
  this.lastUpdated = new Date();
  next();
});

// Virtual for temperature in different units
weatherSchema.virtual("current.temperature.fahrenheit").get(function () {
  if (this.current.temperature.unit === "fahrenheit") {
    return this.current.temperature.current;
  }
  return (this.current.temperature.current * 9) / 5 + 32;
});

weatherSchema.virtual("current.temperature.celsius").get(function () {
  if (this.current.temperature.unit === "celsius") {
    return this.current.temperature.current;
  }
  return ((this.current.temperature.current - 32) * 5) / 9;
});

module.exports = mongoose.model("Weather", weatherSchema);
