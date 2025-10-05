import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { store } from "./src/store/store";
import {
  startTour,
  completeOnboarding,
  skipOnboarding,
} from "./src/store/slices/tourSlice";

// Import screens
import HomeScreen from "./src/screens/HomeScreen";
import WardrobeScreen from "./src/screens/WardrobeScreen";
import OutfitPlannerScreen from "./src/screens/OutfitPlannerScreen";
import StylistScreen from "./src/screens/StylistScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import AddItemScreen from "./src/screens/AddItemScreen";
import OutfitDetailScreen from "./src/screens/OutfitDetailScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import WeatherScreen from "./src/screens/WeatherScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

// Import auth screens
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/auth/ForgotPasswordScreen";

// Import components
import OnboardingTour from "./src/components/OnboardingTour";

// Import theme
import { theme } from "./src/theme/theme";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main App Component with Tour Logic
const MainApp = () => {
  const dispatch = useDispatch();
  const { isOnboardingComplete, isTourVisible } = useSelector(
    (state) => state.tour
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    // For demo purposes, show tour on first launch
    if (!isOnboardingComplete) {
      dispatch(startTour());
    }
  }, [isOnboardingComplete, dispatch]);

  const handleTourComplete = () => {
    dispatch(completeOnboarding());
  };

  const handleTourSkip = () => {
    dispatch(skipOnboarding());
  };

  return (
    <>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.onPrimary,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          {isAuthenticated ? (
            // Authenticated screens
            <>
              <Stack.Screen
                name="Main"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddItem"
                component={AddItemScreen}
                options={{ title: "Add New Item" }}
              />
              <Stack.Screen
                name="OutfitDetail"
                component={OutfitDetailScreen}
                options={{ title: "Outfit Details" }}
              />
              <Stack.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{ title: "Calendar" }}
              />
              <Stack.Screen
                name="Weather"
                component={WeatherScreen}
                options={{ title: "Weather" }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: "Settings" }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ title: "Edit Profile" }}
              />
            </>
          ) : (
            // Auth screens
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>

      {/* Onboarding Tour Overlay */}
      <OnboardingTour
        visible={isTourVisible}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />
    </>
  );
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Wardrobe") {
            iconName = focused ? "shirt" : "shirt-outline";
          } else if (route.name === "Planner") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Stylist") {
            iconName = focused ? "sparkles" : "sparkles-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Planner" component={OutfitPlannerScreen} />
      <Tab.Screen name="Stylist" component={StylistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <MainApp />
      </PaperProvider>
    </Provider>
  );
}
