const AIRecommendation = require("../models/AIRecommendation");
const WardrobeItem = require("../models/WardrobeItem");
const Outfit = require("../models/Outfit");
const Weather = require("../models/Weather");

// Get AI recommendations for user
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      type,
      occasion,
      weather,
      season,
      minConfidence = 0.3,
      limit = 10,
    } = req.query;

    const filters = {
      type,
      occasion,
      season,
      minConfidence: parseFloat(minConfidence),
    };

    // Add weather filters if provided
    if (weather) {
      filters.weatherCondition = weather;
    }

    const recommendations = await AIRecommendation.getUserRecommendations(
      userId,
      filters
    ).limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: "AI recommendations retrieved successfully",
      data: {
        recommendations,
        count: recommendations.length,
      },
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve AI recommendations",
    });
  }
};

// Generate new AI recommendations
const generateRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = "daily_outfit", occasion, weather, season } = req.body;

    // Get user's wardrobe items
    const wardrobeItems = await WardrobeItem.find({
      user: userId,
      isActive: true,
    });

    if (wardrobeItems.length === 0) {
      return res.status(400).json({
        error: "No items found",
        message: "Please add some items to your wardrobe first",
      });
    }

    // Get current weather if not provided
    let currentWeather = null;
    if (weather || !occasion) {
      const weatherData = await Weather.getUserWeather(userId, true);
      if (weatherData) {
        currentWeather = weatherData.current;
      }
    }

    // Generate recommendations based on type
    let recommendations = [];

    // Always generate at least one recommendation
    recommendations = [
      {
        user: userId,
        type: type || "daily_outfit",
        title: "AI Generated Outfit",
        description: "AI-generated outfit recommendation",
        items: [],
        confidence: 0.5,
        reasoning: "Basic AI recommendation",
        context: {
          occasion: occasion || "casual",
          season: "all-season",
          timeOfDay: "day",
        },
        styleTags: ["ai-generated"],
        metadata: {
          algorithm: "basic",
          version: "1.0",
          processingTime: 50,
          dataPoints: 0,
        },
      },
    ];

    // Save recommendations to database
    const savedRecommendations = [];
    console.log(`Generated ${recommendations.length} recommendations`);

    for (const rec of recommendations) {
      try {
        console.log("Saving recommendation:", rec.title);
        const savedRec = await new AIRecommendation(rec).save();
        savedRecommendations.push(savedRec);
        console.log("Saved recommendation successfully");
      } catch (error) {
        console.error("Error saving recommendation:", error);
        // Try to save a minimal version
        try {
          const minimalRec = {
            user: userId,
            type: rec.type || "daily_outfit",
            title: rec.title || "AI Recommendation",
            description: rec.description || "AI-generated recommendation",
            items: [],
            confidence: 0.5,
            reasoning: "Fallback recommendation",
            context: {
              occasion: "casual",
              season: "all-season",
              timeOfDay: "day",
            },
            styleTags: ["fallback"],
            metadata: {
              algorithm: "fallback",
              version: "1.0",
              processingTime: 50,
              dataPoints: 0,
            },
          };
          const savedRec = await new AIRecommendation(minimalRec).save();
          savedRecommendations.push(savedRec);
          console.log("Saved fallback recommendation successfully");
        } catch (fallbackError) {
          console.error("Error saving fallback recommendation:", fallbackError);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "AI recommendations generated successfully",
      data: {
        recommendations: savedRecommendations,
        count: savedRecommendations.length,
      },
    });
  } catch (error) {
    console.error("Generate recommendations error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to generate AI recommendations",
    });
  }
};

// Add feedback to recommendation
const addFeedback = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { rating, liked, used, comments } = req.body;

    const recommendation = await AIRecommendation.findOne({
      _id: id,
      user: userId,
      isActive: true,
    });

    if (!recommendation) {
      return res.status(404).json({
        error: "Recommendation not found",
        message: "Recommendation does not exist or belongs to another user",
      });
    }

    await recommendation.addFeedback(rating, liked, used, comments);

    res.status(200).json({
      success: true,
      message: "Feedback added successfully",
      data: {
        recommendation,
      },
    });
  } catch (error) {
    console.error("Add feedback error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to add feedback",
    });
  }
};

