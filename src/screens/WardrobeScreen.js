import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  TextInput,
} from "react-native";
import { Text, FAB, Menu, IconButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../store/slices/wardrobeSlice";
import { theme } from "../theme/theme";

const { width } = Dimensions.get("window");
const itemWidth = (width - 48) / 2;

const WardrobeScreen = ({ navigation }) => {
  const wardrobe = useSelector((state) => state.wardrobe.items);
  const dispatch = useDispatch();

  const favorites = wardrobe.filter((item) => item.isFavorite);

  const handleToggleFavorite = (itemId) => {
    dispatch(toggleFavorite(itemId));
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [menuVisible, setMenuVisible] = useState(false);

  const getColorHex = (colorName) => {
    const colorMap = {
      White: "#ffffff",
      Black: "#000000",
      Blue: "#3b82f6",
      Navy: "#1e3a8a",
      Gray: "#6b7280",
      Red: "#ef4444",
      Green: "#10b981",
      Brown: "#92400e",
      Beige: "#f3e8ff",
      Multi: "#8b5cf6",
      Gold: "#f59e0b",
    };
    return colorMap[colorName] || "#6b7280";
  };

  const categories = [
    { key: "all", label: "All", icon: "grid-outline", color: "#6366f1" },
    { key: "top", label: "Tops", icon: "shirt-outline", color: "#ec4899" },
    { key: "bottom", label: "Bottoms", icon: "body-outline", color: "#10b981" },
    { key: "dress", label: "Dresses", icon: "woman-outline", color: "#f59e0b" },
    {
      key: "shoes",
      label: "Shoes",
      icon: "footsteps-outline",
      color: "#8b5cf6",
    },
    {
      key: "accessory",
      label: "Accessories",
      icon: "watch-outline",
      color: "#ef4444",
    },
    {
      key: "outerwear",
      label: "Outerwear",
      icon: "shirt-outline",
      color: "#06b6d4",
    },
  ];

  const filteredWardrobe = useMemo(() => {
    let filtered = wardrobe;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.color?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Sort items (create a copy to avoid mutating Redux state)
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "name":
          return a.name.localeCompare(b.name);
        case "brand":
          return (a.brand || "").localeCompare(b.brand || "");
        case "color":
          return (a.color || "").localeCompare(b.color || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [wardrobe, searchQuery, selectedCategory, sortBy]);

  const WardrobeItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.itemCard, { width: itemWidth }]}
      onPress={() => console.log("Item tapped:", item.name)}
      activeOpacity={0.7}
    >
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleToggleFavorite(item.id)}
        >
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={item.isFavorite ? "#ef4444" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemBrand} numberOfLines={1}>
          {item.brand || "Unknown Brand"}
        </Text>
        <View style={styles.itemTags}>
          <Text style={styles.itemTag}>{item.color}</Text>
          <Text style={styles.itemTag}>•</Text>
          <Text style={styles.itemTag}>{item.size}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItemCard}
      onPress={() => console.log("Item tapped:", item.name)}
      activeOpacity={0.7}
    >
      <View style={styles.listItemContent}>
        <Image source={{ uri: item.image }} style={styles.listItemImage} />
        <View style={styles.listItemInfo}>
          <Text style={styles.listItemName}>{item.name}</Text>
          <Text style={styles.listItemBrand}>
            {item.brand || "Unknown Brand"}
          </Text>
          <Text style={styles.listItemTags}>
            {item.color} • {item.size}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.listFavoriteButton}
          onPress={() => handleToggleFavorite(item.id)}
        >
          <Ionicons
            name={item.isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={item.isFavorite ? "#ef4444" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const CategoryFilter = () => (
    <View style={styles.categoryFilterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryFilterContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            onPress={() => setSelectedCategory(category.key)}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.categoryChipActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.key &&
                  styles.categoryChipTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const SortMenu = () => (
    <Menu
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
      anchor={
        <IconButton
          icon="sort"
          size={24}
          onPress={() => setMenuVisible(true)}
        />
      }
    >
      <Menu.Item
        onPress={() => {
          setSortBy("recent");
          setMenuVisible(false);
        }}
        title="Most Recent"
        leadingIcon="clock"
      />
      <Menu.Item
        onPress={() => {
          setSortBy("name");
          setMenuVisible(false);
        }}
        title="Name A-Z"
        leadingIcon="sort-alphabetical-ascending"
      />
      <Menu.Item
        onPress={() => {
          setSortBy("brand");
          setMenuVisible(false);
        }}
        title="Brand"
        leadingIcon="tag"
      />
      <Menu.Item
        onPress={() => {
          setSortBy("color");
          setMenuVisible(false);
        }}
        title="Color"
        leadingIcon="palette"
      />
    </Menu>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="shirt-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No items found" : "Your wardrobe is empty"}
      </Text>
      <Text style={styles.emptyDescription}>
        {searchQuery
          ? "Try adjusting your search terms"
          : "Add your first clothing item"}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate("AddItem")}
      >
        <Text style={styles.emptyButtonText}>
          {searchQuery ? "Clear Search" : "Add Item"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Wardrobe</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.viewModeButton}
              onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              <Ionicons
                name={viewMode === "grid" ? "grid-outline" : "list-outline"}
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>
            <SortMenu />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Category Filter */}
      <CategoryFilter />

      {/* Wardrobe Content */}
      {filteredWardrobe.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredWardrobe}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === "grid" ? 2 : 1}
          key={viewMode}
          renderItem={({ item }) =>
            viewMode === "grid" ? (
              <WardrobeItem item={item} />
            ) : (
              <ListItem item={item} />
            )
          }
          contentContainerStyle={styles.wardrobeList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddItem")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewModeButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },
  categoryFilterContainer: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryChipActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  categoryChipText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  wardrobeList: {
    padding: 20,
  },
  itemCard: {
    marginBottom: 16,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  itemImageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: itemWidth * 1.2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 6,
  },
  itemContent: {
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  itemTags: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTag: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 4,
  },
  listItemCard: {
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  listItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  listItemInfo: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  listItemBrand: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  listItemTags: {
    fontSize: 12,
    color: "#6b7280",
  },
  listFavoriteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  emptyDescription: {
    textAlign: "center",
    marginBottom: 24,
    color: "#6b7280",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: "#6366f1",
  },
});

export default WardrobeScreen;
