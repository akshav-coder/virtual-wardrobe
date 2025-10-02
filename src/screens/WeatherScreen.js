import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  Text,
  FAB,
  IconButton,
  ProgressBar,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const WeatherScreen = ({ navigation }) => {
  const wardrobe = useSelector((state) => state.wardrobe.items);
  const weather = useSelector((state) => state.weather.currentWeather);
  const [selectedLocation, setSelectedLocation] = useState("New York");
  const [weatherData, setWeatherData] = useState({
    current: {
      temp: 22,
      description: "Sunny",
      icon: "sunny",
      humidity: 65,
      windSpeed: 12,
      uvIndex: 6,
    },
    forecast: [
      { day: "Today", high: 25, low: 18, description: "Sunny", icon: "sunny" },
      {
        day: "Tomorrow",
        high: 23,
        low: 16,
        description: "Partly Cloudy",
        icon: "partly-sunny",
      },
      { day: "Wed", high: 20, low: 14, description: "Rainy", icon: "rainy" },
      { day: "Thu", high: 18, low: 12, description: "Cloudy", icon: "cloudy" },
      { day: "Fri", high: 21, low: 15, description: "Sunny", icon: "sunny" },
    ],
  });

  const getWeatherIcon = (iconName) => {
    const iconMap = {
      sunny: "sunny",
      "partly-sunny": "partly-sunny",
      rainy: "rainy",
      cloudy: "cloudy",
      snowy: "snow",
      thunderstorm: "thunderstorm",
    };
    return iconMap[iconName] || "sunny";
  };

  const getWeatherRecommendations = () => {
    const temp = weatherData.current.temp;
    const description = weatherData.current.description.toLowerCase();

    let recommendations = [];

    if (temp < 10) {
      recommendations = [
        "Wear a heavy coat or jacket",
        "Layer with sweaters and long sleeves",
        "Don't forget gloves and a scarf",
        "Choose warm, insulated footwear",
      ];
    } else if (temp < 20) {
      recommendations = [
        "Light jacket or cardigan recommended",
        "Long sleeves or light layers work well",
        "Comfortable closed-toe shoes",
        "Consider a light scarf for style",
      ];
    } else {
      recommendations = [
        "Light, breathable fabrics are perfect",
        "Short sleeves or sleeveless tops",
        "Open-toe shoes or sandals",
        "Don't forget sun protection",
      ];
    }

    if (description.includes("rain")) {
      recommendations.push("Waterproof jacket or umbrella essential");
      recommendations.push("Avoid suede or leather shoes");
    }

    if (description.includes("sunny")) {
      recommendations.push("Sunglasses and hat recommended");
      recommendations.push("Light colors help stay cool");
    }

    return recommendations;
  };

  const getOutfitSuggestions = () => {
    const temp = weatherData.current.temp;
    const suitableItems = wardrobe.filter((item) => {
      if (temp < 10) {
        return item.category === "outerwear" || item.category === "dress";
      } else if (temp < 20) {
        return item.category === "top" || item.category === "dress";
      } else {
        return item.category === "top" || item.category === "dress";
      }
    });

    return suitableItems.slice(0, 6);
  };

  const CurrentWeather = () => (
    <Card style={styles.currentWeatherCard}>
      <LinearGradient
        colors={["#6366f1", "#8b5cf6"]}
        style={styles.weatherGradient}
      >
        <View style={styles.weatherHeader}>
          <View>
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString("en", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
          <IconButton
            icon="refresh"
            size={24}
            iconColor="white"
            onPress={() => {
              /* Refresh weather */
            }}
          />
        </View>

        <View style={styles.weatherMain}>
          <View style={styles.weatherInfo}>
            <Text style={styles.temperatureText}>
              {weatherData.current.temp}°C
            </Text>
            <Text style={styles.descriptionText}>
              {weatherData.current.description}
            </Text>
          </View>
          <Ionicons
            name={getWeatherIcon(weatherData.current.icon)}
            size={80}
            color="white"
          />
        </View>

        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetail}>
            <Ionicons name="water" size={16} color="white" />
            <Text style={styles.detailText}>
              {weatherData.current.humidity}%
            </Text>
            <Text style={styles.detailLabel}>Humidity</Text>
          </View>
          <View style={styles.weatherDetail}>
            <Ionicons name="leaf" size={16} color="white" />
            <Text style={styles.detailText}>
              {weatherData.current.windSpeed} km/h
            </Text>
            <Text style={styles.detailLabel}>Wind</Text>
          </View>
          <View style={styles.weatherDetail}>
            <Ionicons name="sunny" size={16} color="white" />
            <Text style={styles.detailText}>{weatherData.current.uvIndex}</Text>
            <Text style={styles.detailLabel}>UV Index</Text>
          </View>
        </View>
      </LinearGradient>
    </Card>
  );

  const Forecast = () => (
    <Card style={styles.forecastCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>5-Day Forecast</Title>
        <View style={styles.forecastList}>
          {weatherData.forecast.map((day, index) => (
            <View key={index} style={styles.forecastItem}>
              <Text style={styles.forecastDay}>{day.day}</Text>
              <Ionicons
                name={getWeatherIcon(day.icon)}
                size={24}
                color="#6366f1"
              />
              <View style={styles.forecastTemps}>
                <Text style={styles.forecastHigh}>{day.high}°</Text>
                <Text style={styles.forecastLow}>{day.low}°</Text>
              </View>
              <Text style={styles.forecastDescription}>{day.description}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const WeatherRecommendations = () => (
    <Card style={styles.recommendationsCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Weather Recommendations</Title>
        <View style={styles.recommendationsList}>
          {getWeatherRecommendations().map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const OutfitSuggestions = () => (
    <Card style={styles.suggestionsCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Suggested Items</Title>
        <View style={styles.suggestionsGrid}>
          {getOutfitSuggestions().map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => navigation.navigate("Wardrobe")}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.suggestionImage}
              />
              <Text style={styles.suggestionName} numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("Stylist")}
          style={styles.suggestionsButton}
        >
          Get More Suggestions
        </Button>
      </Card.Content>
    </Card>
  );

  const WeatherAlerts = () => (
    <Card style={styles.alertsCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Weather Alerts</Title>
        <View style={styles.alertItem}>
          <Ionicons name="warning" size={20} color="#f59e0b" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>UV Index High</Text>
            <Text style={styles.alertDescription}>
              UV index is 6. Consider wearing sunscreen and protective clothing.
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <CurrentWeather />
        <Forecast />
        <WeatherRecommendations />
        <OutfitSuggestions />
        <WeatherAlerts />
      </ScrollView>

      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={() => {
          /* Refresh weather data */
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  currentWeatherCard: {
    marginBottom: 16,
    elevation: 4,
  },
  weatherGradient: {
    padding: 20,
    borderRadius: 12,
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  locationText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: {
    color: "white",
    opacity: 0.8,
    fontSize: 14,
    marginTop: 4,
  },
  weatherMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  weatherInfo: {
    flex: 1,
  },
  temperatureText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  descriptionText: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
    marginTop: 4,
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weatherDetail: {
    alignItems: "center",
  },
  detailText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  detailLabel: {
    color: "white",
    opacity: 0.8,
    fontSize: 12,
    marginTop: 2,
  },
  forecastCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  forecastList: {
    marginTop: 8,
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  forecastDay: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  forecastTemps: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  forecastHigh: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  forecastLow: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  forecastDescription: {
    flex: 1,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
  },
  recommendationsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  recommendationsList: {
    marginTop: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  recommendationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#1f2937",
  },
  suggestionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  suggestionItem: {
    width: (width - 64) / 3,
    marginBottom: 12,
    alignItems: "center",
  },
  suggestionImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionName: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  suggestionsButton: {
    alignSelf: "center",
  },
  alertsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  alertItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  alertDescription: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    lineHeight: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6366f1",
  },
});

export default WeatherScreen;
