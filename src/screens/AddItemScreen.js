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
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
import { addItem } from "../store/slices/wardrobeSlice";

const { width } = Dimensions.get("window");

const AddItemScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState("camera");
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    color: "",
    size: "",
    price: "",
    image: null,
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

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera roll is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access camera is required!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.image) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields and add an image."
      );
      return;
    }

    const newItem = {
      ...formData,
      isNew: true,
      wearCount: 0,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    dispatch(addItem(newItem));
    Alert.alert("Success", "Item added to your wardrobe!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
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
        {/* Image Section */}
        <Card style={styles.imageCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Item Photo</Title>
            <View style={styles.imageSection}>
              {formData.image ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: formData.image }}
                    style={styles.itemImage}
                  />
                  <IconButton
                    icon="close"
                    size={20}
                    iconColor="white"
                    style={styles.removeImageButton}
                    onPress={() => setFormData({ ...formData, image: null })}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.imagePlaceholder}
                  onPress={
                    selectedMethod === "camera"
                      ? handleCamera
                      : handleImagePicker
                  }
                >
                  <Ionicons name="camera" size={48} color="#9ca3af" />
                  <Text style={styles.imagePlaceholderText}>
                    Tap to{" "}
                    {selectedMethod === "camera"
                      ? "take photo"
                      : "select image"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <SegmentedButtons
              value={selectedMethod}
              onValueChange={setSelectedMethod}
              buttons={[
                { value: "camera", label: "Camera", icon: "camera" },
                { value: "gallery", label: "Gallery", icon: "image" },
              ]}
              style={styles.methodSelector}
            />
          </Card.Content>
        </Card>

        {/* Basic Information */}
        <Card style={styles.formCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Basic Information</Title>

            <TextInput
              label="Item Name *"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Brand"
              value={formData.brand}
              onChangeText={(text) => setFormData({ ...formData, brand: text })}
              style={styles.input}
              mode="outlined"
            />

            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={styles.selectorLabel}>Category *</Text>
              <View style={styles.selectorContent}>
                <Text style={styles.selectorText}>
                  {formData.category
                    ? categories.find((c) => c.key === formData.category)?.label
                    : "Select category"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowColorModal(true)}
            >
              <Text style={styles.selectorLabel}>Color</Text>
              <View style={styles.selectorContent}>
                <Text style={styles.selectorText}>
                  {formData.color || "Select color"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowSizeModal(true)}
            >
              <Text style={styles.selectorLabel}>Size</Text>
              <View style={styles.selectorContent}>
                <Text style={styles.selectorText}>
                  {formData.size || "Select size"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
              </View>
            </TouchableOpacity>

            <TextInput
              label="Price"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
            />

            <TextInput
              label="Notes"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
          </Card.Content>
        </Card>

        {/* Quick Add Options */}
        <Card style={styles.quickAddCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Add</Title>
            <Paragraph style={styles.quickAddDescription}>
              Add items quickly by pasting a product URL
            </Paragraph>
            <TextInput
              label="Product URL"
              placeholder="https://example.com/product"
              style={styles.input}
              mode="outlined"
            />
            <Button
              mode="outlined"
              onPress={() => {
                /* Handle URL import */
              }}
              style={styles.quickAddButton}
            >
              Import from URL
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          disabled={!formData.name || !formData.category || !formData.image}
        >
          Add to Wardrobe
        </Button>
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
  },
  itemImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: "#6b7280",
    textAlign: "center",
  },
  methodSelector: {
    marginTop: 8,
  },
  formCard: {
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  selectorButton: {
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  selectorLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  selectorContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
    color: "#1f2937",
  },
  quickAddCard: {
    marginBottom: 16,
    elevation: 2,
  },
  quickAddDescription: {
    color: "#6b7280",
    marginBottom: 16,
  },
  quickAddButton: {
    marginTop: 8,
  },
  saveButtonContainer: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  saveButton: {
    borderRadius: 8,
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryOption: {
    alignItems: "center",
    padding: 12,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
    width: (width - 80) / 2,
  },
  categoryOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#e0e7ff",
  },
  categoryOptionText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  categoryOptionTextSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  colorOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
  },
  colorOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#e0e7ff",
  },
  colorOptionText: {
    fontSize: 14,
    color: "#6b7280",
  },
  colorOptionTextSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
  sizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
    minWidth: 50,
    alignItems: "center",
  },
  sizeOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#e0e7ff",
  },
  sizeOptionText: {
    fontSize: 14,
    color: "#6b7280",
  },
  sizeOptionTextSelected: {
    color: "#6366f1",
    fontWeight: "600",
  },
});

export default AddItemScreen;
