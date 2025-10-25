import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const Logo = ({
  size = "medium",
  showText = true,
  style,
  useWordLogo = false,
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return { container: 40, icon: 20, text: 12 };
      case "large":
        return { container: 80, icon: 40, text: 18 };
      case "xlarge":
        return { container: 120, icon: 60, text: 24 };
      default:
        return { container: 60, icon: 30, text: 16 };
    }
  };

  const sizes = getSize();

  if (useWordLogo) {
    return (
      <View style={[styles.container, style]}>
        <Image
          source={require("../../assets/wearon_word_logo.png")}
          style={[
            // styles.wordLogoImage,
            {
              height: 64,
              width: 128, // Approximate width for word logo
            },
          ]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { width: sizes.container, height: sizes.container },
        style,
      ]}
    >
      <Image
        source={require("../../assets/app_icon_wearon.png")}
        style={[
          styles.logoImage,
          {
            width: sizes.container,
            height: sizes.container,
            borderRadius: sizes.container / 2,
          },
        ]}
        resizeMode="contain"
      />

      {showText && (
        <Text style={[styles.logoText, { fontSize: sizes.text }]}>WEARON</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  wordLogoImage: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoText: {
    fontWeight: "bold",
    color: "#1f2937",
    letterSpacing: 1,
  },
});

export default Logo;
