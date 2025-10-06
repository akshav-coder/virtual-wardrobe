import React, { useState, useMemo } from "react";
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
  Text,
  Surface,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import {
  useGetItemsQuery,
  useGetOutfitsQuery,
  useGetCurrentWeatherQuery,
  useGenerateRecommendationsMutation,
  useGetStyleAnalysisQuery,
} from "../services";
import { showErrorMessage, showSuccessMessage } from "../utils/apiUtils";

const { width } = Dimensions.get("window");

const StylistScreen = ({ navigation }) => {
  const auth = useSelector((state) => state.auth);
  const [selectedTab, setSelectedTab] = useState("recommendations");
  const [selectedStyle, setSelectedStyle] = useState("casual");
  const [selectedOccasion, setSelectedOccasion] = useState("daily");
  const [refreshing, setRefreshing] = useState(false);

  // API hooks
  const {
    data: wardrobeData,
    isLoading: isLoadingWardrobe,
    error: wardrobeError,
    refetch: refetchWardrobe,
  } = useGetItemsQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const {
    data: outfitsData,
    isLoading: isLoadingOutfits,
    refetch: refetchOutfits,
  } = useGetOutfitsQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const {
    data: weatherData,
    isLoading: isLoadingWeather,
    refetch: refetchWeather,
  } = useGetCurrentWeatherQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const {
    data: styleAnalysis,
    isLoading: isLoadingStyleAnalysis,
    refetch: refetchStyleAnalysis,
  } = useGetStyleAnalysisQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const [generateRecommendations, { isLoading: isGeneratingRecommendations }] =
    useGenerateRecommendationsMutation();

  const wardrobe = wardrobeData?.data?.items || [];
  const outfits = outfitsData?.data?.outfits || [];
  const weather = weatherData?.data;
  const styleAnalysisData = styleAnalysis?.data;

  const isLoading =
    isLoadingWardrobe ||
    isLoadingOutfits ||
    isLoadingWeather ||
    isLoadingStyleAnalysis;

  const styleOptions = [
    { key: "casual", label: "Casual" },
    { key: "formal", label: "Formal" },
    { key: "sporty", label: "Sporty" },
    { key: "minimalist", label: "Minimalist" },
  ];

  const occasionOptions = [
    { key: "daily", label: "Daily" },
    { key: "work", label: "Work" },
    { key: "date", label: "Date" },
    { key: "party", label: "Party" },
  ];

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchWardrobe(),
        refetchOutfits(),
        refetchWeather(),
        refetchStyleAnalysis(),
      ]);
      showSuccessMessage("Stylist data refreshed");
    } catch (error) {
      showErrorMessage("Failed to refresh stylist data");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle AI recommendation generation
  const handleGenerateRecommendations = async () => {
    try {
      const result = await generateRecommendations({
        type: selectedOccasion,
        occasion: selectedOccasion,
        style: selectedStyle,
        limit: 5,
      }).unwrap();
      
      if (result.data?.recommendations?.length > 0) {
        showSuccessMessage("New recommendations generated!");
      } else {
        showErrorMessage("No recommendations available. Try adding more items to your wardrobe.");
      }
    } catch (error) {
      showErrorMessage("Failed to generate recommendations");
    }
  };

  const aiRecommendations = useMemo(() => {
    // Use API recommendations if available, otherwise fallback to local logic
    if (styleAnalysisData?.recommendations?.length > 0) {
      return styleAnalysisData.recommendations.map((rec, index) => ({
        id: rec._id || `rec-${index}`,
        title: rec.title || `Recommendation ${index + 1}`,
        items: rec.items || wardrobe.slice(0, 3),
        reason: rec.reason || "AI-powered recommendation",
      }));
    }
    
    // Fallback to local recommendations
    if (wardrobe.length === 0) return [];
    
    return [
      {
        id: "1",
        title: "Today's Look",
        items: wardrobe.slice(0, 3),
        reason: "Perfect for your style and weather",
      },
      {
        id: "2",
        title: "Fresh Style",
        items: wardrobe.slice(1, 4),
        reason: "Try something new this week",
      },
    ];
  }, [wardrobe, styleAnalysisData]);

  const wardrobeStats = useMemo(() => {
    const totalItems = wardrobe.length;
    const mostWorn = [...wardrobe]
      .sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0))
      .slice(0, 3);

    return {
      totalItems,
      mostWorn,
    };
  }, [wardrobe]);

  const RecommendationCard = ({ recommendation }) => (
    <Surface style={styles.recommendationCard} elevation={2}>
      <View style={styles.recommendationContent}>
        <View style={styles.recommendationHeader}>
          <Ionicons name="sparkles" size={20} color="#667eea" />
          <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
        </View>
        <View style={styles.outfitItems}>
          {recommendation.items.map((item, index) => (
            <View key={index} style={styles.outfitItemContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.outfitItemImage}
              />
            </View>
          ))}
        </View>
        <Text style={styles.recommendationReason}>{recommendation.reason}</Text>
        <Button
          mode="contained"
          compact
          style={styles.tryButton}
          labelStyle={styles.tryButtonLabel}
        >
          Try This Look
        </Button>
      </View>
    </Surface>
  );

  const WardrobeInsights = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>Your Wardrobe</Text>

      <Surface style={styles.statsCard} elevation={2}>
        <View style={styles.statsIconContainer}>
          <Ionicons name="shirt" size={32} color="#667eea" />
        </View>
        <Text style={styles.statsNumber}>{wardrobeStats.totalItems}</Text>
        <Text style={styles.statsLabel}>Items in wardrobe</Text>
      </Surface>

      <Text style={styles.subsectionTitle}>Most Worn</Text>
      <View style={styles.itemList}>
        {wardrobeStats.mostWorn.map((item, index) => (
          <Surface key={index} style={styles.itemRow} elevation={1}>
            <View style={styles.itemImageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.itemThumbnail}
              />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemWearCount}>
                {item.wearCount || 0} times worn
              </Text>
            </View>
            <View style={styles.itemBadge}>
              <Text style={styles.badgeText}>★</Text>
            </View>
          </Surface>
        ))}
      </View>
    </View>
  );

  const StylePreferences = () => (
    <View style={styles.preferencesContainer}>
      <Text style={styles.sectionTitle}>Style Preferences</Text>

      <Text style={styles.subsectionTitle}>Style Types</Text>
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
            <Text
              style={[
                styles.styleOptionText,
                selectedStyle === style.key && styles.styleOptionTextSelected,
              ]}
            >
              {style.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subsectionTitle}>Occasions</Text>
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
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading stylist data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Simple Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stylist</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "recommendations" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("recommendations")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "recommendations" && styles.activeTabText,
              ]}
            >
              Recommendations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "insights" && styles.activeTab]}
            onPress={() => setSelectedTab("insights")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "insights" && styles.activeTabText,
              ]}
            >
              Insights
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "preferences" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("preferences")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "preferences" && styles.activeTabText,
              ]}
            >
              Preferences
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#667eea"]}
          />
        }
      >
        {selectedTab === "recommendations" && (
          <View style={styles.recommendationsContainer}>
            <View style={styles.generateButtonContainer}>
              <Button
                mode="contained"
                onPress={handleGenerateRecommendations}
                loading={isGeneratingRecommendations}
                disabled={isGeneratingRecommendations}
                style={styles.generateButton}
                icon="auto-fix"
              >
                Generate AI Recommendations
              </Button>
            </View>
            {aiRecommendations.length > 0 ? (
              aiRecommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No recommendations available. Generate some AI-powered suggestions!
                </Text>
              </View>
            )}
          </View>
        )}

        {selectedTab === "insights" && <WardrobeInsights />}

        {selectedTab === "preferences" && <StylePreferences />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f7fafc",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#667eea",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  recommendationsContainer: {
    padding: 20,
  },
  recommendationCard: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  recommendationContent: {
    padding: 20,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3748",
    marginLeft: 8,
    letterSpacing: -0.3,
  },
  outfitItems: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "center",
  },
  outfitItemContainer: {
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 4,
    backgroundColor: "#f7fafc",
  },
  outfitItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  recommendationReason: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 16,
    lineHeight: 20,
    textAlign: "center",
  },
  tryButton: {
    alignSelf: "center",
    backgroundColor: "#667eea",
    borderRadius: 12,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tryButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  insightsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: 16,
    marginTop: 24,
  },
  statsCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statsIconContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f0f4ff",
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: "700",
    color: "#667eea",
    marginBottom: 4,
    letterSpacing: -1,
  },
  statsLabel: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  itemList: {
    marginTop: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#ffffff",
  },
  itemImageContainer: {
    marginRight: 12,
    borderRadius: 8,
    padding: 4,
    backgroundColor: "#f7fafc",
  },
  itemThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 4,
  },
  itemWearCount: {
    fontSize: 13,
    color: "#718096",
    fontWeight: "500",
  },
  itemBadge: {
    backgroundColor: "#fef5e7",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#f6ad55",
    fontWeight: "600",
  },
  preferencesContainer: {
    padding: 20,
  },
  styleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  styleOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  styleOptionSelected: {
    borderColor: "#667eea",
    backgroundColor: "#667eea",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  styleOptionText: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "600",
  },
  styleOptionTextSelected: {
    color: "#ffffff",
    fontWeight: "700",
  },
  occasionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  occasionOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  occasionOptionSelected: {
    borderColor: "#667eea",
    backgroundColor: "#667eea",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  occasionOptionText: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "600",
  },
  occasionOptionTextSelected: {
    color: "#ffffff",
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#718096",
    fontWeight: "500",
  },
  generateButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  generateButton: {
    borderRadius: 12,
    elevation: 2,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default StylistScreen;
