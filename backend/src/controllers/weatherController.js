const Weather = require("../models/Weather");
const Outfit = require("../models/Outfit");
const axios = require("axios");

// Weather API configuration (using OpenWeatherMap as example)
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "demo";
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// Get current weather for user
const getCurrentWeather = async (req, res) => {
  try {
    const userId = req.user._id;
    const { forceRefresh = false } = req.query;

    let weather = await Weather.getUserWeather(userId, true);

    // Check if we need to refresh the data
    const shouldRefresh =
      forceRefresh === "true" ||
      !weather ||
      Date.now() - weather.lastUpdated.getTime() > 30 * 60 * 1000; // 30 minutes

    if (shouldRefresh && weather && weather.location) {
      try {
        const freshWeather = await fetchWeatherData(
          weather.location.coordinates.latitude,
          weather.location.coordinates.longitude
        );

        weather = await Weather.updateWeatherData(userId, {
          ...freshWeather,
          user: userId,
          location: weather.location,
          isDefault: true,
        });
      } catch (apiError) {
        console.error("Weather API error:", apiError);
        // Return cached data if API fails
        if (weather) {
          return res.status(200).json({
            success: true,
            message: "Weather data retrieved (cached)",
            data: {
              weather,
              cached: true,
            },
          });
        }
      }
    }

    if (!weather) {
      return res.status(404).json({
        error: "Weather not found",
        message: "No weather data available. Please set your location first.",
      });
    }

    // Add recommendations
    const recommendations = weather.getOutfitRecommendations();
    const comfortLevel = weather.getComfortLevel();
    const weatherMood = weather.getWeatherMood();

    res.status(200).json({
      success: true,
      message: "Current weather retrieved successfully",
      data: {
        weather,
        recommendations,
        comfortLevel,
        weatherMood,
        cached: !shouldRefresh,
      },
    });
  } catch (error) {
    console.error("Get current weather error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve weather data",
    });
  }
};

// Set user location and fetch weather
const setLocation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { latitude, longitude, name, isDefault = true } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        error: "Missing coordinates",
        message: "Latitude and longitude are required",
      });
    }

    // Fetch weather data for the new location
    const weatherData = await fetchWeatherData(latitude, longitude);

    const locationData = {
      name: name || "Custom Location",
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    };

    const weather = await Weather.updateWeatherData(userId, {
      ...weatherData,
      user: userId,
      location: locationData,
      isDefault,
    });

    res.status(200).json({
      success: true,
      message: "Location set and weather data updated",
      data: {
        weather,
      },
    });
  } catch (error) {
    console.error("Set location error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to set location and fetch weather",
    });
  }
};

// Get weather-based outfit recommendations
const getOutfitRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { latitude, longitude } = req.query;

    let weather;

    if (latitude && longitude) {
      // Get weather for specific coordinates
      weather = await fetchWeatherData(latitude, longitude);
    } else {
      // Get user's default weather
      weather = await Weather.getUserWeather(userId, true);
      if (!weather) {
        return res.status(404).json({
          error: "Weather not found",
          message: "No weather data available. Please set your location first.",
        });
      }
    }

    // Get outfit recommendations from weather
    const weatherRecommendations = weather.getOutfitRecommendations();

    // Get compatible outfits from user's wardrobe
    const compatibleOutfits = await Outfit.getWeatherBasedOutfits(
      userId,
      weather.current.temperature.current,
      [weather.current.conditions.main]
    );

    res.status(200).json({
      success: true,
      message: "Weather-based outfit recommendations retrieved",
      data: {
        weather: weather.current,
        recommendations: weatherRecommendations,
        compatibleOutfits,
        comfortLevel: weather.getComfortLevel(),
        weatherMood: weather.getWeatherMood(),
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

// Get weather forecast
const getForecast = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 5 } = req.query;

    const weather = await Weather.getUserWeather(userId, true);

    if (!weather) {
      return res.status(404).json({
        error: "Weather not found",
        message: "No weather data available. Please set your location first.",
      });
    }

    // For demo purposes, generate forecast data
    // In production, you would fetch this from the weather API
    const forecast = generateForecastData(weather.current, parseInt(days));

    res.status(200).json({
      success: true,
      message: "Weather forecast retrieved successfully",
      data: {
        location: weather.location,
        forecast,
        lastUpdated: weather.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Get forecast error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve weather forecast",
    });
  }
};

// Get weather alerts
const getAlerts = async (req, res) => {
  try {
    const userId = req.user._id;

    const weather = await Weather.getUserWeather(userId, true);

    if (!weather) {
      return res.status(404).json({
        error: "Weather not found",
        message: "No weather data available. Please set your location first.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Weather alerts retrieved successfully",
      data: {
        alerts: weather.alerts || [],
        location: weather.location,
        lastUpdated: weather.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Get alerts error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve weather alerts",
    });
  }
};

// Get weather history
const getWeatherHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 7 } = req.query;

    const history = await Weather.getWeatherHistory(userId, parseInt(days));

    res.status(200).json({
      success: true,
      message: "Weather history retrieved successfully",
      data: {
        history,
        days: parseInt(days),
      },
    });
  } catch (error) {
    console.error("Get weather history error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve weather history",
    });
  }
};

