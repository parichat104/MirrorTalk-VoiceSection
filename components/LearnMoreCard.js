import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function LearnMoreCard({ title, description, image, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginHorizontal: 10,
  },
  cardDesc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    marginHorizontal: 10,
  },
});