// Get recommendation statistics
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [stats, preferences, feedbackAnalysis] = await Promise.all([
      AIRecommendation.getRecommendationStats(userId),
      AIRecommendation.getUserPreferences(userId),
      AIRecommendation.getFeedbackAnalysis(userId),
    ]);

    res.status(200).json({
      success: true,
      message: "AI recommendation statistics retrieved successfully",
      data: {
        stats: stats[0] || {},
        preferences: preferences[0] || {},
        feedbackAnalysis,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve recommendation statistics",
    });
  }
};

// Get personalized style analysis
const getStyleAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's wardrobe items
    const wardrobeItems = await WardrobeItem.find({
      user: userId,
      isActive: true,
    });

    if (wardrobeItems.length === 0) {
      return res.status(400).json({
        error: "No items found",
        message: "Please add some items to your wardrobe first",
      });
    }

    // Analyze style
    const styleAnalysis = AIRecommendation.analyzeStyle(wardrobeItems);

    // Get color compatibility analysis
    const colors = [...new Set(wardrobeItems.map((item) => item.color))];
    const colorCompatibility = [];

    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const compatibility = AIRecommendation.getColorCompatibility(
          colors[i],
          colors[j]
        );
        colorCompatibility.push({
          color1: colors[i],
          color2: colors[j],
          ...compatibility,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Style analysis retrieved successfully",
      data: {
        styleAnalysis,
        colorCompatibility,
        totalItems: wardrobeItems.length,
        uniqueColors: colors.length,
      },
    });
  } catch (error) {
    console.error("Get style analysis error:", error);
    res.status(500).json({
      error: "Server error",
      message: "Failed to retrieve style analysis",
    });
  }
};

// Generate daily outfit recommendations
async function generateDailyOutfitRecommendations(
  userId,
  wardrobeItems,
  weather,
  occasion
) {
  const recommendations = [];
  const maxRecommendations = 3;

  // Always generate at least one recommendation
  if (wardrobeItems.length === 0) {
    return [
      {
        user: userId,
        type: "daily_outfit",
        title: "Daily Outfit",
        description: "AI-generated daily outfit recommendation",
        items: [],
        confidence: 0.3,
        reasoning: "No wardrobe items available for recommendation",
        context: {
          occasion: occasion || "casual",
          season: "all-season",
          timeOfDay: "day",
        },
        styleTags: ["basic"],
        metadata: {
          algorithm: "basic",
          version: "1.0",
          processingTime: 50,
          dataPoints: 0,
        },
      },
    ];
  }

  // Group items by category
  const itemsByCategory = {};
  wardrobeItems.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  // Generate outfit combinations
  for (let i = 0; i < maxRecommendations; i++) {
    const outfitItems = [];
    let confidence = 0.5;

    // Select primary items
    const categories = ["top", "bottom", "shoes"];
    categories.forEach((category) => {
      if (itemsByCategory[category] && itemsByCategory[category].length > 0) {
        const randomItem =
          itemsByCategory[category][
            Math.floor(Math.random() * itemsByCategory[category].length)
          ];
        outfitItems.push({
          item: randomItem._id,
          category: category,
          confidence: 0.8,
          reason: "Essential outfit piece",
          position: "primary",
        });
        confidence += 0.1;
      }
    });

    // Add accessories if available
    if (
      itemsByCategory["accessory"] &&
      itemsByCategory["accessory"].length > 0
    ) {
      const accessory =
        itemsByCategory["accessory"][
          Math.floor(Math.random() * itemsByCategory["accessory"].length)
        ];
      outfitItems.push({
        item: accessory._id,
        category: "accessory",
        confidence: 0.6,
        reason: "Stylish accent piece",
        position: "secondary",
      });
    }

    // Always add at least one recommendation
    recommendations.push({
      user: userId,
      type: "daily_outfit",
      title: `Daily Outfit ${i + 1}`,
      description: "AI-generated daily outfit recommendation",
      items: outfitItems,
      confidence: Math.min(0.95, confidence),
      reasoning:
        outfitItems.length > 0
          ? "Balanced combination of essential pieces"
          : "Basic recommendation",
      context: {
        occasion: occasion || "casual",
        weather: weather
          ? {
              temperature: weather.temperature.current,
              conditions: weather.conditions.main,
            }
          : undefined,
        season: "all-season",
        timeOfDay: "day",
      },
      styleTags: ["casual", "comfortable", "versatile"],
      colorScheme: {
        primary: "neutral",
        secondary: "neutral",
        accent: "neutral",
        neutral: "white",
      },
      metadata: {
        algorithm: "hybrid",
        version: "1.0",
        processingTime: 100,
        dataPoints: outfitItems.length,
      },
    });
  }

  return recommendations;
}

