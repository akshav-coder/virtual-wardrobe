import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Share,
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
  IconButton,
  FAB,
  Menu,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetOutfitQuery,
  useDeleteOutfitMutation,
  useToggleFavoriteMutation,
  useUpdateOutfitMutation,
} from "../services";
import { showErrorMessage, showSuccessMessage } from "../utils/apiUtils";

const { width } = Dimensions.get("window");

const OutfitDetailScreen = ({ route, navigation }) => {
  const { outfit: initialOutfit } = route.params;
  const auth = useSelector((state) => state.auth);
  const [menuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // API hooks
  const {
    data: outfit,
    isLoading,
    error,
    refetch,
  } = useGetOutfitQuery(initialOutfit._id || initialOutfit.id, {
    skip: !auth.isAuthenticated || !(initialOutfit._id || initialOutfit.id),
  });

  const [deleteOutfit, { isLoading: isDeleting }] = useDeleteOutfitMutation();
  const [toggleFavorite, { isLoading: isTogglingFavorite }] =
    useToggleFavoriteMutation();
  const [updateOutfit, { isLoading: isUpdating }] = useUpdateOutfitMutation();

  // Use initial outfit data if API call is skipped or failed
  const displayOutfit = outfit || initialOutfit;

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      showSuccessMessage("Outfit data refreshed");
    } catch (error) {
      showErrorMessage("Failed to refresh outfit data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my outfit: ${displayOutfit.name}`,
        title: displayOutfit.name,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(displayOutfit._id || displayOutfit.id).unwrap();
      showSuccessMessage("Favorite status updated");
    } catch (error) {
      showErrorMessage("Failed to update favorite status");
    }
  };

  const handleDeleteOutfit = async () => {
    try {
      await deleteOutfit(displayOutfit._id || displayOutfit.id).unwrap();
      showSuccessMessage("Outfit deleted successfully");
      navigation.goBack();
    } catch (error) {
      showErrorMessage("Failed to delete outfit");
    }
  };

  const OutfitHeader = () => (
    <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.outfitHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerInfo}>
          <Title style={styles.outfitTitle}>{displayOutfit.name}</Title>
          <Text style={styles.outfitDate}>
            {new Date(displayOutfit.createdAt).toLocaleDateString()}
          </Text>
          <View style={styles.outfitTags}>
            <Chip mode="outlined" compact style={styles.outfitTag}>
              {displayOutfit.occasion || "Casual"}
            </Chip>
            <Chip mode="outlined" compact style={styles.outfitTag}>
              {displayOutfit.temperature || 22}°C
            </Chip>
            <Chip mode="outlined" compact style={styles.outfitTag}>
              {displayOutfit.weather || "Sunny"}
            </Chip>
          </View>
        </View>
        <View style={styles.headerActions}>
          <IconButton
            icon={displayOutfit.isFavorite ? "heart" : "heart-outline"}
            size={24}
            iconColor="white"
            onPress={handleToggleFavorite}
            disabled={isTogglingFavorite}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={24}
                iconColor="white"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                handleShare();
              }}
              title="Share"
              leadingIcon="share"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                handleToggleFavorite();
              }}
              title={
                displayOutfit.isFavorite
                  ? "Remove from Favorites"
                  : "Add to Favorites"
              }
              leadingIcon={displayOutfit.isFavorite ? "heart-off" : "heart"}
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                handleDeleteOutfit();
              }}
              title="Delete"
              leadingIcon="delete"
            />
          </Menu>
        </View>
      </View>
    </LinearGradient>
  );

  const OutfitItems = () => (
    <Card style={styles.itemsCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Items in this outfit</Title>
        <View style={styles.itemsGrid}>
          {displayOutfit.items?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.itemCard}
              onPress={() => console.log("Item tapped:", item.name)}
            >
              <Image
                source={{ uri: item.image || item.imageUrl }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
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
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const OutfitStats = () => (
    <Card style={styles.statsCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Outfit Stats</Title>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="shirt" size={24} color="#6366f1" />
            <Text style={styles.statNumber}>
              {displayOutfit.items?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={24} color="#10b981" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Times Worn</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={24} color="#ef4444" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Style Score</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const OutfitNotes = () => (
    <Card style={styles.notesCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Notes</Title>
        <Text style={styles.notesText}>
          {displayOutfit.notes || "No notes added for this outfit."}
        </Text>
        <Button
          mode="outlined"
          onPress={() => {
            /* Edit notes */
          }}
          style={styles.editNotesButton}
        >
          Add Notes
        </Button>
      </Card.Content>
    </Card>
  );

  const SimilarOutfits = () => (
    <Card style={styles.similarCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Similar Outfits</Title>
        <View style={styles.similarOutfits}>
          <TouchableOpacity style={styles.similarOutfit}>
            <Image
              source={{ uri: "https://via.placeholder.com/60" }}
              style={styles.similarImage}
            />
            <Text style={styles.similarName}>Casual Friday</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.similarOutfit}>
            <Image
              source={{ uri: "https://via.placeholder.com/60" }}
              style={styles.similarImage}
            />
            <Text style={styles.similarName}>Weekend Look</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.similarOutfit}>
            <Image
              source={{ uri: "https://via.placeholder.com/60" }}
              style={styles.similarImage}
            />
            <Text style={styles.similarName}>Date Night</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const ActionButtons = () => (
    <View style={styles.actionButtons}>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("Main", { screen: "Planner" })}
        style={styles.actionButton}
        icon="calendar"
      >
        Plan Similar
      </Button>
      <Button
        mode="contained"
        onPress={handleShare}
        style={styles.actionButton}
        icon="share"
      >
        Share Outfit
      </Button>
    </View>
  );

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading outfit details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <OutfitHeader />
        <View style={styles.body}>
          <OutfitItems />
          <OutfitStats />
          <OutfitNotes />
          <SimilarOutfits />
        </View>
      </ScrollView>

      <ActionButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  content: {
    flex: 1,
  },
  outfitHeader: {
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerInfo: {
    flex: 1,
  },
  outfitTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  outfitDate: {
    color: "white",
    opacity: 0.8,
    marginBottom: 12,
  },
  outfitTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outfitTag: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerActions: {
    flexDirection: "row",
  },
  body: {
    padding: 16,
  },
  itemsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: "white",
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: 120,
  },
  itemInfo: {
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
  statsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    width: (width - 64) / 2,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  notesCard: {
    marginBottom: 16,
    elevation: 2,
  },
  notesText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  editNotesButton: {
    alignSelf: "flex-start",
  },
  similarCard: {
    marginBottom: 16,
    elevation: 2,
  },
  similarOutfits: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  similarOutfit: {
    alignItems: "center",
    flex: 1,
  },
  similarImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarName: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
});

export default OutfitDetailScreen;
