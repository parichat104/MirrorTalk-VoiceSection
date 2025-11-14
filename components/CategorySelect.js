import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const categories = ["การนำเสนอ", "แนะนำตัว", "ซ้อมสัมภาษณ์", "การพูดอิสระ", "พูดภาษาอังกฤษ", "พูดในที่สาธารณะ"];

export default function CategorySelect({ onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handlePress = (item, index) => {
    setSelectedCategory(index);
    onSelect(item); // ✅ ส่งค่ากลับไป AddSection
  };

  return (
    <View style={styles.container}>
      {categories.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            selectedCategory === index && styles.categoryButtonSelected,
          ]}
          onPress={() => handlePress(item, index)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === index && styles.categoryTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryButton: {
    backgroundColor: "#ccc", // สีเทาเริ่มต้น
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#FF8A8A', // สีเมื่อเลือก
  },
  categoryText: {
    color: "black",
  },
  categoryTextSelected: {
    color: "white", // ให้ตัวหนังสืออ่านง่ายขึ้นเมื่อพื้นหลังแดง
  },
});
