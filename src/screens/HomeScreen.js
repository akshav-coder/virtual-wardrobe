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
  Modal,
  Portal,
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
  const [showAddOptions, setShowAddOptions] = useState(false);

  useEffect(() => {
    // Auto-generate today's outfit on component mount
    if (wardrobe.length > 0) {
      generateTodaysOutfit();
    }
  }, [wardrobe]);

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

  const TodaysOutfitCard = () => {
    // Always show something, even if no outfit is generated
    const hasOutfit = todaysOutfit && todaysOutfit.items.length > 0;

    return (
      <Card style={styles.todaysOutfitCard}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.todaysOutfitGradient}
        >
          <View style={styles.todaysOutfitContent}>
            <View style={styles.todaysOutfitHeader}>
              <View>
                <Text style={styles.todaysOutfitTitle}>Today's Outfit</Text>
                <Text style={styles.todaysOutfitSubtitle}>
                  {hasOutfit
                    ? `${todaysOutfit.items.length} items • ${todaysOutfit.weather}`
                    : "Tap to generate your look"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={generateTodaysOutfit}
              >
                <Ionicons name="refresh" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {hasOutfit ? (
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
            ) : (
              <View style={styles.emptyOutfit}>
                <Ionicons
                  name="sparkles"
                  size={48}
                  color="rgba(255,255,255,0.8)"
                />
                <Text style={styles.emptyOutfitText}>
                  Ready to create your perfect look?
                </Text>
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={generateTodaysOutfit}
                >
                  <Text style={styles.generateButtonText}>Generate Outfit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </LinearGradient>
      </Card>
    );
  };

  const UpcomingOutfitsCard = () => {
    const upcomingOutfits = outfits.slice(0, 3);

    return (
      <Card style={styles.upcomingOutfitsCard}>
        <Card.Content style={styles.upcomingOutfitsContent}>
          <View style={styles.upcomingOutfitsHeader}>
            <Text style={styles.upcomingOutfitsTitle}>Upcoming Outfits</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Main", { screen: "Planner" })}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {upcomingOutfits.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.upcomingOutfitsScroll}
            >
              {upcomingOutfits.map((outfit, index) => (
                <TouchableOpacity
                  key={outfit.id}
                  style={styles.upcomingOutfitItem}
                  onPress={() => console.log("Outfit tapped:", outfit.name)}
                >
                  <View style={styles.upcomingOutfitHeader}>
                    <Text style={styles.upcomingOutfitName}>{outfit.name}</Text>
                    <Text style={styles.upcomingOutfitDate}>
                      {index === 0
                        ? "Today"
                        : index === 1
                        ? "Tomorrow"
                        : "This Week"}
                    </Text>
                  </View>
                  <View style={styles.upcomingOutfitItems}>
                    {outfit.items.slice(0, 4).map((item, itemIndex) => (
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
          ) : (
            <View style={styles.emptyUpcoming}>
              <Ionicons name="calendar-outline" size={32} color="#9ca3af" />
              <Text style={styles.emptyUpcomingText}>
                No upcoming outfits planned
              </Text>
              <Button
                mode="outlined"
                onPress={() =>
                  navigation.navigate("Main", { screen: "Planner" })
                }
                style={styles.planOutfitButton}
                compact
              >
                Plan Outfits
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const QuickActionsCard = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.quickActionsTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => navigation.navigate("Main", { screen: "Planner" })}
        >
          <View
            style={[styles.quickActionIcon, { backgroundColor: "#f59e0b" }]}
          >
            <Ionicons name="calendar" size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>Plan Outfit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => navigation.navigate("Stylist")}
        >
          <View
            style={[styles.quickActionIcon, { backgroundColor: "#8b5cf6" }]}
          >
            <Ionicons name="sparkles" size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>AI Stylist</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => navigation.navigate("Wardrobe")}
        >
          <View
            style={[styles.quickActionIcon, { backgroundColor: "#ef4444" }]}
          >
            <Ionicons name="shirt" size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>Wardrobe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => setShowAddOptions(true)}
        >
          <View
            style={[styles.quickActionIcon, { backgroundColor: "#10b981" }]}
          >
            <Ionicons name="add" size={24} color="white" />
          </View>
          <Text style={styles.quickActionText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const AddOptionsModal = () => (
    <Portal>
      <Modal
        visible={showAddOptions}
        onDismiss={() => setShowAddOptions(false)}
        contentContainerStyle={styles.addOptionsModal}
      >
        <View style={styles.addOptionsContent}>
          <Text style={styles.addOptionsTitle}>
            What would you like to add?
          </Text>

          <TouchableOpacity
            style={styles.addOption}
            onPress={() => {
              setShowAddOptions(false);
              navigation.navigate("AddItem");
            }}
          >
            <View style={styles.addOptionIcon}>
              <Ionicons name="shirt" size={24} color="#10b981" />
            </View>
            <View style={styles.addOptionContent}>
              <Text style={styles.addOptionTitle}>Add Item</Text>
              <Text style={styles.addOptionSubtitle}>
                Add a new clothing item to your wardrobe
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addOption}
            onPress={() => {
              setShowAddOptions(false);
              navigation.navigate("Main", { screen: "Planner" });
            }}
          >
            <View style={styles.addOptionIcon}>
              <Ionicons name="sparkles" size={24} color="#8b5cf6" />
            </View>
            <View style={styles.addOptionContent}>
              <Text style={styles.addOptionTitle}>Add New Outfit</Text>
              <Text style={styles.addOptionSubtitle}>
                Create a new outfit combination
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </Modal>
    </Portal>
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
        {/* Minimal Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.subGreeting}>Ready to style today?</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.weatherInfo}>
                <Ionicons name="partly-sunny" size={20} color="#6366f1" />
                <Text style={styles.weatherText}>{weather?.temp || 22}°</Text>
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
          </View>
        </View>

        {/* Today's Outfit - Main Feature */}
        <View style={styles.mainContent}>
          <TodaysOutfitCard />
        </View>

        {/* Upcoming Outfits */}
        <View style={styles.upcomingSection}>
          <UpcomingOutfitsCard />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <QuickActionsCard />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Custom + Button */}
      <TouchableOpacity
        style={styles.customFAB}
        onPress={() => setShowAddOptions(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Options Modal */}
      <AddOptionsModal />
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
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: "#6b7280",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
  },
  weatherText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  profileButton: {
    borderRadius: 20,
  },
  avatar: {
    backgroundColor: "#e5e7eb",
  },
  avatarLabel: {
    color: "#6b7280",
    fontWeight: "bold",
  },
  mainContent: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  todaysOutfitCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  todaysOutfitGradient: {
    borderRadius: 20,
    padding: 24,
  },
  todaysOutfitContent: {
    minHeight: 200,
  },
  todaysOutfitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  todaysOutfitTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  todaysOutfitSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  outfitItems: {
    flexDirection: "row",
  },
  outfitItem: {
    marginRight: 16,
    alignItems: "center",
  },
  outfitItemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  outfitItemName: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    maxWidth: 70,
    fontWeight: "500",
  },
  emptyOutfit: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  emptyOutfitText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
    fontWeight: "500",
  },
  generateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  generateButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  upcomingSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  upcomingOutfitsCard: {
    borderRadius: 16,
    elevation: 4,
  },
  upcomingOutfitsContent: {
    padding: 20,
  },
  upcomingOutfitsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  upcomingOutfitsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  viewAllText: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
  },
  upcomingOutfitsScroll: {
    marginBottom: 12,
  },
  upcomingOutfitItem: {
    marginRight: 16,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    minWidth: 160,
  },
  upcomingOutfitHeader: {
    marginBottom: 12,
  },
  upcomingOutfitName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  upcomingOutfitDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  upcomingOutfitItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  upcomingOutfitItemImage: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  emptyUpcoming: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyUpcomingText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  planOutfitButton: {
    borderRadius: 8,
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickActionsContainer: {
    marginBottom: 8,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionItem: {
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
    textAlign: "center",
  },
  bottomSpacing: {
    height: 120,
  },
  customFAB: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addOptionsModal: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 16,
    padding: 0,
  },
  addOptionsContent: {
    padding: 24,
  },
  addOptionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },
  addOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    marginBottom: 12,
  },
  addOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  addOptionContent: {
    flex: 1,
  },
  addOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  addOptionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
});

export default HomeScreen;
