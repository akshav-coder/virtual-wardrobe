import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
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
  Switch,
  Divider,
  List,
  IconButton,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { updatePreferences } from "../store/slices/preferencesSlice";
import { startTour } from "../store/slices/tourSlice";
import { logout } from "../store/slices/userSlice";

const { width } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.user);
  const wardrobe = useSelector((state) => state.wardrobe.items);
  const outfits = useSelector((state) => state.outfits.outfits);
  const preferences = useSelector((state) => state.preferences.settings);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    preferences.notifications
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleNotificationToggle = (value) => {
    setNotificationsEnabled(value);
    dispatch(updatePreferences({ notifications: value }));
  };

  const handleStartTour = () => {
    dispatch(startTour());
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout? You will need to sign in again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            dispatch(logout());
            // The App.js will automatically show Login screen due to authentication state change
          },
        },
      ]
    );
  };

  const ProfileHeader = () => (
    <LinearGradient
      colors={["#6366f1", "#8b5cf6", "#ec4899"]}
      style={styles.profileHeader}
    >
      <View style={styles.profileContent}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={80}
            source={{
              uri:
                user?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            }}
            style={styles.avatar}
          />
          <View style={styles.onlineIndicator} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.name || "User"}</Text>
          <Text style={styles.userEmail}>
            {user?.email || "user@example.com"}
          </Text>
          <View style={styles.memberSince}>
            <Ionicons name="calendar" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.memberSinceText}>
              Member since{" "}
              {new Date(user?.createdAt || "2024-01-01").toLocaleDateString(
                "en-US",
                { month: "long", year: "numeric" }
              )}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Ionicons name="create" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const StatsCard = ({ title, value, icon, color, subtitle }) => (
    <Card style={styles.statsCard}>
      <Card.Content style={styles.statsContent}>
        <View style={[styles.statsIcon, { backgroundColor: color + "20" }]}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <View style={styles.statsText}>
          <Text style={styles.statsValue}>{value}</Text>
          <Text style={styles.statsTitle}>{title}</Text>
          {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
        </View>
      </Card.Content>
    </Card>
  );

  const ActivityItem = ({ activity }) => (
    <View style={styles.activityItem}>
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: activity.color + "20" },
        ]}
      >
        <Ionicons name={activity.icon} size={20} color={activity.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>{activity.text}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </View>
  );

  const WardrobeInsights = () => (
    <Card style={styles.insightsCard}>
      <Card.Content>
        <View style={styles.insightsHeader}>
          <Text style={styles.insightsTitle}>Wardrobe Insights</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Stylist")}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.insightsGrid}>
          <View style={styles.insightItem}>
            <Text style={styles.insightValue}>
              {user?.stats?.styleScore || 85}
            </Text>
            <Text style={styles.insightLabel}>Style Score</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightValue}>
              {user?.stats?.diversityScore || 78}
            </Text>
            <Text style={styles.insightLabel}>Diversity</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightValue}>
              {user?.stats?.totalValue || 2450}
            </Text>
            <Text style={styles.insightLabel}>Total Value</Text>
          </View>
        </View>

        <View style={styles.topCategories}>
          <Text style={styles.categoriesTitle}>Top Categories</Text>
          <View style={styles.categoriesList}>
            {Object.entries(user?.wardrobe?.categories || {})
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([category, count]) => (
                <Chip
                  key={category}
                  style={styles.categoryChip}
                  textStyle={styles.categoryChipText}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} (
                  {count})
                </Chip>
              ))}
          </View>
        </View>
      </Card.Content>
    </Card>
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
        {/* Profile Header */}
        <ProfileHeader />

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Items"
            value={user?.stats?.totalItems || wardrobe?.length || 0}
            icon="shirt"
            color="#6366f1"
            subtitle="in wardrobe"
          />
          <StatsCard
            title="Outfits"
            value={user?.stats?.totalOutfits || outfits?.length || 0}
            icon="sparkles"
            color="#8b5cf6"
            subtitle="created"
          />
          <StatsCard
            title="Favorites"
            value={
              user?.stats?.favoriteItems ||
              wardrobe?.filter((item) => item.isFavorite)?.length ||
              0
            }
            icon="heart"
            color="#ec4899"
            subtitle="loved items"
          />
        </View>

        {/* Wardrobe Insights */}
        <View style={styles.insightsContainer}>
          <WardrobeInsights />
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.settingsCard}>
            <Card.Content>
              <List.Item
                title="Notifications"
                description="Get notified about outfit suggestions"
                left={(props) => <List.Icon {...props} icon="bell" />}
                right={() => (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={handleNotificationToggle}
                    color="#6366f1"
                  />
                )}
              />
              <Divider />
              <List.Item
                title="Style Preferences"
                description="Manage your style settings"
                left={(props) => <List.Icon {...props} icon="palette" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => navigation.navigate("Settings")}
              />
              <Divider />
              <List.Item
                title="Logout"
                description="Sign out of your account"
                left={(props) => <List.Icon {...props} icon="logout" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={handleLogout}
                titleStyle={{ color: "#ef4444" }}
              />
            </Card.Content>
          </Card>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            <Card.Content>
              {(
                user?.recentActivity || [
                  {
                    id: "1",
                    type: "item_added",
                    message: "Added Black Ankle Boots to wardrobe",
                    timestamp: "2024-01-24T14:30:00Z",
                  },
                  {
                    id: "2",
                    type: "outfit_created",
                    message: "Created 'Winter Layers' outfit",
                    timestamp: "2024-01-24T11:20:00Z",
                  },
                  {
                    id: "3",
                    type: "outfit_worn",
                    message: "Wore 'Casual Friday' outfit",
                    timestamp: "2024-01-23T08:15:00Z",
                  },
                  {
                    id: "4",
                    type: "item_favorited",
                    message: "Added 'White Sneakers' to favorites",
                    timestamp: "2024-01-22T16:45:00Z",
                  },
                ]
              )
                .slice(0, 4)
                .map((activity, index) => (
                  <ActivityItem
                    key={activity.id || index}
                    activity={{
                      icon:
                        activity.type === "outfit_created"
                          ? "sparkles"
                          : activity.type === "item_added"
                          ? "add-circle"
                          : activity.type === "outfit_worn"
                          ? "checkmark-circle"
                          : "heart",
                      color:
                        activity.type === "outfit_created"
                          ? "#8b5cf6"
                          : activity.type === "item_added"
                          ? "#10b981"
                          : activity.type === "outfit_worn"
                          ? "#f59e0b"
                          : "#ec4899",
                      text: activity.message,
                      time: new Date(activity.timestamp).toLocaleDateString(),
                    }}
                  />
                ))}
            </Card.Content>
          </Card>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  profileHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10b981",
    borderWidth: 3,
    borderColor: "white",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  memberSince: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberSinceText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -15,
    marginBottom: 24,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: "white",
  },
  statsContent: {
    padding: 20,
    alignItems: "center",
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statsText: {
    alignItems: "center",
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    textAlign: "center",
  },
  statsSubtitle: {
    fontSize: 10,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 2,
  },
  insightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  insightsCard: {
    borderRadius: 16,
    elevation: 3,
    backgroundColor: "white",
  },
  insightsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  viewAllText: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
  },
  insightsGrid: {
    flexDirection: "row",
    marginBottom: 20,
  },
  insightItem: {
    flex: 1,
    alignItems: "center",
  },
  insightValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  insightLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  topCategories: {
    marginTop: 16,
  },
  categoriesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  categoriesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    backgroundColor: "#f3f4f6",
  },
  categoryChipText: {
    fontSize: 12,
    color: "#374151",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  settingsCard: {
    borderRadius: 16,
    elevation: 3,
    backgroundColor: "white",
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    borderRadius: 16,
    elevation: 3,
    backgroundColor: "white",
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
    height: 100,
  },
});

export default ProfileScreen;
