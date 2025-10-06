import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Text as RNText,
  RefreshControl,
} from "react-native";
import {
  Card,
  Title,
  Button,
  Chip,
  Text,
  FAB,
  Surface,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { theme } from "../theme/theme";
import {
  useGetOutfitsQuery,
  useCreateOutfitMutation,
  useGetItemsQuery,
} from "../services";
import { showErrorMessage, showSuccessMessage } from "../utils/apiUtils";

const { width } = Dimensions.get("window");

const OutfitPlannerScreen = ({ navigation }) => {
  const auth = useSelector((state) => state.auth);
  const [selectedView, setSelectedView] = useState("calendar");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCreatingOutfit, setIsCreatingOutfit] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // API hooks
  const {
    data: outfits = [],
    isLoading: isLoadingOutfits,
    error: outfitsError,
    refetch: refetchOutfits,
  } = useGetOutfitsQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const {
    data: wardrobe = [],
    isLoading: isLoadingWardrobe,
    error: wardrobeError,
    refetch: refetchWardrobe,
  } = useGetItemsQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const [createOutfit, { isLoading: isCreating }] = useCreateOutfitMutation();

  const isLoading = isLoadingOutfits || isLoadingWardrobe;

  const outfitCategories = {
    top: wardrobe.filter((item) => item.category === "top"),
    bottom: wardrobe.filter((item) => item.category === "bottom"),
    dress: wardrobe.filter((item) => item.category === "dress"),
    shoes: wardrobe.filter((item) => item.category === "shoes"),
    accessory: wardrobe.filter((item) => item.category === "accessory"),
    outerwear: wardrobe.filter((item) => item.category === "outerwear"),
  };

  const addItemToOutfit = (item) => {
    if (selectedItems.find((selected) => selected.id === item.id)) {
      setSelectedItems(
        selectedItems.filter((selected) => selected.id !== item.id)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchOutfits(), refetchWardrobe()]);
      showSuccessMessage("Outfit data refreshed");
    } catch (error) {
      showErrorMessage("Failed to refresh outfit data");
    } finally {
      setRefreshing(false);
    }
  };

  const saveOutfit = async () => {
    if (selectedItems.length === 0) return;

    try {
      const newOutfit = {
        name: `Outfit ${outfits.length + 1}`,
        items: selectedItems.map((item) => item._id || item.id),
        weather: "sunny",
        temperature: 22,
        occasion: "casual",
      };

      await createOutfit(newOutfit).unwrap();
      showSuccessMessage("Outfit created successfully");
      setSelectedItems([]);
      setIsCreatingOutfit(false);
    } catch (error) {
      showErrorMessage("Failed to create outfit");
    }
  };

  const OutfitCard = ({ outfit }) => (
    <TouchableOpacity
      style={styles.minimalOutfitCard}
      onPress={() => navigation.navigate("OutfitDetail", { outfit })}
      activeOpacity={0.7}
    >
      <View style={styles.outfitPreview}>
        {outfit.items?.slice(0, 3).map((item, index) => (
          <Image
            key={index}
            source={{ uri: item.image || item.imageUrl }}
            style={styles.minimalItemImage}
          />
        ))}
        {outfit.items?.length > 3 && (
          <View style={styles.moreIndicator}>
            <Text style={styles.moreCount}>+{outfit.items.length - 3}</Text>
          </View>
        )}
      </View>
      <View style={styles.outfitInfo}>
        <Text style={styles.minimalOutfitName}>{outfit.name}</Text>
        <Text style={styles.minimalOutfitDate}>
          {new Date(outfit.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const CalendarView = () => (
    <View style={styles.minimalCalendar}>
      <View style={styles.calendarWeek}>
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <TouchableOpacity
            key={`day-${index}`}
            style={styles.minimalDay}
            onPress={() => {
              /* Navigate to day planner */
            }}
          >
            <Text style={styles.dayInitial}>{day}</Text>
            <Text style={styles.dayNumber}>{index + 1}</Text>
            <View style={styles.dayDot} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const OutfitCreator = () => (
    <View style={styles.minimalCreator}>
      <View style={styles.creatorHeader}>
        <TouchableOpacity onPress={() => setIsCreatingOutfit(false)}>
          <Ionicons name="close" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.creatorTitle}>New Outfit</Text>
        <TouchableOpacity
          onPress={saveOutfit}
          disabled={selectedItems.length === 0 || isCreating}
        >
          <Text
            style={[
              styles.saveButton,
              (selectedItems.length === 0 || isCreating) &&
                styles.saveButtonDisabled,
            ]}
          >
            {isCreating ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedItems.length > 0 && (
        <View style={styles.selectedPreview}>
          <Text style={styles.selectedLabel}>
            Selected ({selectedItems.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.selectedItems}>
              {selectedItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.selectedItem}
                  onPress={() => addItemToOutfit(item)}
                >
                  <Image
                    source={{ uri: item.image || item.imageUrl }}
                    style={styles.selectedItemImage}
                  />
                  <View style={styles.removeOverlay}>
                    <Ionicons name="close" size={16} color="white" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View style={styles.categoryGrid}>
        {Object.entries(outfitCategories).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryLabel}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              <View style={styles.categoryItems}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => addItemToOutfit(item)}
                    style={[
                      styles.minimalItemCard,
                      selectedItems.find(
                        (selected) => selected.id === item.id
                      ) && styles.minimalItemCardSelected,
                    ]}
                  >
                    <Image
                      source={{ uri: item.image || item.imageUrl }}
                      style={styles.minimalItemImage}
                    />
                    {selectedItems.find(
                      (selected) => selected.id === item.id
                    ) && (
                      <View style={styles.minimalSelectedOverlay}>
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        ))}
      </View>
    </View>
  );

  const OutfitsList = () => (
    <View style={styles.minimalOutfitsList}>
      <View style={styles.outfitsHeader}>
        <Text style={styles.minimalSectionTitle}>Outfits</Text>
        <TouchableOpacity
          style={styles.newOutfitButton}
          onPress={() => setIsCreatingOutfit(true)}
        >
          <Ionicons name="add" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={outfits}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => <OutfitCard outfit={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.outfitsGrid}
        numColumns={2}
        columnWrapperStyle={styles.outfitRow}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.minimalContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading outfit data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.minimalContainer}>
      {!isCreatingOutfit && (
        <View style={styles.minimalHeader}>
          <Text style={styles.headerTitle}>Outfit Planner</Text>
          <View style={styles.headerTabs}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedView === "calendar" && styles.activeTab,
              ]}
              onPress={() => setSelectedView("calendar")}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={
                  selectedView === "calendar"
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedView === "outfits" && styles.activeTab,
              ]}
              onPress={() => setSelectedView("outfits")}
            >
              <Ionicons
                name="shirt-outline"
                size={18}
                color={
                  selectedView === "outfits"
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isCreatingOutfit ? (
        <OutfitCreator />
      ) : selectedView === "calendar" ? (
        <View style={styles.minimalContent}>
          <CalendarView />
          <OutfitsList />
        </View>
      ) : (
        <OutfitsList />
      )}

      {!isCreatingOutfit && (
        <TouchableOpacity
          style={styles.minimalFAB}
          onPress={() => setIsCreatingOutfit(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container
  minimalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },

  // Header styles
  minimalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: 60,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.fonts.titleMedium,
    color: theme.colors.onSurface,
  },
  headerTabs: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    padding: 2,
  },
  tab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.surface,
  },

  // Content styles
  minimalContent: {
    flex: 1,
  },

  // Calendar styles
  minimalCalendar: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  calendarWeek: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  minimalDay: {
    alignItems: "center",
    flex: 1,
  },
  dayInitial: {
    ...theme.fonts.bodySmall,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  dayNumber: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },

  // Outfit list styles
  minimalOutfitsList: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  outfitsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
  },
  minimalSectionTitle: {
    ...theme.fonts.titleMedium,
    color: theme.colors.onSurface,
  },
  newOutfitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  outfitsGrid: {
    paddingBottom: 100,
  },
  outfitRow: {
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },

  // Minimal outfit card
  minimalOutfitCard: {
    width: (width - theme.spacing.md * 3) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  outfitPreview: {
    flexDirection: "row",
    marginBottom: theme.spacing.sm,
  },
  minimalItemImage: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
  },
  moreIndicator: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
  },
  moreCount: {
    ...theme.fonts.bodySmall,
    color: theme.colors.onSurfaceVariant,
  },
  outfitInfo: {
    flex: 1,
  },
  minimalOutfitName: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurface,
    marginBottom: 2,
  },
  minimalOutfitDate: {
    ...theme.fonts.bodySmall,
    color: theme.colors.onSurfaceVariant,
  },

  // Outfit creator styles
  minimalCreator: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  creatorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  creatorTitle: {
    ...theme.fonts.titleMedium,
    color: theme.colors.onSurface,
  },
  saveButton: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  saveButtonDisabled: {
    color: theme.colors.onSurfaceVariant,
  },

  // Selected items preview
  selectedPreview: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedLabel: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
  },
  selectedItems: {
    flexDirection: "row",
  },
  selectedItem: {
    position: "relative",
    marginRight: theme.spacing.sm,
  },
  selectedItemImage: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
  },
  removeOverlay: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.error,
    justifyContent: "center",
    alignItems: "center",
  },

  // Category grid
  categoryGrid: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  categorySection: {
    marginBottom: theme.spacing.lg,
  },
  categoryLabel: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
    fontWeight: "600",
  },
  categoryScroll: {
    flexGrow: 0,
  },
  categoryItems: {
    flexDirection: "row",
  },
  minimalItemCard: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    overflow: "hidden",
    backgroundColor: theme.colors.surfaceVariant,
  },
  minimalItemCardSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  minimalItemImage: {
    width: "100%",
    height: "100%",
  },
  minimalSelectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(99, 102, 241, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  // FAB
  minimalFAB: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default OutfitPlannerScreen;
