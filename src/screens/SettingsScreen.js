import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
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
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { updatePreferences } from "../store/slices/preferencesSlice";

const { width } = Dimensions.get("window");

const SettingsScreen = ({ navigation }) => {
  const preferences = useSelector((state) => state.preferences.settings);
  const wardrobe = useSelector((state) => state.wardrobe.items);
  const outfits = useSelector((state) => state.outfits.outfits);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState(preferences.notifications);
  const [style, setStyle] = useState(preferences.style || "casual");
  const [budget, setBudget] = useState(
    preferences.budget?.toString() || "1000"
  );
  const [showBudgetInput, setShowBudgetInput] = useState(false);

  const handleNotificationToggle = (value) => {
    setNotifications(value);
    dispatch(updatePreferences({ notifications: value }));
  };

  const handleStyleChange = (value) => {
    setStyle(value);
    dispatch(updatePreferences({ style: value }));
  };

  const handleBudgetSave = () => {
    const budgetValue = parseInt(budget);
    if (isNaN(budgetValue) || budgetValue < 0) {
      Alert.alert("Invalid Budget", "Please enter a valid budget amount.");
      return;
    }
    dispatch(updatePreferences({ budget: budgetValue }));
    setShowBudgetInput(false);
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
          description="Update your personal information"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            /* Navigate to profile edit */
          }}
        />
        <Divider />
        <List.Item
          title="Privacy Settings"
          description="Manage your data and privacy"
          left={(props) => <List.Icon {...props} icon="shield-account" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            /* Navigate to privacy settings */
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
      </Card.Content>
    </Card>
  );

  const DataSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Data & Storage</Title>

        <View style={styles.dataStats}>
          <View style={styles.dataStat}>
            <Text style={styles.dataStatNumber}>{wardrobe.length}</Text>
            <Text style={styles.dataStatLabel}>Items</Text>
          </View>
          <View style={styles.dataStat}>
            <Text style={styles.dataStatNumber}>{outfits.length}</Text>
            <Text style={styles.dataStatLabel}>Outfits</Text>
          </View>
          <View style={styles.dataStat}>
            <Text style={styles.dataStatNumber}>2.4</Text>
            <Text style={styles.dataStatLabel}>MB</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <List.Item
          title="Export Data"
          description="Download your wardrobe data"
          left={(props) => <List.Icon {...props} icon="download" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleExportData}
        />

        <Divider />

        <List.Item
          title="Clear All Data"
          description="Permanently delete all data"
          left={(props) => <List.Icon {...props} icon="delete" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleClearData}
          titleStyle={styles.dangerText}
        />
      </Card.Content>
    </Card>
  );

  const AppSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>App Settings</Title>

        <List.Item
          title="Theme"
          description="Light mode"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            /* Navigate to theme settings */
          }}
        />

        <Divider />

        <List.Item
          title="Language"
          description="English"
          left={(props) => <List.Icon {...props} icon="translate" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            /* Navigate to language settings */
          }}
        />

        <Divider />

        <List.Item
          title="Units"
          description="Metric (Celsius, cm)"
          left={(props) => <List.Icon {...props} icon="ruler" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            /* Navigate to units settings */
          }}
        />
      </Card.Content>
    </Card>
  );

  const SupportSection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Support</Title>

        <List.Item
          title="Help Center"
          description="Get help and tutorials"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            /* Navigate to help */
          }}
        />

        <Divider />

        <List.Item
          title="Contact Support"
          description="Get in touch with our team"
          left={(props) => <List.Icon {...props} icon="message" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            /* Navigate to contact */
          }}
        />

        <Divider />

        <List.Item
          title="Rate App"
          description="Rate us on the App Store"
          left={(props) => <List.Icon {...props} icon="star" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            /* Navigate to rating */
          }}
        />

        <Divider />

        <List.Item
          title="About"
          description="Version 1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            /* Navigate to about */
          }}
        />
      </Card.Content>
    </Card>
  );

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileSection />
        <PreferencesSection />
        <DataSection />
        <AppSection />
        <SupportSection />
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
});

export default SettingsScreen;
