import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Card({ title, text, onPress, showDelete, onLongPress, onCancel, onConfirmDelete }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity style={styles.button} onPress={onPress} onLongPress={onLongPress}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
      </TouchableOpacity>

      {showDelete && (
        <View style={styles.deleteBox}>
          <Text style={styles.deleteText}>คุณต้องการลบ "{title}" หรือไม่?</Text>
          <View style={styles.deleteButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirmDelete}>
              <Text style={styles.confirmText}>ลบ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d6f5ffff",
    borderRadius: 10,
    padding: 16,
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#d6f5ffff",
    borderRadius: 10,
  },
  text: {
    backgroundColor: "rgba(215, 12, 12, 1)",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  deleteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  deleteButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  cancelText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },
  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
