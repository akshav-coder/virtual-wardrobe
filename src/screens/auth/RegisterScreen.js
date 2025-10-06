import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  TextInput,
  Button,
  Surface,
  Text,
  Divider,
  Checkbox,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRegisterMutation } from "../../services";
import { showErrorMessage, showSuccessMessage } from "../../utils/apiUtils";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";

const { width, height } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (!agreeToTerms) {
      Alert.alert("Error", "Please agree to the Terms and Conditions");
      return;
    }

    try {
      console.log("🚀 Attempting registration with data:", {
        firstName,
        lastName,
        email,
        password: "***hidden***",
      });

      const result = await register({
        firstName,
        lastName,
        email,
        password,
      }).unwrap();

      console.log("✅ Registration successful:", result);

      // Update authentication state with user data and token
      dispatch(
        loginSuccess({
          user: result.data.user,
          token: result.data.token,
        })
      );

      showSuccessMessage(
        "Account created successfully! Welcome to Virtual Wardrobe!",
        Alert.alert
      );
      // Navigation will happen automatically due to isAuthenticated state change
    } catch (error) {
      console.error("❌ Registration error:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));
      showErrorMessage(error, Alert.alert, "Registration failed");
    }
  };

  const handleGoogleRegister = () => {
    Alert.alert(
      "Google Register",
      "Google authentication would be implemented here"
    );
  };

  const handleAppleRegister = () => {
    Alert.alert(
      "Apple Register",
      "Apple authentication would be implemented here"
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#6366f1", "#8b5cf6", "#ec4899"]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="shirt" size={60} color="white" />
              </View>
              <Title style={styles.title}>Create Account</Title>
              <Paragraph style={styles.subtitle}>
                Join Virtual Wardrobe and transform your style
              </Paragraph>
            </View>

            {/* Register Form */}
            <Card style={styles.formCard}>
              <Card.Content style={styles.formContent}>
                <View style={styles.nameRow}>
                  <TextInput
                    label="First Name"
                    value={formData.firstName}
                    onChangeText={(value) =>
                      handleInputChange("firstName", value)
                    }
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                    left={<TextInput.Icon icon="account" />}
                  />
                  <TextInput
                    label="Last Name"
                    value={formData.lastName}
                    onChangeText={(value) =>
                      handleInputChange("lastName", value)
                    }
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                    left={<TextInput.Icon icon="account" />}
                  />
                </View>

                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" />}
                  style={styles.input}
                />

                <TextInput
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  style={styles.input}
                />

                <TextInput
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  }
                  style={styles.input}
                />

                <View style={styles.termsContainer}>
                  <Checkbox
                    status={agreeToTerms ? "checked" : "unchecked"}
                    onPress={() => setAgreeToTerms(!agreeToTerms)}
                  />
                  <Text style={styles.termsText}>
                    I agree to the{" "}
                    <Text style={styles.termsLink}>Terms and Conditions</Text>{" "}
                    and <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </View>

                <Button
                  mode="contained"
                  onPress={handleRegister}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.registerButton}
                  contentStyle={styles.buttonContent}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <Divider style={styles.divider} />

                {/* Social Register */}
                <View style={styles.socialContainer}>
                  <Button
                    mode="outlined"
                    onPress={handleGoogleRegister}
                    style={styles.socialButton}
                    icon="google"
                    contentStyle={styles.socialButtonContent}
                  >
                    Continue with Google
                  </Button>

                  <Button
                    mode="outlined"
                    onPress={handleAppleRegister}
                    style={styles.socialButton}
                    icon="apple"
                    contentStyle={styles.socialButtonContent}
                  >
                    Continue with Apple
                  </Button>
                </View>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>
                    Already have an account?{" "}
                  </Text>
                  <Button
                    mode="text"
                    onPress={() => navigation.navigate("Login")}
                    style={styles.loginButton}
                  >
                    Sign In
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  formCard: {
    borderRadius: 20,
    elevation: 8,
  },
  formContent: {
    padding: 24,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  input: {
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    lineHeight: 20,
  },
  termsLink: {
    color: "#6366f1",
    fontWeight: "600",
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 20,
  },
  socialContainer: {
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    borderRadius: 12,
  },
  socialButtonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#666",
  },
  loginButton: {
    marginLeft: -8,
  },
});

export default RegisterScreen;
