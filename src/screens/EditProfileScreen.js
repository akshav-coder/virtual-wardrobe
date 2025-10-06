import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";
import {
  Card,
  Title,
  TextInput,
  Button,
  Text,
  Divider,
  IconButton,
  Surface,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePreferencesMutation,
  useUpdateBodyMeasurementsMutation,
} from "../services";
import { showErrorMessage, showSuccessMessage } from "../utils/apiUtils";

const { width } = Dimensions.get("window");

const EditProfileScreen = ({ navigation }) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // API hooks
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetProfileQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();

  const [updatePreferences, { isLoading: isUpdatingPreferences }] =
    useUpdatePreferencesMutation();

  const [updateBodyMeasurements, { isLoading: isUpdatingMeasurements }] =
    useUpdateBodyMeasurementsMutation();

  const user = profileData?.data?.user;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    // Body measurements (like a tailor)
    height: "",
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    inseam: "",
    shoulder: "",
    sleeve: "",
    neck: "",
    shoeSize: "",
    // Style preferences
    favoriteColors: "",
    favoriteBrands: "",
    styleType: "casual",
    budget: "1000",
  });

  // Update profile state when user data is loaded
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        // Body measurements
        height: user.bodyMeasurements?.height || "",
        weight: user.bodyMeasurements?.weight || "",
        chest: user.bodyMeasurements?.chest || "",
        waist: user.bodyMeasurements?.waist || "",
        hips: user.bodyMeasurements?.hips || "",
        inseam: user.bodyMeasurements?.inseam || "",
        shoulder: user.bodyMeasurements?.shoulder || "",
        sleeve: user.bodyMeasurements?.sleeve || "",
        neck: user.bodyMeasurements?.neck || "",
        shoeSize: user.bodyMeasurements?.shoeSize || "",
        // Style preferences
        favoriteColors: user.preferences?.colors?.join(", ") || "",
        favoriteBrands: user.preferences?.brands?.join(", ") || "",
        styleType: user.preferences?.style || "casual",
        budget: user.preferences?.budget?.toString() || "1000",
      });
    }
  }, [user]);

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (auth.isAuthenticated) {
        await refetchProfile();
      }
      showSuccessMessage("Profile refreshed");
    } catch (error) {
      showErrorMessage("Failed to refresh profile");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!profile.name.trim() || !profile.email.trim()) {
      Alert.alert("Validation Error", "Name and email are required fields.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    try {
      // Update basic profile information
      const profileUpdatePromise = updateProfile({
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim() || undefined,
        dateOfBirth: profile.dateOfBirth.trim() || undefined,
        gender: profile.gender.trim() || undefined,
      });

      // Update body measurements
      const measurementsUpdatePromise = updateBodyMeasurements({
        height: profile.height.trim() || undefined,
        weight: profile.weight.trim() || undefined,
        chest: profile.chest.trim() || undefined,
        waist: profile.waist.trim() || undefined,
        hips: profile.hips.trim() || undefined,
        inseam: profile.inseam.trim() || undefined,
        shoulder: profile.shoulder.trim() || undefined,
        sleeve: profile.sleeve.trim() || undefined,
        neck: profile.neck.trim() || undefined,
        shoeSize: profile.shoeSize.trim() || undefined,
      });

      // Update preferences
      const preferencesUpdatePromise = updatePreferences({
        colors: profile.favoriteColors
          .split(",")
          .map((color) => color.trim())
          .filter((color) => color.length > 0),
        brands: profile.favoriteBrands
          .split(",")
          .map((brand) => brand.trim())
          .filter((brand) => brand.length > 0),
        style: profile.styleType,
        budget: parseInt(profile.budget) || 1000,
      });

      // Wait for all updates to complete
      await Promise.all([
        profileUpdatePromise,
        measurementsUpdatePromise,
        preferencesUpdatePromise,
      ]);

      showSuccessMessage("Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      showErrorMessage("Failed to update profile. Please try again.");
    }
  };

  const BodyMeasurementsSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Body Measurements</Title>
        <Text style={styles.sectionDescription}>
          Accurate measurements help us provide better style recommendations
        </Text>

        <View style={styles.measurementsGrid}>
          <TextInput
            label="Height (cm)"
            value={profile.height}
            onChangeText={(text) => setProfile({ ...profile, height: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Weight (kg)"
            value={profile.weight}
            onChangeText={(text) => setProfile({ ...profile, weight: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Chest (cm)"
            value={profile.chest}
            onChangeText={(text) => setProfile({ ...profile, chest: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Waist (cm)"
            value={profile.waist}
            onChangeText={(text) => setProfile({ ...profile, waist: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Hips (cm)"
            value={profile.hips}
            onChangeText={(text) => setProfile({ ...profile, hips: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Inseam (cm)"
            value={profile.inseam}
            onChangeText={(text) => setProfile({ ...profile, inseam: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Shoulder (cm)"
            value={profile.shoulder}
            onChangeText={(text) => setProfile({ ...profile, shoulder: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Sleeve Length (cm)"
            value={profile.sleeve}
            onChangeText={(text) => setProfile({ ...profile, sleeve: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Neck (cm)"
            value={profile.neck}
            onChangeText={(text) => setProfile({ ...profile, neck: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            label="Shoe Size"
            value={profile.shoeSize}
            onChangeText={(text) => setProfile({ ...profile, shoeSize: text })}
            mode="outlined"
            style={styles.input}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const PersonalInfoSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Personal Information</Title>

        <TextInput
          label="Full Name *"
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email Address *"
          value={profile.email}
          onChangeText={(text) => setProfile({ ...profile, email: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Phone Number"
          value={profile.phone}
          onChangeText={(text) => setProfile({ ...profile, phone: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
        />

        <TextInput
          label="Date of Birth"
          value={profile.dateOfBirth}
          onChangeText={(text) => setProfile({ ...profile, dateOfBirth: text })}
          mode="outlined"
          style={styles.input}
          placeholder="DD/MM/YYYY"
        />

        <TextInput
          label="Gender"
          value={profile.gender}
          onChangeText={(text) => setProfile({ ...profile, gender: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Male, Female, Non-binary, Other"
        />
      </Card.Content>
    </Card>
  );

  const StylePreferencesSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Style Preferences</Title>

        <TextInput
          label="Favorite Colors (comma separated)"
          value={profile.favoriteColors}
          onChangeText={(text) =>
            setProfile({ ...profile, favoriteColors: text })
          }
          mode="outlined"
          style={styles.input}
          placeholder="Blue, Black, White, Navy"
        />

        <TextInput
          label="Favorite Brands (comma separated)"
          value={profile.favoriteBrands}
          onChangeText={(text) =>
            setProfile({ ...profile, favoriteBrands: text })
          }
          mode="outlined"
          style={styles.input}
          placeholder="Nike, Zara, H&M, Levi's"
        />
      </Card.Content>
    </Card>
  );

  if (isLoadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#667eea"]}
          />
        }
      >
        <PersonalInfoSection />
        <BodyMeasurementsSection />
        <StylePreferencesSection />

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Save Button */}
      <Surface style={styles.saveButtonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={
            isUpdatingProfile || isUpdatingPreferences || isUpdatingMeasurements
          }
          disabled={
            isUpdatingProfile || isUpdatingPreferences || isUpdatingMeasurements
          }
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
        >
          Save Profile
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  measurementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bottomSpacing: {
    height: 80,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    elevation: 8,
  },
  saveButton: {
    borderRadius: 12,
  },
  saveButtonContent: {
    paddingVertical: 8,
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
});

export default EditProfileScreen;