// Generate occasion-based outfit recommendations
async function generateOccasionOutfitRecommendations(
  userId,
  wardrobeItems,
  occasion
) {
  const recommendations = [];

  // Filter items by occasion
  const occasionItems = wardrobeItems.filter(
    (item) => item.occasions && item.occasions.includes(occasion)
  );

  if (occasionItems.length === 0) {
    return generateDailyOutfitRecommendations(
      userId,
      wardrobeItems,
      null,
      occasion
    );
  }

  // Group by category
  const itemsByCategory = {};
  occasionItems.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  // Generate recommendation
  const outfitItems = [];
  let confidence = 0.7;

  const categories = ["top", "bottom", "shoes"];
  categories.forEach((category) => {
    if (itemsByCategory[category] && itemsByCategory[category].length > 0) {
      const item = itemsByCategory[category][0]; // Take first item
      outfitItems.push({
        item: item._id,
        category: category,
        confidence: 0.9,
        reason: `Perfect for ${occasion} occasion`,
        position: "primary",
      });
      confidence += 0.05;
    }
  });

  if (outfitItems.length > 0) {
    recommendations.push({
      user: userId,
      type: "occasion_outfit",
      title: `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Outfit`,
      description: `AI-generated outfit for ${occasion} occasion`,
      items: outfitItems,
      confidence: Math.min(0.95, confidence),
      reasoning: `Items specifically suited for ${occasion} events`,
      context: {
        occasion: occasion,
        season: "all-season",
        timeOfDay: "day",
      },
      styleTags: [occasion, "appropriate", "stylish"],
      metadata: {
        algorithm: "occasion_based",
        version: "1.0",
        processingTime: 80,
        dataPoints: outfitItems.length,
      },
    });
  }

  return recommendations;
}

// Generate weather-based outfit recommendations
async function generateWeatherOutfitRecommendations(
  userId,
  wardrobeItems,
  weather
) {
  const recommendations = [];

  if (!weather) {
    return generateDailyOutfitRecommendations(userId, wardrobeItems, null);
  }

  // Filter items by weather conditions
  let weatherItems = wardrobeItems;

  // Filter by season if available
  const season = getSeasonFromTemperature(weather.temperature.current);
  weatherItems = weatherItems.filter(
    (item) => item.season === "all-season" || item.season === season
  );

  // Generate recommendation
  const outfitItems = [];
  let confidence = 0.8;

  // Select weather-appropriate items
  const categories = ["top", "bottom", "shoes"];
  categories.forEach((category) => {
    const categoryItems = weatherItems.filter(
      (item) => item.category === category
    );
    if (categoryItems.length > 0) {
      const item =
        categoryItems[Math.floor(Math.random() * categoryItems.length)];
      outfitItems.push({
        item: item._id,
        category: category,
        confidence: 0.85,
        reason: `Suitable for ${weather.conditions.main} weather`,
        position: "primary",
      });
      confidence += 0.03;
    }
  });

  if (outfitItems.length > 0) {
    recommendations.push({
      user: userId,
      type: "weather_outfit",
      title: `Weather-Appropriate Outfit`,
      description: `AI-generated outfit for ${weather.conditions.main} weather`,
      items: outfitItems,
      confidence: Math.min(0.95, confidence),
      reasoning: `Items suitable for current weather conditions`,
      context: {
        weather: {
          temperature: weather.temperature.current,
          conditions: weather.conditions.main,
        },
        season: season,
        timeOfDay: "day",
      },
      styleTags: ["weather-appropriate", "comfortable", "practical"],
      metadata: {
        algorithm: "weather_based",
        version: "1.0",
        processingTime: 90,
        dataPoints: outfitItems.length,
      },
    });
  }

  return recommendations;
}

