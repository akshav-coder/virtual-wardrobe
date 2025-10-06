import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
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
  IconButton,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../services";
import { loginSuccess } from "../../store/slices/authSlice";
import { showErrorMessage, showSuccessMessage } from "../../utils/apiUtils";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = await login({
        email,
        password,
      }).unwrap();

      // Dispatch success action
      dispatch(
        loginSuccess({
          user: result.data.user,
          token: result.data.token,
        })
      );

      showSuccessMessage("Successfully logged in!", Alert.alert);
    } catch (error) {
      showErrorMessage(error, Alert.alert, "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      "Google Login",
      "Google authentication would be implemented here"
    );
  };

  const handleAppleLogin = () => {
    Alert.alert(
      "Apple Login",
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
              <Title style={styles.title}>Welcome Back</Title>
              <Paragraph style={styles.subtitle}>
                Sign in to your Virtual Wardrobe
              </Paragraph>
            </View>

            {/* Login Form */}
            <Card style={styles.formCard}>
              <Card.Content style={styles.formContent}>
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" />}
                  style={styles.input}
                />

                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
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

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.loginButton}
                  contentStyle={styles.buttonContent}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.navigate("ForgotPassword")}
                  style={styles.forgotButton}
                >
                  Forgot Password?
                </Button>

                <Divider style={styles.divider} />

                {/* Social Login */}
                <View style={styles.socialContainer}>
                  <Button
                    mode="outlined"
                    onPress={handleGoogleLogin}
                    style={styles.socialButton}
                    icon="google"
                    contentStyle={styles.socialButtonContent}
                  >
                    Continue with Google
                  </Button>

                  <Button
                    mode="outlined"
                    onPress={handleAppleLogin}
                    style={styles.socialButton}
                    icon="apple"
                    contentStyle={styles.socialButtonContent}
                  >
                    Continue with Apple
                  </Button>
                </View>

                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <Button
                    mode="text"
                    onPress={() => navigation.navigate("Register")}
                    style={styles.signupButton}
                  >
                    Sign Up
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
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
    marginBottom: 20,
  },
  formContent: {
    padding: 24,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  forgotButton: {
    alignSelf: "center",
    marginBottom: 16,
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
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 16,
    color: "#666",
  },
  signupButton: {
    marginLeft: -8,
  },
});

export default LoginScreen;
