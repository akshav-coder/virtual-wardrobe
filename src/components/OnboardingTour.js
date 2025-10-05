import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  Text,
  IconButton,
  ProgressBar,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const OnboardingTour = ({ visible, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animation] = useState(new Animated.Value(0));
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const tourSteps = [
    {
      id: "welcome",
      title: "Welcome to Virtual Wardrobe! 👋",
      description:
        "Your personal AI-powered styling assistant that helps you organize your wardrobe and create amazing outfits.",
      icon: "shirt",
      color: "#6366f1",
      features: [
        "Smart wardrobe organization",
        "AI-powered outfit suggestions",
        "Weather-based recommendations",
        "Style insights and analytics",
      ],
    },
    {
      id: "home",
      title: "Home Dashboard 🏠",
      description:
        "Your central hub where you can see today's outfit suggestion, quick stats, and weather information.",
      icon: "home",
      color: "#8b5cf6",
      features: [
        "Daily outfit recommendations",
        "Quick wardrobe statistics",
        "Weather-based suggestions",
        "Recent activity feed",
      ],
    },
    {
      id: "wardrobe",
      title: "Wardrobe Management 👕",
      description:
        "Organize and manage all your clothing items with smart categorization and search features.",
      icon: "shirt",
      color: "#ec4899",
      features: [
        "Add items with photos",
        "Smart categorization",
        "Search and filter options",
        "Favorite items tracking",
      ],
    },
    {
      id: "planner",
      title: "Outfit Planner 📅",
      description:
        "Plan your outfits in advance with our calendar view and outfit creation tools.",
      icon: "calendar",
      color: "#f59e0b",
      features: [
        "Calendar-based planning",
        "Outfit creation tools",
        "Occasion-based suggestions",
        "Outfit history tracking",
      ],
    },
    {
      id: "stylist",
      title: "AI Stylist ✨",
      description:
        "Get personalized style recommendations and insights based on your wardrobe and preferences.",
      icon: "sparkles",
      color: "#10b981",
      features: [
        "AI-powered recommendations",
        "Style analysis",
        "Wardrobe insights",
        "Personalized suggestions",
      ],
    },
    {
      id: "profile",
      title: "Profile & Settings ⚙️",
      description:
        "Customize your experience, manage preferences, and view your style statistics.",
      icon: "person",
      color: "#6b7280",
      features: [
        "Personal preferences",
        "Style statistics",
        "App settings",
        "Data management",
      ],
    },
    {
      id: "features",
      title: "Key Features 🚀",
      description:
        "Discover the powerful features that make Virtual Wardrobe your ultimate styling companion.",
      icon: "star",
      color: "#8b5cf6",
      features: [
        "Weather integration",
        "Photo recognition",
        "Style scoring",
        "Social sharing",
        "Backup & sync",
      ],
    },
    {
      id: "ready",
      title: "You're All Set! 🎉",
      description:
        "Start exploring your virtual wardrobe and discover your perfect style with AI-powered recommendations.",
      icon: "checkmark-circle",
      color: "#10b981",
      features: [
        "Add your first items",
        "Create your first outfit",
        "Explore AI suggestions",
        "Plan your week",
      ],
    },
  ];

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  useEffect(() => {
    Animated.spring(animation, {
      toValue: currentStep,
      useNativeDriver: true,
    }).start();
  }, [currentStep, animation]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onSkip();
  };

  if (!visible) return null;

  const currentStepData = tourSteps[currentStep];
  const progress = (currentStep + 1) / tourSteps.length;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[
          currentStepData.color,
          `${currentStepData.color}CC`,
          `${currentStepData.color}99`,
        ]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={progress}
                color="white"
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {currentStep + 1} of {tourSteps.length}
              </Text>
            </View>
            <IconButton
              icon="close"
              size={24}
              iconColor="white"
              onPress={skipTour}
              style={styles.closeButton}
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.stepContainer,
                {
                  transform: [
                    {
                      translateX: animation.interpolate({
                        inputRange: [0, tourSteps.length - 1],
                        outputRange: [0, -width * (tourSteps.length - 1)],
                      }),
                    },
                  ],
                },
              ]}
            >
              {tourSteps.map((step, index) => (
                <View key={step.id} style={styles.step}>
                  <Card style={styles.stepCard}>
                    <Card.Content style={styles.stepContent}>
                      {/* Icon */}
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: step.color + "20" },
                        ]}
                      >
                        <Ionicons
                          name={step.icon}
                          size={60}
                          color={step.color}
                        />
                      </View>

                      {/* Title */}
                      <Title style={styles.stepTitle}>{step.title}</Title>

                      {/* Description */}
                      <Paragraph style={styles.stepDescription}>
                        {step.description}
                      </Paragraph>

                      {/* Features */}
                      <View style={styles.featuresContainer}>
                        {step.features.map((feature, featureIndex) => (
                          <View key={featureIndex} style={styles.featureItem}>
                            <Ionicons
                              name="checkmark-circle"
                              size={16}
                              color={step.color}
                            />
                            <Text style={styles.featureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </Card.Content>
                  </Card>
                </View>
              ))}
            </Animated.View>
          </View>

          {/* Navigation */}
          <View style={styles.navigation}>
            <View style={styles.buttonContainer}>
              {currentStep > 0 && (
                <Button
                  mode="outlined"
                  onPress={prevStep}
                  style={[styles.navButton, styles.prevButton]}
                  buttonColor="rgba(255, 255, 255, 0.2)"
                  textColor="white"
                  icon="arrow-back"
                  contentStyle={styles.buttonContent}
                >
                  Previous
                </Button>
              )}

              <Button
                mode="contained"
                onPress={nextStep}
                style={[styles.navButton, styles.nextButton]}
                buttonColor="white"
                textColor="#6366f1"
                contentStyle={styles.buttonContent}
                icon={
                  currentStep === tourSteps.length - 1 ? "check" : "arrow-right"
                }
              >
                {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
              </Button>
            </View>

            {/* Dots Indicator */}
            <View style={styles.dotsContainer}>
              {tourSteps.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === currentStep
                          ? "white"
                          : "rgba(255, 255, 255, 0.4)",
                    },
                  ]}
                  onPress={() => setCurrentStep(index)}
                />
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressContainer: {
    flex: 1,
    marginRight: 20,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    overflow: "hidden",
  },
  stepContainer: {
    flexDirection: "row",
    width: width * 8, // 8 steps
  },
  step: {
    width: width,
    paddingHorizontal: 20,
  },
  stepCard: {
    borderRadius: 20,
    elevation: 8,
    marginBottom: 20,
  },
  stepContent: {
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  stepDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
    lineHeight: 24,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  navigation: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  navButton: {
    borderRadius: 12,
    minWidth: 120,
    elevation: 2,
  },
  prevButton: {
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
  },
  nextButton: {
    elevation: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default OnboardingTour;
