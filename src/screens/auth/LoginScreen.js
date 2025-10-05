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
  IconButton,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";
import { demoUser } from "../../data/demoData";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Set user in Redux store to authenticate
      dispatch(setUser(demoUser));
      // The App.js will automatically show Main screen due to authentication state change
    }, 1500);
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
                  loading={loading}
                  disabled={loading}
                  style={styles.loginButton}
                  contentStyle={styles.buttonContent}
                >
                  {loading ? "Signing In..." : "Sign In"}
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

            {/* Demo Login */}
            <Card style={styles.demoCard}>
              <Card.Content>
                <Text style={styles.demoTitle}>Demo Mode</Text>
                <Text style={styles.demoText}>
                  Try the app without creating an account
                </Text>
                <Button
                  mode="outlined"
                  onPress={() => {
                    // Set demo user in Redux store for guest mode
                    dispatch(setUser(demoUser));
                    // The App.js will automatically show Main screen due to authentication state change
                  }}
                  style={styles.demoButton}
                  icon="play"
                >
                  Continue as Guest
                </Button>
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
  demoCard: {
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    elevation: 4,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#6366f1",
  },
  demoText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
  demoButton: {
    borderRadius: 12,
  },
});

export default LoginScreen;
