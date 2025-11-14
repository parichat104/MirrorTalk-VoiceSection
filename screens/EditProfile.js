import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useUser } from "../context/UserContext";

export default function EditProfileScreen({ navigation }) {
  const { user, userData, setUserData } = useUser();   // ✅ ใช้ Context

  const [image, setImage] = useState(userData?.photoURL || null);
  const [username, setUsername] = useState(userData?.username || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [loading, setLoading] = useState(false);

  // ✅ ขอสิทธิ์ใช้คลังภาพ
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("ต้องอนุญาต", "กรุณาอนุญาตให้เข้าถึงคลังรูปภาพ");
      }
    })();
  }, []);

  // ✅ เลือกรูปจากเครื่อง
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  // ✅ บันทึกข้อมูล
  const handleSave = async () => {
    if (!user) return Alert.alert("กรุณาเข้าสู่ระบบก่อน");
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        username,
        email,
        photoURL: image,
      });

      // 👉 อัปเดต Context เพื่อให้หน้าอื่น ๆ เห็นข้อมูลใหม่ทันที
      setUserData((prev) => ({
        ...prev,
        username,
        email,
        photoURL: image,
      }));

      Alert.alert("สำเร็จ", "อัปเดตโปรไฟล์เรียบร้อยแล้ว");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("ผิดพลาด", err.message || "ไม่สามารถบันทึกได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
        <Image
          source={
            image
              ? { uri: image }
              : { uri: "https://via.placeholder.com/150" }
          }
          style={styles.avatar}
        />
        <Text style={styles.changePhoto}>เปลี่ยนรูป</Text>
      </TouchableOpacity>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="ชื่อ"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
      />

      {/* Save */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>บันทึก</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  avatarWrapper: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
  },
  changePhoto: { color: "#FF8A8A", marginTop: 8 },
  input: {
    backgroundColor: "#F3F3F3",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#FF8A8A",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
