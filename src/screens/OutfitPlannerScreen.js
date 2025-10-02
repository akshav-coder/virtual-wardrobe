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
  FAB,
  SegmentedButtons,
  IconButton,
  Badge,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { addOutfit } from "../store/slices/outfitSlice";

const { width } = Dimensions.get("window");

const OutfitPlannerScreen = ({ navigation }) => {
  const wardrobe = useSelector((state) => state.wardrobe.items);
  const outfits = useSelector((state) => state.outfits.outfits);
  const dispatch = useDispatch();
  const [selectedView, setSelectedView] = useState("calendar");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCreatingOutfit, setIsCreatingOutfit] = useState(false);

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

  const saveOutfit = () => {
    if (selectedItems.length === 0) return;

    const newOutfit = {
      name: `Outfit ${outfits.length + 1}`,
      items: selectedItems,
      createdAt: new Date().toISOString(),
      weather: "sunny",
      temperature: 22,
      occasion: "casual",
    };

    dispatch(addOutfit(newOutfit));
    setSelectedItems([]);
    setIsCreatingOutfit(false);
  };

  const OutfitCard = ({ outfit }) => (
    <Card style={styles.outfitCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate("OutfitDetail", { outfit })}
      >
        <View style={styles.outfitHeader}>
          <View>
            <Title style={styles.outfitName}>{outfit.name}</Title>
            <Text style={styles.outfitDate}>
              {new Date(outfit.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.outfitActions}>
            <IconButton
              icon="heart-outline"
              size={20}
              onPress={() => {
                /* Toggle favorite */
              }}
            />
            <IconButton
              icon="more-vert"
              size={20}
              onPress={() => {
                /* Show menu */
              }}
            />
          </View>
        </View>
        <View style={styles.outfitItems}>
          {outfit.items.slice(0, 4).map((item, index) => (
            <Image
              key={index}
              source={{ uri: item.image }}
              style={styles.outfitItemImage}
            />
          ))}
          {outfit.items.length > 4 && (
            <View style={styles.moreItemsOverlay}>
              <Text style={styles.moreItemsText}>
                +{outfit.items.length - 4}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.outfitTags}>
          <Chip mode="outlined" compact style={styles.outfitTag}>
            {outfit.occasion}
          </Chip>
          <Chip mode="outlined" compact style={styles.outfitTag}>
            {outfit.temperature}°C
          </Chip>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const CalendarView = () => (
    <View style={styles.calendarContainer}>
      <Text style={styles.sectionTitle}>This Week</Text>
      <View style={styles.calendarGrid}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
          <TouchableOpacity
            key={day}
            style={styles.calendarDay}
            onPress={() => {
              /* Navigate to day planner */
            }}
          >
            <Text style={styles.calendarDayName}>{day}</Text>
            <Text style={styles.calendarDayNumber}>{index + 1}</Text>
            <View style={styles.calendarDayOutfit}>
              {/* Placeholder for outfit preview */}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const OutfitCreator = () => (
    <View style={styles.outfitCreator}>
      <View style={styles.outfitCreatorHeader}>
        <Title>Create New Outfit</Title>
        <View style={styles.outfitCreatorActions}>
          <Button
            mode="outlined"
            onPress={() => setIsCreatingOutfit(false)}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={saveOutfit}
            disabled={selectedItems.length === 0}
          >
            Save
          </Button>
        </View>
      </View>

      {/* Selected Items Preview */}
      {selectedItems.length > 0 && (
        <Card style={styles.selectedItemsCard}>
          <Card.Content>
            <Text style={styles.selectedItemsTitle}>Selected Items</Text>
            <View style={styles.selectedItemsList}>
              {selectedItems.map((item, index) => (
                <View key={index} style={styles.selectedItem}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.selectedItemImage}
                  />
                  <Text style={styles.selectedItemName}>{item.name}</Text>
                  <IconButton
                    icon="close"
                    size={16}
                    onPress={() => addItemToOutfit(item)}
                    style={styles.removeItemButton}
                  />
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Category Selection */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoryTabs}>
          {Object.entries(outfitCategories).map(([category, items]) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryTab}
              onPress={() => {
                /* Scroll to category */
              }}
            >
              <Text style={styles.categoryTabText}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <Badge style={styles.categoryBadge}>{items.length}</Badge>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Items Grid */}
      <View style={styles.itemsGrid}>
        {Object.entries(outfitCategories).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>
              {category.charAt(0).toUpperCase() + category.slice(1)} (
              {items.length})
            </Text>
            <View style={styles.categoryItems}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => addItemToOutfit(item)}
                  style={[
                    styles.itemCard,
                    selectedItems.find((selected) => selected.id === item.id) &&
                      styles.itemCardSelected,
                  ]}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />
                  {selectedItems.find(
                    (selected) => selected.id === item.id
                  ) && (
                    <View style={styles.selectedOverlay}>
                      <Ionicons name="checkmark" size={20} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const OutfitsList = () => (
    <View style={styles.outfitsList}>
      <View style={styles.outfitsHeader}>
        <Text style={styles.sectionTitle}>My Outfits</Text>
        <Button
          mode="outlined"
          onPress={() => setIsCreatingOutfit(true)}
          icon="plus"
        >
          New Outfit
        </Button>
      </View>
      <FlatList
        data={outfits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OutfitCard outfit={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.outfitsListContent}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SegmentedButtons
          value={selectedView}
          onValueChange={setSelectedView}
          buttons={[
            { value: "calendar", label: "Calendar", icon: "calendar" },
            { value: "outfits", label: "Outfits", icon: "shirt" },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Content */}
      {isCreatingOutfit ? (
        <OutfitCreator />
      ) : selectedView === "calendar" ? (
        <View style={styles.content}>
          <CalendarView />
          <OutfitsList />
        </View>
      ) : (
        <OutfitsList />
      )}

      {/* Floating Action Button */}
      {!isCreatingOutfit && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setIsCreatingOutfit(true)}
        />
      )}
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
  },
  segmentedButtons: {
    backgroundColor: "white",
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  calendarGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calendarDay: {
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
    minWidth: 40,
    elevation: 2,
  },
  calendarDayName: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  calendarDayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  calendarDayOutfit: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  outfitsList: {
    flex: 1,
  },
  outfitsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  outfitsListContent: {
    padding: 16,
    paddingTop: 0,
  },
  outfitCard: {
    marginBottom: 16,
    elevation: 2,
  },
  outfitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: "600",
  },
  outfitDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  outfitActions: {
    flexDirection: "row",
  },
  outfitItems: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  outfitItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 8,
  },
  moreItemsOverlay: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#6b7280",
    justifyContent: "center",
    alignItems: "center",
  },
  moreItemsText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  outfitTags: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  outfitTag: {
    marginRight: 8,
  },
  outfitCreator: {
    flex: 1,
    padding: 16,
  },
  outfitCreatorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  outfitCreatorActions: {
    flexDirection: "row",
  },
  cancelButton: {
    marginRight: 8,
  },
  selectedItemsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  selectedItemsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectedItemsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedItem: {
    alignItems: "center",
    marginRight: 12,
    marginBottom: 8,
  },
  selectedItemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedItemName: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  removeItemButton: {
    margin: 0,
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
  },
  categoryTabs: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryTabText: {
    fontSize: 14,
    color: "#6b7280",
    marginRight: 4,
  },
  categoryBadge: {
    backgroundColor: "#6366f1",
  },
  itemsGrid: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  categoryItems: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemCard: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
  },
  itemCardSelected: {
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(99, 102, 241, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6366f1",
  },
});

export default OutfitPlannerScreen;
