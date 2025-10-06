import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Switch,
  Surface,
  Text,
  List,
  Divider,
  IconButton,
  TextInput,
  SegmentedButtons,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetProfileQuery,
  useUpdatePreferencesMutation,
  useLogoutMutation,
  useGetStatsQuery,
} from "../services";
import { logout } from "../store/slices/authSlice";
import { showErrorMessage, showSuccessMessage } from "../utils/apiUtils";

const { width } = Dimensions.get("window");

const SettingsScreen = ({ navigation }) => {
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

  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useGetStatsQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const [updatePreferences, { isLoading: isUpdatingPreferences }] =
    useUpdatePreferencesMutation();

  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Get preferences from API data
  const preferences = profileData?.data?.user?.preferences || {};
  const wardrobe = statsData?.data?.wardrobe || {};
  const outfits = statsData?.data?.outfits || {};

  const [notifications, setNotifications] = useState(preferences.notifications);
  const [weatherAlerts, setWeatherAlerts] = useState(preferences.weatherAlerts);
  const [styleTips, setStyleTips] = useState(preferences.styleTips);
  const [newItemAlerts, setNewItemAlerts] = useState(preferences.newItemAlerts);
  const [style, setStyle] = useState(preferences.style || "casual");
  const [budget, setBudget] = useState(
    preferences.budget?.toString() || "1000"
  );
  const [showBudgetInput, setShowBudgetInput] = useState(false);

  const isLoading = isLoadingProfile || isLoadingStats;

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (auth.isAuthenticated) {
        await Promise.all([refetchProfile(), refetchStats()]);
      }
      showSuccessMessage("Settings refreshed");
    } catch (error) {
      showErrorMessage("Failed to refresh settings");
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationToggle = async (value) => {
    setNotifications(value);
    try {
      await updatePreferences({ notifications: value }).unwrap();
      showSuccessMessage("Notifications updated");
    } catch (error) {
      setNotifications(!value); // Revert on error
      showErrorMessage("Failed to update notifications");
    }
  };

  const handleWeatherAlertsToggle = async (value) => {
    setWeatherAlerts(value);
    try {
      await updatePreferences({ weatherAlerts: value }).unwrap();
      showSuccessMessage("Weather alerts updated");
    } catch (error) {
      setWeatherAlerts(!value);
      showErrorMessage("Failed to update weather alerts");
    }
  };

  const handleStyleTipsToggle = async (value) => {
    setStyleTips(value);
    try {
      await updatePreferences({ styleTips: value }).unwrap();
      showSuccessMessage("Style tips updated");
    } catch (error) {
      setStyleTips(!value);
      showErrorMessage("Failed to update style tips");
    }
  };

  const handleNewItemAlertsToggle = async (value) => {
    setNewItemAlerts(value);
    try {
      await updatePreferences({ newItemAlerts: value }).unwrap();
      showSuccessMessage("New item alerts updated");
    } catch (error) {
      setNewItemAlerts(!value);
      showErrorMessage("Failed to update new item alerts");
    }
  };

  const handleStyleChange = async (value) => {
    setStyle(value);
    try {
      await updatePreferences({ style: value }).unwrap();
      showSuccessMessage("Style preference updated");
    } catch (error) {
      showErrorMessage("Failed to update style preference");
    }
  };

  const handleBudgetSave = async () => {
    const budgetValue = parseInt(budget);
    if (isNaN(budgetValue) || budgetValue < 0) {
      Alert.alert("Invalid Budget", "Please enter a valid budget amount.");
      return;
    }

    try {
      await updatePreferences({ budget: budgetValue }).unwrap();
      setShowBudgetInput(false);
      showSuccessMessage("Budget updated successfully!");
    } catch (error) {
      showErrorMessage("Failed to update budget");
    }
  };

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Your wardrobe data will be exported as a JSON file.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: () => {
            /* Export logic */
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your wardrobe items and outfits. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            /* Clear logic */
          },
        },
      ]
    );
  };

  const ProfileSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Profile</Title>
        <List.Item
          title="Edit Profile"
          description="Update your personal information and body measurements"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate("EditProfile")}
        />
        <Divider />
        <List.Item
          title="Logout"
          description="Sign out of your account"
          left={(props) => <List.Icon {...props} icon="logout" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            Alert.alert(
              "Logout",
              "Are you sure you want to logout? You will need to sign in again.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Logout",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await logoutMutation().unwrap();
                      dispatch(logout());
                      showSuccessMessage("Logged out successfully");
                    } catch (error) {
                      // Still logout locally even if API call fails
                      dispatch(logout());
                      showSuccessMessage("Logged out successfully");
                    }
                  },
                },
              ]
            );
          }}
        />
      </Card.Content>
    </Card>
  );

  const PreferencesSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Preferences</Title>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Style Type</Text>
            <Text style={styles.preferenceDescription}>
              Your preferred fashion style
            </Text>
          </View>
          <SegmentedButtons
            value={style}
            onValueChange={handleStyleChange}
            buttons={[
              { value: "casual", label: "Casual" },
              { value: "formal", label: "Formal" },
              { value: "sporty", label: "Sporty" },
            ]}
            style={styles.styleButtons}
          />
        </View>

        <Divider style={styles.divider} />

        <List.Item
          title="Wardrobe Budget"
          description={`$${preferences.budget || 1000} per month`}
          left={(props) => <List.Icon {...props} icon="currency-usd" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => setShowBudgetInput(true)}
        />

        <Divider style={styles.divider} />

        <List.Item
          title="Notifications"
          description="Get outfit suggestions and reminders"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notifications}
              onValueChange={handleNotificationToggle}
            />
          )}
        />

        <List.Item
          title="Weather Alerts"
          description="Get weather-based outfit recommendations"
          left={(props) => (
            <List.Icon {...props} icon="weather-partly-cloudy" />
          )}
          right={() => (
            <Switch
              value={weatherAlerts}
              onValueChange={handleWeatherAlertsToggle}
            />
          )}
        />

        <List.Item
          title="Style Tips"
          description="Get AI-powered fashion advice"
          left={(props) => <List.Icon {...props} icon="lightbulb" />}
          right={() => (
            <Switch value={styleTips} onValueChange={handleStyleTipsToggle} />
          )}
        />

        <List.Item
          title="New Item Alerts"
          description="Get notified about new wardrobe additions"
          left={(props) => <List.Icon {...props} icon="plus" />}
          right={() => (
            <Switch
              value={newItemAlerts}
              onValueChange={handleNewItemAlertsToggle}
            />
          )}
        />
      </Card.Content>
    </Card>
  );

  // Removed DataSection, AppSection, and SupportSection as they don't belong in style preferences

  const BudgetModal = () => (
    <View style={styles.modalOverlay}>
      <Surface style={styles.modalContainer}>
        <Title style={styles.modalTitle}>Set Wardrobe Budget</Title>
        <TextInput
          label="Monthly Budget ($)"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
          style={styles.budgetInput}
          mode="outlined"
        />
        <View style={styles.modalActions}>
          <Button
            mode="outlined"
            onPress={() => setShowBudgetInput(false)}
            style={styles.modalButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleBudgetSave}
            style={styles.modalButton}
          >
            Save
          </Button>
        </View>
      </Surface>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        <ProfileSection />
        <PreferencesSection />
      </ScrollView>

      {showBudgetInput && <BudgetModal />}
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
  sectionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  preferenceItem: {
    paddingVertical: 8,
  },
  preferenceInfo: {
    marginBottom: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  preferenceDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  styleButtons: {
    backgroundColor: "#f3f4f6",
  },
  divider: {
    marginVertical: 8,
  },
  dataStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  dataStat: {
    alignItems: "center",
  },
  dataStatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6366f1",
  },
  dataStatLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  dangerText: {
    color: "#ef4444",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    minWidth: width - 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  budgetInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
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

export default SettingsScreen;
