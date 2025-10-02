import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  Text,
  Avatar,
  Badge,
  FAB,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const wardrobe = useSelector((state) => state.wardrobe.items);
  const outfits = useSelector((state) => state.outfits.outfits);
  const weather = useSelector((state) => state.weather.currentWeather);
  const preferences = useSelector((state) => state.preferences.settings);
  const [todaysOutfit, setTodaysOutfit] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [quickStats, setQuickStats] = useState({
    totalItems: 0,
    totalOutfits: 0,
    favoriteItems: 0,
  });

  useEffect(() => {
    setQuickStats({
      totalItems: wardrobe.length,
      totalOutfits: outfits.length,
      favoriteItems: wardrobe.filter((item) => item.isFavorite).length,
    });
  }, [wardrobe, outfits]);

  const generateTodaysOutfit = () => {
    if (wardrobe.length === 0) return null;

    const tops = wardrobe.filter((item) => item.category === "top");
    const bottoms = wardrobe.filter((item) => item.category === "bottom");
    const shoes = wardrobe.filter((item) => item.category === "shoes");
    const accessories = wardrobe.filter(
      (item) => item.category === "accessory"
    );

    const outfit = {
      id: "today-" + Date.now(),
      name: "Today's Look",
      items: [
        tops[Math.floor(Math.random() * tops.length)],
        bottoms[Math.floor(Math.random() * bottoms.length)],
        shoes[Math.floor(Math.random() * shoes.length)],
        accessories[Math.floor(Math.random() * accessories.length)],
      ].filter(Boolean),
      weather: weather?.description || "sunny",
      temperature: weather?.temp || 22,
      createdAt: new Date().toISOString(),
    };

    setTodaysOutfit(outfit);
    return outfit;
  };

  const onRefresh = () => {
    setRefreshing(true);
    generateTodaysOutfit();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const QuickActionCard = ({
    icon,
    title,
    subtitle,
    onPress,
    color = "#6366f1",
    gradient = ["#6366f1", "#8b5cf6"],
  }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionCard}>
      <LinearGradient colors={gradient} style={styles.quickActionGradient}>
        <View style={styles.quickActionContent}>
          <View style={styles.quickActionIconContainer}>
            <Ionicons name={icon} size={28} color="white" />
          </View>
          <View style={styles.quickActionText}>
            <Text style={styles.quickActionTitle}>{title}</Text>
            <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
          </View>
          <Ionicons
            name="arrow-forward"
            size={20}
            color="rgba(255,255,255,0.7)"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const WeatherCard = () => (
    <Card style={styles.weatherCard}>
      <LinearGradient
        colors={["#0ea5e9", "#3b82f6"]}
        style={styles.weatherGradient}
      >
        <View style={styles.weatherHeader}>
          <View>
            <Text style={styles.weatherLocation}>
              {weather?.location || "New York"}
            </Text>
            <Text style={styles.weatherDescription}>
              {weather?.description || "Sunny"}
            </Text>
          </View>
          <Ionicons name="partly-sunny" size={40} color="white" />
        </View>
        <View style={styles.weatherTemp}>
          <Text style={styles.weatherTempText}>{weather?.temp || 22}°</Text>
          <Text style={styles.weatherFeelsLike}>
            Feels like {weather?.feelsLike || 24}°
          </Text>
        </View>
        <View style={styles.weatherDetails}>
          <View style={styles.weatherDetail}>
            <Ionicons name="water" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.weatherDetailText}>
              {weather?.humidity || 65}%
            </Text>
          </View>
          <View style={styles.weatherDetail}>
            <Ionicons name="leaf" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.weatherDetailText}>
              {weather?.windSpeed || 12} km/h
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Card>
  );

  const StatsCard = ({ title, value, icon, color, trend }) => (
    <Card style={styles.statsCard}>
      <Card.Content style={styles.statsContent}>
        <View style={styles.statsHeader}>
          <View
            style={[
              styles.statsIconContainer,
              { backgroundColor: color + "20" },
            ]}
          >
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <Text style={styles.statsValue}>{value}</Text>
        </View>
        <Text style={styles.statsTitle}>{title}</Text>
        {trend && (
          <View style={styles.statsTrend}>
            <Ionicons name="trending-up" size={14} color="#10b981" />
            <Text style={styles.statsTrendText}>{trend}</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const TodaysOutfitCard = () => {
    if (!todaysOutfit || todaysOutfit.items.length === 0) {
      return (
        <Card style={styles.outfitCard}>
          <Card.Content style={styles.outfitContent}>
            <View style={styles.outfitEmpty}>
              <Ionicons name="shirt" size={48} color="#9ca3af" />
              <Text style={styles.outfitEmptyTitle}>No outfit generated</Text>
              <Text style={styles.outfitEmptySubtitle}>
                Add items to your wardrobe to get outfit suggestions
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate("AddItem")}
                style={styles.outfitEmptyButton}
                icon="plus"
              >
                Add Items
              </Button>
            </View>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.outfitCard}>
        <Card.Content style={styles.outfitContent}>
          <View style={styles.outfitHeader}>
            <View>
              <Text style={styles.outfitTitle}>Today's Look</Text>
              <Text style={styles.outfitSubtitle}>
                {todaysOutfit.items.length} items • {todaysOutfit.weather}
              </Text>
            </View>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Main", { screen: "Planner" })}
              style={styles.outfitButton}
              compact
            >
              View All
            </Button>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.outfitItems}
          >
            {todaysOutfit.items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.outfitItem}
                onPress={() => console.log("Item tapped:", item.name)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.outfitItemImage}
                />
                <Text style={styles.outfitItemName} numberOfLines={1}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>
    );
  };

  const RecentActivityItem = ({ activity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons name={activity.icon} size={20} color={activity.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>{activity.text}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good morning!</Text>
              <Text style={styles.userName}>Ready to style today?</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.profileButton}
            >
              <Avatar.Text
                size={40}
                label="U"
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Compact Weather Info */}
        <View style={styles.weatherContainer}>
          <Card style={styles.weatherCardCompact}>
            <Card.Content style={styles.weatherContentCompact}>
              <View style={styles.weatherInfo}>
                <Ionicons name="partly-sunny" size={24} color="#6366f1" />
                <View style={styles.weatherText}>
                  <Text style={styles.weatherTempCompact}>
                    {weather?.temp || 22}° {weather?.description || "Sunny"}
                  </Text>
                  <Text style={styles.weatherLocationCompact}>
                    {weather?.location || "New York"}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatsCard
            title="Total Items"
            value={quickStats.totalItems}
            icon="shirt"
            color="#6366f1"
            trend="+2 this week"
          />
          <StatsCard
            title="Outfits"
            value={quickStats.totalOutfits}
            icon="sparkles"
            color="#8b5cf6"
            trend="+1 today"
          />
          <StatsCard
            title="Favorites"
            value={quickStats.favoriteItems}
            icon="heart"
            color="#ec4899"
          />
          <StatsCard
            title="Style Score"
            value="85"
            icon="star"
            color="#f59e0b"
            trend="+5 this month"
          />
        </View>

        {/* Today's Outfit */}
        <View style={styles.outfitContainer}>
          <Text style={styles.sectionTitle}>Today's Outfit</Text>
          <TodaysOutfitCard />
        </View>

        {/* Upcoming Outfits */}
        <View style={styles.outfitContainer}>
          <Text style={styles.sectionTitle}>Upcoming Outfits</Text>
          <Card style={styles.upcomingOutfitsCard}>
            <Card.Content style={styles.upcomingOutfitsContent}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.upcomingOutfitsScroll}
              >
                {outfits.slice(0, 3).map((outfit, index) => (
                  <TouchableOpacity
                    key={outfit.id}
                    style={styles.upcomingOutfitItem}
                    onPress={() => console.log("Outfit tapped:", outfit.name)}
                  >
                    <View style={styles.upcomingOutfitHeader}>
                      <Text style={styles.upcomingOutfitName}>
                        {outfit.name}
                      </Text>
                      <Text style={styles.upcomingOutfitDate}>
                        {index === 0
                          ? "Today"
                          : index === 1
                          ? "Tomorrow"
                          : "This Week"}
                      </Text>
                    </View>
                    <View style={styles.upcomingOutfitItems}>
                      {outfit.items.slice(0, 3).map((item, itemIndex) => (
                        <Image
                          key={itemIndex}
                          source={{ uri: item.image }}
                          style={styles.upcomingOutfitItemImage}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Button
                mode="outlined"
                onPress={() =>
                  navigation.navigate("Main", { screen: "Planner" })
                }
                style={styles.viewAllOutfitsButton}
                compact
              >
                View All Outfits
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              icon="add"
              title="Add Item"
              subtitle="Add new clothing"
              onPress={() => navigation.navigate("AddItem")}
              gradient={["#10b981", "#059669"]}
            />
            <QuickActionCard
              icon="calendar"
              title="Plan Outfit"
              subtitle="Schedule outfits"
              onPress={() => navigation.navigate("Main", { screen: "Planner" })}
              gradient={["#f59e0b", "#d97706"]}
            />
            <QuickActionCard
              icon="sparkles"
              title="AI Stylist"
              subtitle="Get recommendations"
              onPress={() => navigation.navigate("Stylist")}
              gradient={["#8b5cf6", "#7c3aed"]}
            />
            <QuickActionCard
              icon="shirt"
              title="Wardrobe"
              subtitle="Browse items"
              onPress={() => navigation.navigate("Wardrobe")}
              gradient={["#ef4444", "#dc2626"]}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            <Card.Content>
              <RecentActivityItem
                activity={{
                  icon: "add-circle",
                  color: "#10b981",
                  text: "Added Black Ankle Boots",
                  time: "2 hours ago",
                }}
              />
              <RecentActivityItem
                activity={{
                  icon: "sparkles",
                  color: "#8b5cf6",
                  text: "Got AI recommendation",
                  time: "Yesterday",
                }}
              />
              <RecentActivityItem
                activity={{
                  icon: "calendar",
                  color: "#f59e0b",
                  text: "Planned weekend outfit",
                  time: "2 days ago",
                }}
              />
              <RecentActivityItem
                activity={{
                  icon: "heart",
                  color: "#ec4899",
                  text: "Added to favorites",
                  time: "3 days ago",
                }}
              />
            </Card.Content>
          </Card>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="camera"
        style={styles.fab}
        onPress={() => navigation.navigate("AddItem")}
        label="Add Item"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  profileButton: {
    borderRadius: 20,
  },
  avatar: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  avatarLabel: {
    color: "white",
    fontWeight: "bold",
  },
  weatherContainer: {
    paddingHorizontal: 20,
    marginTop: -15,
    marginBottom: 20,
  },
  weatherCardCompact: {
    borderRadius: 12,
    elevation: 2,
  },
  weatherContentCompact: {
    padding: 12,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherText: {
    marginLeft: 12,
  },
  weatherTempCompact: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  weatherLocationCompact: {
    fontSize: 12,
    color: "#6b7280",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statsCard: {
    width: (width - 52) / 2,
    borderRadius: 12,
    elevation: 2,
  },
  statsContent: {
    padding: 16,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statsTitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  statsTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statsTrendText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },
  outfitContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  upcomingOutfitsCard: {
    borderRadius: 12,
    elevation: 2,
  },
  upcomingOutfitsContent: {
    padding: 16,
  },
  upcomingOutfitsScroll: {
    marginBottom: 12,
  },
  upcomingOutfitItem: {
    marginRight: 12,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    minWidth: 140,
  },
  upcomingOutfitHeader: {
    marginBottom: 8,
  },
  upcomingOutfitName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 2,
  },
  upcomingOutfitDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  upcomingOutfitItems: {
    flexDirection: "row",
    gap: 4,
  },
  upcomingOutfitItemImage: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  viewAllOutfitsButton: {
    borderRadius: 8,
    alignSelf: "center",
  },
  outfitCard: {
    borderRadius: 16,
    elevation: 4,
  },
  outfitContent: {
    padding: 20,
  },
  outfitEmpty: {
    alignItems: "center",
    paddingVertical: 20,
  },
  outfitEmptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 12,
    marginBottom: 4,
  },
  outfitEmptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  outfitEmptyButton: {
    borderRadius: 8,
  },
  outfitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  outfitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  outfitSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  outfitButton: {
    borderRadius: 8,
  },
  outfitItems: {
    flexDirection: "row",
  },
  outfitItem: {
    marginRight: 12,
    alignItems: "center",
  },
  outfitItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 6,
  },
  outfitItemName: {
    fontSize: 12,
    color: "#374151",
    textAlign: "center",
    maxWidth: 60,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    borderRadius: 12,
    elevation: 2,
  },
  quickActionGradient: {
    borderRadius: 12,
    padding: 16,
  },
  quickActionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    borderRadius: 12,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  bottomSpacing: {
    height: 120,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 20,
    backgroundColor: "#6366f1",
  },
});

export default HomeScreen;