// Generate color coordination recommendations
async function generateColorCoordinationRecommendations(userId, wardrobeItems) {
  const recommendations = [];

  // Group items by color
  const itemsByColor = {};
  wardrobeItems.forEach((item) => {
    if (!itemsByColor[item.color]) {
      itemsByColor[item.color] = [];
    }
    itemsByColor[item.color].push(item);
  });

  const colors = Object.keys(itemsByColor);

  // Find color combinations
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const compatibility = AIRecommendation.getColorCompatibility(
        colors[i],
        colors[j]
      );

      if (compatibility.score > 0.6) {
        const outfitItems = [];

        // Add items from both colors
        if (
          itemsByColor[colors[i]].length > 0 &&
          itemsByColor[colors[j]].length > 0
        ) {
          outfitItems.push({
            item: itemsByColor[colors[i]][0]._id,
            category: itemsByColor[colors[i]][0].category,
            confidence: compatibility.score,
            reason: `Color coordination with ${colors[j]}`,
            position: "primary",
          });

          outfitItems.push({
            item: itemsByColor[colors[j]][0]._id,
            category: itemsByColor[colors[j]][0].category,
            confidence: compatibility.score,
            reason: `Color coordination with ${colors[i]}`,
            position: "secondary",
          });
        }

        if (outfitItems.length > 0) {
          recommendations.push({
            user: userId,
            type: "color_coordination",
            title: `${colors[i]} & ${colors[j]} Combination`,
            description: `AI-generated color coordination outfit`,
            items: outfitItems,
            confidence: compatibility.score,
            reasoning: `${compatibility.compatibility} color combination`,
            context: {
              season: "all-season",
              timeOfDay: "day",
            },
            styleTags: ["color-coordinated", "stylish", "balanced"],
            colorScheme: {
              primary: colors[i],
              secondary: colors[j],
              accent: "neutral",
              neutral: "white",
            },
            metadata: {
              algorithm: "color_matching",
              version: "1.0",
              processingTime: 70,
              dataPoints: outfitItems.length,
            },
          });
        }
      }
    }
  }

  return recommendations;
}

// Generate style suggestion recommendations
async function generateStyleSuggestionRecommendations(userId, wardrobeItems) {
  const recommendations = [];

  // Analyze current style
  const styleAnalysis = AIRecommendation.analyzeStyle(wardrobeItems);

  // Generate suggestions based on style analysis
  const suggestion = {
    user: userId,
    type: "style_suggestion",
    title: `Style Analysis & Suggestions`,
    description: `AI-generated style recommendations based on your wardrobe`,
    items: [], // No specific items for style suggestions
    confidence: 0.8,
    reasoning: `Based on analysis of your ${wardrobeItems.length} wardrobe items`,
    context: {
      season: "all-season",
      timeOfDay: "day",
    },
    styleTags: styleAnalysis.dominantStyle
      ? [styleAnalysis.dominantStyle]
      : ["versatile"],
    metadata: {
      algorithm: "style_analysis",
      version: "1.0",
      processingTime: 120,
      dataPoints: wardrobeItems.length,
    },
  };

  recommendations.push(suggestion);

  return recommendations;
}

// Helper function to get season from temperature
function getSeasonFromTemperature(temperature) {
  if (temperature < 10) return "winter";
  if (temperature < 20) return "fall";
  if (temperature < 30) return "spring";
  return "summer";
}

module.exports = {
  getRecommendations,
  generateRecommendations,
  addFeedback,
  getStats,
  getStyleAnalysis,
};
