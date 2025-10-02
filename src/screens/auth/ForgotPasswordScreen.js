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
  Text,
  IconButton,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  const handleResendEmail = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Reset email sent again!");
    }, 1000);
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#6366f1", "#8b5cf6", "#ec4899"]}
          style={styles.gradient}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.successIconContainer}>
                <Ionicons name="mail" size={60} color="white" />
              </View>
              <Title style={styles.title}>Check Your Email</Title>
              <Paragraph style={styles.subtitle}>
                We've sent a password reset link to{" "}
                <Text style={styles.emailText}>{email}</Text>
              </Paragraph>
            </View>

            <Card style={styles.formCard}>
              <Card.Content style={styles.formContent}>
                <Text style={styles.instructions}>
                  Please check your email and click the link to reset your
                  password. The link will expire in 24 hours.
                </Text>

                <Button
                  mode="contained"
                  onPress={handleResendEmail}
                  loading={loading}
                  disabled={loading}
                  style={styles.resendButton}
                  contentStyle={styles.buttonContent}
                >
                  {loading ? "Sending..." : "Resend Email"}
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate("Login")}
                  style={styles.backButton}
                  contentStyle={styles.buttonContent}
                >
                  Back to Login
                </Button>
              </Card.Content>
            </Card>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

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
              <IconButton
                icon="arrow-left"
                size={24}
                iconColor="white"
                onPress={() => navigation.goBack()}
                style={styles.backIcon}
              />
              <View style={styles.logoContainer}>
                <Ionicons name="lock-closed" size={60} color="white" />
              </View>
              <Title style={styles.title}>Forgot Password?</Title>
              <Paragraph style={styles.subtitle}>
                Don't worry! Enter your email and we'll send you a reset link.
              </Paragraph>
            </View>

            {/* Reset Form */}
            <Card style={styles.formCard}>
              <Card.Content style={styles.formContent}>
                <TextInput
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" />}
                  style={styles.input}
                  placeholder="Enter your email address"
                />

                <Text style={styles.helpText}>
                  We'll send you a secure link to reset your password. Make sure
                  to check your spam folder if you don't see the email.
                </Text>

                <Button
                  mode="contained"
                  onPress={handleResetPassword}
                  loading={loading}
                  disabled={loading}
                  style={styles.resetButton}
                  contentStyle={styles.buttonContent}
                >
                  {loading ? "Sending Reset Link..." : "Send Reset Link"}
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.navigate("Login")}
                  style={styles.cancelButton}
                >
                  Back to Login
                </Button>
              </Card.Content>
            </Card>

            {/* Help Card */}
            <Card style={styles.helpCard}>
              <Card.Content>
                <Text style={styles.helpTitle}>Need Help?</Text>
                <Text style={styles.helpDescription}>
                  If you're having trouble accessing your account, contact our
                  support team.
                </Text>
                <Button
                  mode="outlined"
                  onPress={() =>
                    Alert.alert(
                      "Support",
                      "Contact support at help@virtualwardrobe.com"
                    )
                  }
                  style={styles.supportButton}
                  icon="help-circle"
                >
                  Contact Support
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
  backIcon: {
    position: "absolute",
    top: -20,
    left: -20,
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
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(34, 197, 94, 0.2)",
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
    lineHeight: 24,
  },
  emailText: {
    fontWeight: "bold",
    color: "white",
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
  helpText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  instructions: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  resetButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
  },
  resendButton: {
    marginBottom: 16,
    borderRadius: 12,
  },
  backButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    alignSelf: "center",
  },
  helpCard: {
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    elevation: 4,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#6366f1",
  },
  helpDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  supportButton: {
    borderRadius: 12,
  },
});

export default ForgotPasswordScreen;
