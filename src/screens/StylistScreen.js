import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  Text,
  Searchbar,
  FAB,
  SegmentedButtons,
  IconButton,
  Badge,
  ProgressBar,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const StylistScreen = ({ navigation }) => {
  const wardrobe = useSelector((state) => state.wardrobe.items);
  const preferences = useSelector((state) => state.preferences.settings);
  const weather = useSelector((state) => state.weather.currentWeather);
  const [selectedTab, setSelectedTab] = useState("recommendations");
  const [selectedStyle, setSelectedStyle] = useState("casual");
  const [selectedOccasion, setSelectedOccasion] = useState("daily");

  const styleOptions = [
    { key: "casual", label: "Casual", icon: "shirt-outline" },
    { key: "formal", label: "Formal", icon: "business" },
    { key: "sporty", label: "Sporty", icon: "fitness" },
    { key: "vintage", label: "Vintage", icon: "time" },
    { key: "minimalist", label: "Minimalist", icon: "remove" },
    { key: "bohemian", label: "Bohemian", icon: "flower" },
  ];

  const occasionOptions = [
    { key: "daily", label: "Daily" },
    { key: "work", label: "Work" },
    { key: "date", label: "Date Night" },
    { key: "party", label: "Party" },
    { key: "travel", label: "Travel" },
    { key: "gym", label: "Gym" },
  ];

  const aiRecommendations = useMemo(() => {
    // Mock AI recommendations based on user preferences and wardrobe
    const recommendations = [
      {
        id: "1",
        title: "Perfect for Today",
        description: "Based on your style and the weather",
        confidence: 95,
        items: wardrobe.slice(0, 4),
        reason: "Great color combination that matches your preferences",
        price: 0,
        sustainability: "high",
      },
      {
        id: "2",
        title: "Trendy & Fresh",
        description: "Try something new this week",
        confidence: 87,
        items: wardrobe.slice(1, 5),
        reason: "Incorporates current trends while staying true to your style",
        price: 0,
        sustainability: "medium",
      },
      {
        id: "3",
        title: "Wardrobe Gap",
        description: "Complete your look with these essentials",
        confidence: 92,
        items: [], // This would be shopping recommendations
        reason: "Missing key pieces for a complete wardrobe",
        price: 150,
        sustainability: "high",
        isShopping: true,
      },
    ];
    return recommendations;
  }, [wardrobe, preferences, weather]);

  const wardrobeAnalysis = useMemo(() => {
    const totalItems = wardrobe.length;
    const categories = wardrobe.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const colors = wardrobe.reduce((acc, item) => {
      acc[item.color] = (acc[item.color] || 0) + 1;
      return acc;
    }, {});

    const mostWorn = [...wardrobe]
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 5);

    const leastWorn = [...wardrobe]
      .sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0))
      .slice(0, 5);

    return {
      totalItems,
      categories,
      colors,
      mostWorn,
      leastWorn,
      diversityScore: Math.min(100, Object.keys(categories).length * 15),
      colorScore: Math.min(100, Object.keys(colors).length * 12),
    };
  }, [wardrobe]);

  const RecommendationCard = ({ recommendation }) => (
    <Card style={styles.recommendationCard}>
      <LinearGradient
        colors={["#6366f1", "#8b5cf6"]}
        style={styles.recommendationGradient}
      >
        <View style={styles.recommendationHeader}>
          <View>
            <Title style={styles.recommendationTitle}>
              {recommendation.title}
            </Title>
            <Paragraph style={styles.recommendationDescription}>
              {recommendation.description}
            </Paragraph>
          </View>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceText}>
              {recommendation.confidence}%
            </Text>
            <Text style={styles.confidenceLabel}>Match</Text>
          </View>
        </View>
        <ProgressBar
          progress={recommendation.confidence / 100}
          color="white"
          style={styles.confidenceBar}
        />
      </LinearGradient>

      <Card.Content style={styles.recommendationContent}>
        {recommendation.isShopping ? (
          <View style={styles.shoppingContent}>
            <Text style={styles.shoppingTitle}>Recommended Items to Buy:</Text>
            <View style={styles.shoppingItems}>
              <View style={styles.shoppingItem}>
                <Ionicons name="shirt" size={24} color="#6366f1" />
                <Text style={styles.shoppingItemText}>White Button-Up</Text>
                <Text style={styles.shoppingItemPrice}>$45</Text>
              </View>
              <View style={styles.shoppingItem}>
                <Ionicons name="pants" size={24} color="#6366f1" />
                <Text style={styles.shoppingItemText}>Black Trousers</Text>
                <Text style={styles.shoppingItemPrice}>$65</Text>
              </View>
              <View style={styles.shoppingItem}>
                <Ionicons name="footsteps" size={24} color="#6366f1" />
                <Text style={styles.shoppingItemText}>Brown Loafers</Text>
                <Text style={styles.shoppingItemPrice}>$40</Text>
              </View>
            </View>
            <View style={styles.shoppingFooter}>
              <Text style={styles.totalPrice}>
                Total: ${recommendation.price}
              </Text>
              <Button mode="contained" compact>
                Shop Now
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.outfitContent}>
            <View style={styles.outfitItems}>
              {recommendation.items.map((item, index) => (
                <Image
                  key={index}
                  source={{ uri: item.image }}
                  style={styles.outfitItemImage}
                />
              ))}
            </View>
            <Text style={styles.recommendationReason}>
              {recommendation.reason}
            </Text>
            <View style={styles.recommendationActions}>
              <Button mode="outlined" compact>
                View Details
              </Button>
              <Button mode="contained" compact>
                Try This Look
              </Button>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const AnalysisCard = ({ title, children }) => (
    <Card style={styles.analysisCard}>
      <Card.Content>
        <Title style={styles.analysisTitle}>{title}</Title>
        {children}
      </Card.Content>
    </Card>
  );

  const WardrobeInsights = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>Wardrobe Insights</Text>

      <AnalysisCard title="Diversity Score">
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreNumber}>
            {wardrobeAnalysis.diversityScore}
          </Text>
          <Text style={styles.scoreLabel}>out of 100</Text>
        </View>
        <ProgressBar
          progress={wardrobeAnalysis.diversityScore / 100}
          color="#10b981"
          style={styles.scoreBar}
        />
        <Text style={styles.scoreDescription}>
          Your wardrobe has good variety across categories
        </Text>
      </AnalysisCard>

      <AnalysisCard title="Color Distribution">
        <View style={styles.colorDistribution}>
          {Object.entries(wardrobeAnalysis.colors).map(([color, count]) => (
            <View key={color} style={styles.colorItem}>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color.toLowerCase() },
                ]}
              />
              <Text style={styles.colorName}>{color}</Text>
              <Text style={styles.colorCount}>{count}</Text>
            </View>
          ))}
        </View>
      </AnalysisCard>

      <AnalysisCard title="Most Worn Items">
        <View style={styles.itemList}>
          {wardrobeAnalysis.mostWorn.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemThumbnail}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemWearCount}>
                  Worn {item.wearCount || 0} times
                </Text>
              </View>
            </View>
          ))}
        </View>
      </AnalysisCard>

      <AnalysisCard title="Underutilized Items">
        <View style={styles.itemList}>
          {wardrobeAnalysis.leastWorn.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemThumbnail}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemWearCount}>
                  Worn {item.wearCount || 0} times
                </Text>
              </View>
              <Button mode="outlined" compact>
                Style It
              </Button>
            </View>
          ))}
        </View>
      </AnalysisCard>
    </View>
  );

  const StylePreferences = () => (
    <View style={styles.preferencesContainer}>
      <Text style={styles.sectionTitle}>Style Preferences</Text>

      <Card style={styles.preferencesCard}>
        <Card.Content>
          <Title>Style Types</Title>
          <View style={styles.styleGrid}>
            {styleOptions.map((style) => (
              <TouchableOpacity
                key={style.key}
                style={[
                  styles.styleOption,
                  selectedStyle === style.key && styles.styleOptionSelected,
                ]}
                onPress={() => setSelectedStyle(style.key)}
              >
                <Ionicons
                  name={style.icon}
                  size={24}
                  color={selectedStyle === style.key ? "#6366f1" : "#6b7280"}
                />
                <Text
                  style={[
                    styles.styleOptionText,
                    selectedStyle === style.key &&
                      styles.styleOptionTextSelected,
                  ]}
                >
                  {style.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.preferencesCard}>
        <Card.Content>
          <Title>Occasions</Title>
          <View style={styles.occasionGrid}>
            {occasionOptions.map((occasion) => (
              <TouchableOpacity
                key={occasion.key}
                style={[
                  styles.occasionOption,
                  selectedOccasion === occasion.key &&
                    styles.occasionOptionSelected,
                ]}
                onPress={() => setSelectedOccasion(occasion.key)}
              >
                <Text
                  style={[
                    styles.occasionOptionText,
                    selectedOccasion === occasion.key &&
                      styles.occasionOptionTextSelected,
                  ]}
                >
                  {occasion.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SegmentedButtons
          value={selectedTab}
          onValueChange={setSelectedTab}
          buttons={[
            { value: "recommendations", label: "AI Stylist", icon: "sparkles" },
            { value: "insights", label: "Insights", icon: "analytics" },
            { value: "preferences", label: "Preferences", icon: "settings" },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === "recommendations" && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
            {aiRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </View>
        )}

        {selectedTab === "insights" && <WardrobeInsights />}

        {selectedTab === "preferences" && <StylePreferences />}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="refresh"
        style={styles.fab}
        onPress={() => {
          /* Regenerate recommendations */
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
  header: {
    padding: 16,
    paddingBottom: 8,
    paddingTop: 60,
  },
  segmentedButtons: {
    backgroundColor: "white",
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  recommendationsContainer: {
    padding: 16,
  },
  recommendationCard: {
    marginBottom: 16,
    elevation: 4,
  },
  recommendationGradient: {
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recommendationTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  recommendationDescription: {
    color: "white",
    opacity: 0.9,
    marginTop: 4,
  },
  confidenceContainer: {
    alignItems: "center",
  },
  confidenceText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  confidenceLabel: {
    color: "white",
    opacity: 0.8,
    fontSize: 12,
  },
  confidenceBar: {
    marginTop: 8,
  },
  recommendationContent: {
    padding: 16,
  },
  outfitContent: {
    alignItems: "center",
  },
  outfitItems: {
    flexDirection: "row",
    marginBottom: 12,
  },
  outfitItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  recommendationReason: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 16,
  },
  recommendationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  shoppingContent: {
    width: "100%",
  },
  shoppingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  shoppingItems: {
    marginBottom: 16,
  },
  shoppingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  shoppingItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
  shoppingItemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  shoppingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  insightsContainer: {
    padding: 16,
  },
  analysisCard: {
    marginBottom: 16,
    elevation: 2,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#10b981",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  scoreBar: {
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  colorDistribution: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  colorItem: {
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  colorName: {
    fontSize: 12,
    color: "#6b7280",
  },
  colorCount: {
    fontSize: 10,
    color: "#9ca3af",
  },
  itemList: {
    marginTop: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  itemThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  itemWearCount: {
    fontSize: 12,
    color: "#6b7280",
  },
  preferencesContainer: {
    padding: 16,
  },
  preferencesCard: {
    marginBottom: 16,
    elevation: 2,
  },
  styleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  styleOption: {
    alignItems: "center",
    padding: 12,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
    minWidth: 80,
  },
  styleOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#e0e7ff",
  },
  styleOptionText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  styleOptionTextSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
  occasionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  occasionOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
  },
  occasionOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#e0e7ff",
  },
  occasionOptionText: {
    fontSize: 14,
    color: "#6b7280",
  },
  occasionOptionTextSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6366f1",
  },
});

export default StylistScreen;
