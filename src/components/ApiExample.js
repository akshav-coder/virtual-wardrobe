import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  useLoginMutation,
  useGetProfileQuery,
  useGetItemsQuery,
  useCreateItemMutation,
  useGetCurrentWeatherQuery,
  useGenerateRecommendationsMutation,
} from "../services";
import { loginSuccess, logout } from "../store/slices/authSlice";

const ApiExample = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Authentication
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  // User profile
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  // Wardrobe items
  const {
    data: wardrobeItems,
    isLoading: isWardrobeLoading,
    error: wardrobeError,
  } = useGetItemsQuery({ limit: 10 }, { skip: !auth.isAuthenticated });

  // Create wardrobe item
  const [createItem, { isLoading: isCreatingItem }] = useCreateItemMutation();

  // Weather data
  const {
    data: weather,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useGetCurrentWeatherQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  // AI recommendations
  const [generateRecommendations, { isLoading: isGeneratingRecommendations }] =
    useGenerateRecommendationsMutation();

  // Example login function
  const handleLogin = async () => {
    try {
      const result = await login({
        email: "test@example.com",
        password: "newpassword123",
      }).unwrap();

      // Dispatch success action
      dispatch(
        loginSuccess({
          user: result.data.user,
          token: result.data.token,
        })
      );

      Alert.alert("Success", "Logged in successfully!");
    } catch (error) {
      Alert.alert("Error", error.data?.message || "Login failed");
    }
  };

  // Example logout function
  const handleLogout = () => {
    dispatch(logout());
    Alert.alert("Success", "Logged out successfully!");
  };

  // Example create item function
  const handleCreateItem = async () => {
    try {
      const result = await createItem({
        name: "Test T-Shirt",
        category: "top",
        color: "blue",
        season: "all-season",
        occasions: ["casual"],
        minTemperature: 10,
        maxTemperature: 30,
      }).unwrap();

      Alert.alert("Success", "Item created successfully!");
    } catch (error) {
      Alert.alert("Error", error.data?.message || "Failed to create item");
    }
  };

  // Example generate recommendations function
  const handleGenerateRecommendations = async () => {
    try {
      const result = await generateRecommendations({
        type: "daily_outfit",
        occasion: "casual",
      }).unwrap();

      Alert.alert("Success", `Generated ${result.data.count} recommendations!`);
    } catch (error) {
      Alert.alert(
        "Error",
        error.data?.message || "Failed to generate recommendations"
      );
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        API Integration Example
      </Text>

      {/* Authentication Section */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Authentication
        </Text>

        {auth.isAuthenticated ? (
          <View>
            <Text>Welcome, {auth.user?.name || "User"}!</Text>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        ) : (
          <Button
            title={isLoginLoading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            disabled={isLoginLoading}
          />
        )}
      </View>

      {/* Profile Section */}
      {auth.isAuthenticated && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Profile
          </Text>

          {isProfileLoading ? (
            <Text>Loading profile...</Text>
          ) : profileError ? (
            <Text style={{ color: "red" }}>Error loading profile</Text>
          ) : (
            <Text>Email: {profile?.data?.email}</Text>
          )}
        </View>
      )}

      {/* Wardrobe Section */}
      {auth.isAuthenticated && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Wardrobe
          </Text>

          {isWardrobeLoading ? (
            <Text>Loading wardrobe...</Text>
          ) : wardrobeError ? (
            <Text style={{ color: "red" }}>Error loading wardrobe</Text>
          ) : (
            <Text>Items: {wardrobeItems?.data?.count || 0}</Text>
          )}

          <Button
            title={isCreatingItem ? "Creating..." : "Create Test Item"}
            onPress={handleCreateItem}
            disabled={isCreatingItem}
          />
        </View>
      )}

      {/* Weather Section */}
      {auth.isAuthenticated && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Weather
          </Text>

          {isWeatherLoading ? (
            <Text>Loading weather...</Text>
          ) : weatherError ? (
            <Text style={{ color: "red" }}>Error loading weather</Text>
          ) : (
            <Text>Temperature: {weather?.data?.temperature?.current}°C</Text>
          )}
        </View>
      )}

      {/* AI Recommendations Section */}
      {auth.isAuthenticated && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            AI Recommendations
          </Text>

          <Button
            title={
              isGeneratingRecommendations
                ? "Generating..."
                : "Generate Recommendations"
            }
            onPress={handleGenerateRecommendations}
            disabled={isGeneratingRecommendations}
          />
        </View>
      )}
    </View>
  );
};

export default ApiExample;
