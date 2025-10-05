import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  StatusBar,
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
  Divider,
} from "react-native-paper";
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
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [menuVisible, setMenuVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

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
    <Animated.View style={{ opacity: fadeAnim }}>
      <Card style={[styles.itemCard, { width: itemWidth }]} elevation={3}>
        <TouchableOpacity
          onPress={() => console.log("Item tapped:", item.name)}
          onLongPress={() => handleToggleFavorite(item.id)}
          activeOpacity={0.8}
        >
          <View style={styles.itemImageContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemOverlay}>
              <View style={styles.overlayButton}>
                <IconButton
                  icon={item.isFavorite ? "heart" : "heart-outline"}
                  size={18}
                  iconColor={item.isFavorite ? "#ef4444" : "white"}
                  onPress={() => handleToggleFavorite(item.id)}
                  style={styles.favoriteButton}
                />
              </View>
              <View style={styles.overlayButton}>
                <IconButton
                  icon="dots-vertical"
                  size={18}
                  iconColor="white"
                  onPress={() => {
                    /* Show item menu */
                  }}
                  style={styles.moreButton}
                />
              </View>
            </View>
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
            {item.wearCount > 0 && (
              <View style={styles.wearCountBadge}>
                <Ionicons name="repeat" size={12} color="white" />
                <Text style={styles.wearCountText}>{item.wearCount}</Text>
              </View>
            )}
          </View>
          <Card.Content style={styles.itemContent}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemBrand} numberOfLines={1}>
              {item.brand || "Unknown Brand"}
            </Text>
            <View style={styles.itemTags}>
              <View
                style={[
                  styles.colorTag,
                  { backgroundColor: getColorHex(item.color) },
                ]}
              >
                <Text style={styles.colorTagText}>{item.color}</Text>
              </View>
              <Chip mode="outlined" compact style={styles.itemTag}>
                {item.size}
              </Chip>
            </View>
            {item.price && <Text style={styles.itemPrice}>${item.price}</Text>}
          </Card.Content>
        </TouchableOpacity>
      </Card>
    </Animated.View>
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
              icon="dots-vertical"
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
    <View style={styles.categoryFilterContainer}>
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
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.categoryIconContainer,
                selectedCategory === category.key && {
                  backgroundColor: category.color + "20",
                },
              ]}
            >
              <Ionicons
                name={category.icon}
                size={18}
                color={
                  selectedCategory === category.key ? category.color : "#6b7280"
                }
              />
            </View>
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

  const SkeletonItem = () => (
    <View style={[styles.itemCard, { width: itemWidth }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: "70%" }]} />
        <View style={styles.skeletonTags}>
          <View style={styles.skeletonTag} />
          <View style={styles.skeletonTag} />
        </View>
      </View>
    </View>
  );

  const SkeletonList = () => (
    <View style={styles.wardrobeList}>
      {viewMode === "grid" ? (
        <View style={styles.skeletonGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <SkeletonItem key={item} />
          ))}
        </View>
      ) : (
        <View>
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={styles.listItemCard}>
              <View style={styles.listItemContent}>
                <View style={styles.skeletonListImage} />
                <View style={styles.listItemInfo}>
                  <View style={styles.skeletonLine} />
                  <View style={[styles.skeletonLine, { width: "60%" }]} />
                  <View style={styles.skeletonTags}>
                    <View style={styles.skeletonTag} />
                    <View style={styles.skeletonTag} />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="shirt-outline" size={80} color="#d1d5db" />
        <View style={styles.emptyIconBackground} />
      </View>
      <Title style={styles.emptyTitle}>
        {searchQuery ? "No items found" : "Your wardrobe is empty"}
      </Title>
      <Paragraph style={styles.emptyDescription}>
        {searchQuery
          ? "Try adjusting your search terms or browse all categories"
          : "Start building your digital wardrobe by adding your first clothing item"}
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("AddItem")}
        style={styles.emptyButton}
        contentStyle={styles.emptyButtonContent}
        labelStyle={styles.emptyButtonLabel}
      >
        {searchQuery ? "Clear Search" : "Add First Item"}
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>My Wardrobe</Text>
            <Text style={styles.headerSubtitle}>
              {filteredWardrobe.length}{" "}
              {filteredWardrobe.length === 1 ? "item" : "items"}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <IconButton
              icon={
                viewMode === "grid" ? "view-grid-outline" : "view-list-outline"
              }
              size={24}
              iconColor={theme.colors.primary}
              onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              style={styles.headerActionButton}
            />
            <SortMenu />
          </View>
        </View>

        <Searchbar
          placeholder="Search your wardrobe..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchbarInput}
        />
      </View>

      {/* Category Filter */}
      <CategoryFilter />

      {/* Wardrobe Content */}
      {isLoading ? (
        <SkeletonList />
      ) : filteredWardrobe.length === 0 ? (
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
        label="Add Item"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerActionButton: {
    margin: 0,
    backgroundColor: theme.colors.primaryContainer,
  },
  searchbar: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 16,
    elevation: 0,
    shadowOpacity: 0,
  },
  searchbarInput: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  categoryFilterContainer: {
    backgroundColor: theme.colors.surface,
    paddingVertical: 16,
    marginTop: 8,
  },
  categoryFilter: {
    marginBottom: 0,
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    minWidth: 100,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primaryContainer,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  wardrobeList: {
    padding: 20,
    paddingTop: 8,
  },
  itemCard: {
    marginBottom: 20,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  itemImageContainer: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: itemWidth * 1.3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
  },
  overlayButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    marginLeft: 4,
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
    backgroundColor: theme.colors.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  wearCountBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  wearCountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 2,
  },
  itemContent: {
    padding: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 12,
    fontWeight: "500",
  },
  itemTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
  },
  colorTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  colorTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  itemTag: {
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: theme.colors.surfaceVariant,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  listItemCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  listItemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
  },
  listItemInfo: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  listItemBrand: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
    fontWeight: "500",
  },
  listItemTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  listItemTag: {
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: theme.colors.surfaceVariant,
  },
  listItemActions: {
    flexDirection: "row",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIconContainer: {
    position: "relative",
    marginBottom: 24,
  },
  emptyIconBackground: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surfaceVariant,
    top: -20,
    left: -20,
  },
  emptyTitle: {
    marginBottom: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  emptyDescription: {
    textAlign: "center",
    marginBottom: 32,
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
    lineHeight: 24,
  },
  emptyButton: {
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
  },
  emptyButtonContent: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  emptyButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
  },
  // Skeleton Loading Styles
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skeletonImage: {
    width: "100%",
    height: itemWidth * 1.3,
    backgroundColor: theme.colors.surfaceVariant,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 8,
    marginBottom: 8,
    width: "100%",
  },
  skeletonTags: {
    flexDirection: "row",
    marginTop: 8,
  },
  skeletonTag: {
    height: 24,
    width: 60,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    marginRight: 8,
  },
  skeletonListImage: {
    width: 70,
    height: 70,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    marginRight: 16,
  },
});

export default WardrobeScreen;
