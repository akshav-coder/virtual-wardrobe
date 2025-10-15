import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const Logo = ({ size = "medium", showText = true, style }) => {
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

  return (
    <View
      style={[
        styles.container,
        { width: sizes.container, height: sizes.container },
        style,
      ]}
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={[styles.gradient, { borderRadius: sizes.container / 2 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoContent}>
          {/* Stylized W */}
          <View style={styles.wContainer}>
            <View style={[styles.wBar, styles.wBar1]} />
            <View style={[styles.wBar, styles.wBar2]} />
            <View style={[styles.wBar, styles.wBar3]} />
            <View style={[styles.wBar, styles.wBar4]} />
          </View>

          {/* Fashion icon */}
          <View style={styles.fashionIcon}>
            <Ionicons name="shirt" size={sizes.icon * 0.4} color="white" />
          </View>
        </View>
      </LinearGradient>

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
  gradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContent: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  wContainer: {
    position: "relative",
    width: 24,
    height: 24,
  },
  wBar: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 1,
  },
  wBar1: {
    width: 3,
    height: 20,
    left: 0,
    top: 2,
  },
  wBar2: {
    width: 3,
    height: 20,
    left: 6,
    top: 2,
  },
  wBar3: {
    width: 3,
    height: 20,
    left: 12,
    top: 2,
  },
  wBar4: {
    width: 3,
    height: 20,
    left: 18,
    top: 2,
  },
  fashionIcon: {
    position: "absolute",
    right: -8,
    top: -2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 2,
  },
  logoText: {
    marginTop: 8,
    fontWeight: "bold",
    color: "#1f2937",
    letterSpacing: 1,
  },
});

export default Logo;
