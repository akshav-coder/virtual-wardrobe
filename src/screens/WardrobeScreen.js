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
  Menu,
  IconButton,
  Badge,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../store/slices/wardrobeSlice";

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
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [menuVisible, setMenuVisible] = useState(false);

  const categories = [
    { key: "all", label: "All", icon: "grid" },
    { key: "top", label: "Tops", icon: "shirt" },
    { key: "bottom", label: "Bottoms", icon: "shirt" },
    { key: "dress", label: "Dresses", icon: "woman" },
    { key: "shoes", label: "Shoes", icon: "footsteps" },
    { key: "accessory", label: "Accessories", icon: "watch" },
    { key: "outerwear", label: "Outerwear", icon: "shirt" },
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
    <Card style={[styles.itemCard, { width: itemWidth }]}>
      <TouchableOpacity
        onPress={() => console.log("Item tapped:", item.name)}
        onLongPress={() => handleToggleFavorite(item.id)}
      >
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemOverlay}>
            <IconButton
              icon={favorites.includes(item.id) ? "heart" : "heart-outline"}
              size={20}
              iconColor={favorites.includes(item.id) ? "#ef4444" : "white"}
              onPress={() => handleToggleFavorite(item.id)}
              style={styles.favoriteButton}
            />
            <IconButton
              icon="more-vert"
              size={20}
              iconColor="white"
              onPress={() => {
                /* Show item menu */
              }}
              style={styles.moreButton}
            />
          </View>
          {item.isNew && <Badge style={styles.newBadge}>New</Badge>}
        </View>
        <Card.Content style={styles.itemContent}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemBrand} numberOfLines={1}>
            {item.brand || "Unknown Brand"}
          </Text>
          <View style={styles.itemTags}>
            <Chip mode="outlined" compact style={styles.itemTag}>
              {item.color}
            </Chip>
            <Chip mode="outlined" compact style={styles.itemTag}>
              {item.size}
            </Chip>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  const ListItem = ({ item }) => (
    <Card style={styles.listItemCard}>
      <TouchableOpacity
        onPress={() => console.log("Item tapped:", item.name)}
        onLongPress={() => handleToggleFavorite(item.id)}
      >
        <View style={styles.listItemContent}>
          <Image source={{ uri: item.image }} style={styles.listItemImage} />
          <View style={styles.listItemInfo}>
            <Text style={styles.listItemName}>{item.name}</Text>
            <Text style={styles.listItemBrand}>
              {item.brand || "Unknown Brand"}
            </Text>
            <View style={styles.listItemTags}>
              <Chip mode="outlined" compact style={styles.listItemTag}>
                {item.color}
              </Chip>
              <Chip mode="outlined" compact style={styles.listItemTag}>
                {item.size}
              </Chip>
            </View>
          </View>
          <View style={styles.listItemActions}>
            <IconButton
              icon={favorites.includes(item.id) ? "heart" : "heart-outline"}
              size={20}
              iconColor={favorites.includes(item.id) ? "#ef4444" : "#9ca3af"}
              onPress={() => handleToggleFavorite(item.id)}
            />
            <IconButton
              icon="more-vert"
              size={20}
              iconColor="#9ca3af"
              onPress={() => {
                /* Show item menu */
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  const CategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}
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
        >
          <Ionicons
            name={category.icon}
            size={16}
            color={selectedCategory === category.key ? "#6366f1" : "#6b7280"}
          />
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
      <Title style={styles.emptyTitle}>No items found</Title>
      <Paragraph style={styles.emptyDescription}>
        {searchQuery
          ? "Try adjusting your search terms"
          : "Add your first clothing item to get started"}
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("AddItem")}
        style={styles.emptyButton}
      >
        Add First Item
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search your wardrobe..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <View style={styles.headerActions}>
          <IconButton
            icon={viewMode === "grid" ? "view-grid" : "view-list"}
            size={24}
            onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          />
          <SortMenu />
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
          key={viewMode} // Force re-render when view mode changes
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
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
    paddingTop: 60,
  },
  searchbar: {
    flex: 1,
    marginRight: 8,
  },
  headerActions: {
    flexDirection: "row",
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryFilterContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
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
  categoryChipActive: {
    backgroundColor: "#e0e7ff",
    borderColor: "#6366f1",
  },
  categoryChipText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  categoryChipTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  wardrobeList: {
    padding: 16,
    paddingTop: 0,
  },
  itemCard: {
    marginBottom: 16,
    marginRight: 16,
    elevation: 2,
  },
  itemImageContainer: {
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: itemWidth * 1.2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
  },
  favoriteButton: {
    margin: 0,
  },
  moreButton: {
    margin: 0,
  },
  newBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#10b981",
  },
  itemContent: {
    padding: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  itemTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemTag: {
    marginRight: 4,
    marginBottom: 4,
  },
  listItemCard: {
    marginBottom: 8,
    elevation: 2,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
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
    color: "#1f2937",
    marginBottom: 4,
  },
  listItemBrand: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  listItemTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  listItemTag: {
    marginRight: 4,
    marginBottom: 4,
  },
  listItemActions: {
    flexDirection: "row",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    textAlign: "center",
    marginBottom: 24,
    color: "#6b7280",
  },
  emptyButton: {
    borderRadius: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6366f1",
  },
});

export default WardrobeScreen;