// Get weather statistics
const getWeatherStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;

    const stats = await Weather.getWeatherStats(userId, parseInt(days));

    res.status(200).json({
      success: true,
      message: "Weather statistics retrieved successfully",
      data: {
        stats: stats[0] || {},
        period: `${parseInt(days)} days`,
      },
    });
  } catch (error) {
    console.error("Get weather stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve weather statistics",
    });
  }
};

// Refresh weather data
const refreshWeather = async (req, res) => {
  try {
    const userId = req.user._id;

    const weather = await Weather.getUserWeather(userId, true);

    if (!weather) {
      return res.status(404).json({
        error: "Weather not found",
        message: "No weather data available. Please set your location first.",
      });
    }

    const freshWeather = await fetchWeatherData(
      weather.location.coordinates.latitude,
      weather.location.coordinates.longitude
    );

    const updatedWeather = await Weather.updateWeatherData(userId, {
      ...freshWeather,
      user: userId,
      location: weather.location,
      isDefault: true,
    });

    res.status(200).json({
      success: true,
      message: "Weather data refreshed successfully",
      data: {
        weather: updatedWeather,
      },
    });
  } catch (error) {
    console.error("Refresh weather error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to refresh weather data",
    });
  }
};

// Helper function to fetch weather data from external API
async function fetchWeatherData(latitude, longitude) {
  try {
    // Demo data - replace with actual API call
    if (WEATHER_API_KEY === "demo") {
      return generateDemoWeatherData(latitude, longitude);
    }

    const response = await axios.get(`${WEATHER_API_BASE_URL}/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });

    const data = response.data;

    return {
      current: {
        temperature: {
          current: data.main.temp,
          min: data.main.temp_min,
          max: data.main.temp_max,
          feelsLike: data.main.feels_like,
          unit: "celsius",
        },
        humidity: data.main.humidity,
        wind: {
          speed: data.wind.speed,
          direction: data.wind.deg,
        },
        pressure: data.main.pressure,
        visibility: data.visibility,
        uvIndex: 0, // Would need separate API call
        conditions: {
          main: data.weather[0].main.toLowerCase(),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        },
        precipitation: {
          probability: 0, // Would need separate API call
          amount: 0,
        },
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
      },
    };
  } catch (error) {
    console.error("Weather API fetch error:", error);
    // Return demo data if API fails
    return generateDemoWeatherData(latitude, longitude);
  }
}

// Generate demo weather data
function generateDemoWeatherData(latitude, longitude) {
  const conditions = ["clear", "clouds", "rain", "snow"];
  const randomCondition =
    conditions[Math.floor(Math.random() * conditions.length)];

  return {
    current: {
      temperature: {
        current: Math.round(Math.random() * 30 + 5), // 5-35°C
        min: Math.round(Math.random() * 10 + 0), // 0-10°C
        max: Math.round(Math.random() * 15 + 20), // 20-35°C
        feelsLike: Math.round(Math.random() * 30 + 5),
        unit: "celsius",
      },
      humidity: Math.round(Math.random() * 50 + 30), // 30-80%
      wind: {
        speed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
        direction: Math.round(Math.random() * 360),
      },
      pressure: Math.round(Math.random() * 100 + 1000), // 1000-1100 hPa
      visibility: Math.round(Math.random() * 5 + 5), // 5-10 km
      uvIndex: Math.round(Math.random() * 11), // 0-11
      conditions: {
        main: randomCondition,
        description: `${randomCondition} conditions`,
        icon: `01d`,
      },
      precipitation: {
        probability: Math.round(Math.random() * 100),
        amount: Math.round(Math.random() * 10),
        type: randomCondition === "rain" ? "rain" : "snow",
      },
      sunrise: new Date(Date.now() + Math.random() * 86400000),
      sunset: new Date(Date.now() + Math.random() * 86400000),
    },
  };
}

// Generate forecast data
function generateForecastData(currentWeather, days) {
  const forecast = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    forecast.push({
      date,
      day: {
        temperature: {
          current:
            currentWeather.temperature.current +
            Math.round(Math.random() * 10 - 5),
          min:
            currentWeather.temperature.min + Math.round(Math.random() * 5 - 2),
          max:
            currentWeather.temperature.max + Math.round(Math.random() * 5 - 2),
        },
        conditions: {
          main: currentWeather.conditions.main,
          description: currentWeather.conditions.description,
        },
        precipitation: {
          probability: Math.round(Math.random() * 100),
        },
      },
      night: {
        temperature: {
          current:
            currentWeather.temperature.current -
            Math.round(Math.random() * 10 + 5),
        },
        conditions: {
          main: currentWeather.conditions.main,
          description: currentWeather.conditions.description,
        },
      },
    });
  }

  return forecast;
}

module.exports = {
  getCurrentWeather,
  setLocation,
  getOutfitRecommendations,
  getForecast,
  getAlerts,
  getWeatherHistory,
  getWeatherStats,
  refreshWeather,
};
