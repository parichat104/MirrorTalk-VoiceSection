import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function ScoreBox({ title, description, percent }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const barColor =
    percent >= 80 ? "#4CAF50" : percent >= 50 ? "#FFC107" : "#F44336";

  return (
    <View style={styles.column3}>
      <Text style={styles.text5}>{title}</Text>
      <Text style={styles.text6}>{description}</Text>

      <View style={styles.box2}>
        <Animated.View
          style={{
            height: "100%",
            borderRadius: 8,
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: barColor,
          }}
        />
      </View>

      <Text style={styles.text7}>{percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  column3: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  text5: {
    fontSize: 14,
    fontWeight: "800",
    color: "#333",
  },
  row3: {
    marginTop: 2,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text6: {
    fontSize: 12,
    color: "#8F8F8F",
    flex: 1,
    marginRight: 10,
  },
  text7: {
    fontSize: 12,
    color: "#8F8F8F",
    fontWeight: "700",
  },
  box2: {
    height: 8,
    backgroundColor: "#E6E6E6",
    borderRadius: 8,
    overflow: "hidden",
  },
});
