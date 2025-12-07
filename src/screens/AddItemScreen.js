import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Chip,
  Surface,
  Text,
  FAB,
  SegmentedButtons,
  IconButton,
  RadioButton,
  Portal,
  Modal,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useCreateItemMutation, useUploadImageMutation } from "../services";
import {
  showErrorMessage,
  showSuccessMessage,
  createFormData,
} from "../utils/apiUtils";

const { width } = Dimensions.get("window");

const AddItemScreen = ({ navigation }) => {
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [selectedMethod, setSelectedMethod] = useState("camera");
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    color: "",
    size: "",
    price: "",
    notes: "",
    tags: [],
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  const categories = [
    { key: "top", label: "Top", icon: "shirt" },
    { key: "bottom", label: "Bottom", icon: "shirt" },
    { key: "dress", label: "Dress", icon: "woman" },
    { key: "shoes", label: "Shoes", icon: "footsteps" },
    { key: "accessory", label: "Accessory", icon: "watch" },
    { key: "outerwear", label: "Outerwear", icon: "shirt" },
    { key: "underwear", label: "Underwear", icon: "shirt-outline" },
    { key: "swimwear", label: "Swimwear", icon: "water" },
  ];

  const colors = [
    "Black",
    "White",
    "Gray",
    "Brown",
    "Beige",
    "Navy",
    "Blue",
    "Green",
    "Red",
    "Pink",
    "Purple",
    "Yellow",
    "Orange",
    "Multi",
  ];

  const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
  ];



  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields."
      );
      return;
    }

    try {
      let imageUrl = null;

      if (image) {
        const formData = new FormData();
        formData.append("image", {
          uri: image,
          name: "photo.jpg",
          type: "image/jpeg",
        });

        const uploadResult = await uploadImage(formData).unwrap();
        imageUrl = uploadResult.data.image.url;
      }

      const newItem = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        color: formData.color,
        size: formData.size,
        price: formData.price ? parseFloat(formData.price) : undefined,
        notes: formData.notes,
        tags: formData.tags,
        season: "all-season", // Default value
        occasions: ["casual"], // Default value
        minTemperature: 10, // Default values
        maxTemperature: 30,
        imageUrl: imageUrl,
      };

      await createItem(newItem).unwrap();
      showSuccessMessage("Item added to your wardrobe!", Alert.alert);
      navigation.goBack();
    } catch (error) {
      showErrorMessage(error, Alert.alert, "Failed to add item");
      console.log(error);
    }
  };

  const CategoryModal = () => (
    <Portal>
      <Modal
        visible={showCategoryModal}
        onDismiss={() => setShowCategoryModal(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Title style={styles.modalTitle}>Select Category</Title>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryOption,
                formData.category === category.key &&
                styles.categoryOptionSelected,
              ]}
              onPress={() => {
                setFormData({ ...formData, category: category.key });
                setShowCategoryModal(false);
              }}
            >
              <Ionicons
                name={category.icon}
                size={24}
                color={
                  formData.category === category.key ? "#6366f1" : "#6b7280"
                }
              />
              <Text
                style={[
                  styles.categoryOptionText,
                  formData.category === category.key &&
                  styles.categoryOptionTextSelected,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </Portal>
  );

  const ColorModal = () => (
    <Portal>
      <Modal
        visible={showColorModal}
        onDismiss={() => setShowColorModal(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Title style={styles.modalTitle}>Select Color</Title>
        <View style={styles.colorGrid}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                formData.color === color && styles.colorOptionSelected,
              ]}
              onPress={() => {
                setFormData({ ...formData, color: color });
                setShowColorModal(false);
              }}
            >
              <Text
                style={[
                  styles.colorOptionText,
                  formData.color === color && styles.colorOptionTextSelected,
                ]}
              >
                {color}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </Portal>
  );

  const SizeModal = () => (
    <Portal>
      <Modal
        visible={showSizeModal}
        onDismiss={() => setShowSizeModal(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Title style={styles.modalTitle}>Select Size</Title>
        <View style={styles.sizeGrid}>
          {sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeOption,
                formData.size === size && styles.sizeOptionSelected,
              ]}
              onPress={() => {
                setFormData({ ...formData, size: size });
                setShowSizeModal(false);
              }}
            >
              <Text
                style={[
                  styles.sizeOptionText,
                  formData.size === size && styles.sizeOptionTextSelected,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add New Item</Text>
          <Text style={styles.headerSubtitle}>Fill in the details below</Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageCard}>
          <Text style={styles.sectionTitle}>📸 Add Photo</Text>

          <View style={styles.imageSection}>
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.itemImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imagePlaceholder}
                onPress={() => selectedMethod === 'camera' ? takePhoto() : pickImage()}
              >
                <View style={styles.placeholderIcon}>
                  <Ionicons
                    name={selectedMethod === 'camera' ? "camera" : "images"}
                    size={32}
                    color="#6366f1"
                  />
                </View>
                <Text style={styles.imagePlaceholderText}>
                  {selectedMethod === 'camera' ? "Take a photo" : "Select from gallery"}
                </Text>
                <Text style={styles.imagePlaceholderSubtext}>
                  Tap to {selectedMethod === 'camera' ? "capture" : "upload"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.methodSelectorContainer}>
            <TouchableOpacity
              style={[
                styles.methodButton,
                selectedMethod === "camera" && styles.methodButtonActive,
              ]}
              onPress={() => setSelectedMethod("camera")}
            >
              <Ionicons
                name="camera"
                size={20}
                color={selectedMethod === "camera" ? "#6366f1" : "#6b7280"}
              />
              <Text
                style={[
                  styles.methodButtonText,
                  selectedMethod === "camera" && styles.methodButtonTextActive,
                ]}
              >
                Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.methodButton,
                selectedMethod === "gallery" && styles.methodButtonActive,
              ]}
              onPress={() => setSelectedMethod("gallery")}
            >
              <Ionicons
                name="images"
                size={20}
                color={selectedMethod === "gallery" ? "#6366f1" : "#6b7280"}
              />
              <Text
                style={[
                  styles.methodButtonText,
                  selectedMethod === "gallery" && styles.methodButtonTextActive,
                ]}
              >
                Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Basic Information */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>📝 Basic Information</Text>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Item Name *</Text>
              <TextInput
                placeholder="Enter item name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                style={styles.input}
                mode="outlined"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Brand</Text>
              <TextInput
                placeholder="Enter brand name"
                value={formData.brand}
                onChangeText={(text) =>
                  setFormData({ ...formData, brand: text })
                }
                style={styles.input}
                mode="outlined"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price</Text>
              <TextInput
                placeholder="0.00"
                value={formData.price}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: text })
                }
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Size</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setShowSizeModal(true)}
              >
                <Text style={styles.selectorText}>
                  {formData.size || "Select"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category *</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={styles.selectorText}>
                  {formData.category
                    ? categories.find((c) => c.key === formData.category)?.label
                    : "Select category"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Color</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setShowColorModal(true)}
              >
                <Text style={styles.selectorText}>
                  {formData.color || "Select color"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChangeText={(text) =>
                  setFormData({ ...formData, notes: text })
                }
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        {/* Quick Add Options */}
        <View style={styles.quickAddCard}>
          <Text style={styles.sectionTitle}>⚡ Quick Add</Text>
          <Text style={styles.quickAddDescription}>
            Save time by importing from product URLs
          </Text>
          <View style={styles.urlInputContainer}>
            <TextInput
              placeholder="Paste product URL here..."
              style={styles.urlInput}
              mode="outlined"
            />
            <TouchableOpacity style={styles.importButton}>
              <Ionicons name="download" size={20} color="#6366f1" />
              <Text style={styles.importButtonText}>Import</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!formData.name || !formData.category || isCreating || isUploading) &&
            styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!formData.name || !formData.category || isCreating || isUploading}
        >
          {isCreating || isUploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="checkmark-circle" size={20} color="white" />
          )}
          <Text style={styles.saveButtonText}>
            {isCreating || isUploading ? "Adding..." : "Add to Wardrobe"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <CategoryModal />
      <ColorModal />
      <SizeModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  imageCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  itemImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 4,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  placeholderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginBottom: 4,
  },
  imagePlaceholderSubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  methodSelectorContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
  },
  methodButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  methodButtonActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginLeft: 8,
  },
  methodButtonTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    minHeight: 56,
  },
  selectorText: {
    fontSize: 16,
    color: "#374151",
  },
  quickAddCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickAddDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  urlInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  urlInput: {
    flex: 1,
    backgroundColor: "white",
  },
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    minHeight: 56,
  },
  importButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
    marginLeft: 6,
  },
  saveButtonContainer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 16,
    padding: 24,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  categoryOption: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    width: (width - 100) / 2,
  },
  categoryOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#e0e7ff",
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  categoryOptionTextSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  colorOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#e0e7ff",
  },
  colorOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  colorOptionTextSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
  sizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    minWidth: 60,
    alignItems: "center",
  },
  sizeOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#e0e7ff",
  },
  sizeOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  sizeOptionTextSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
});

export default AddItemScreen;
