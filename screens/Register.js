import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth, db } from "../firebaseConfig"; // 👈 firebase config
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      // สมัครสมาชิกด้วย email + password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // อัปเดต displayName ใน Firebase Authentication
      await updateProfile(user, { displayName: username });

      // เก็บข้อมูลลง Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        status: "activate",  
        createdAt: serverTimestamp(),
      });

      Alert.alert("สำเร็จ", "สมัครสมาชิกเรียบร้อย! กรุณาเข้าสู่ระบบ");
      navigation.navigate("Login"); // ✅ กลับไปหน้า Login
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ลงทะเบียน</Text>

      {/* Username */}
      <Text style={styles.label}>ชื่อผู้ใช้</Text>
      <TextInput
        style={styles.input}
        placeholder="Typing..."
        value={username}
        onChangeText={setUsername}
      />

      {/* Email */}
      <Text style={styles.label}>อีเมลล์</Text>
      <TextInput
        style={styles.input}
        placeholder="Typing..."
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <Text style={styles.label}>รหัสผ่าน</Text>
      <TextInput
        style={styles.input}
        placeholder="Typing..."
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>ลงทะเบียน</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.goBack()} // ✅ กลับไปหน้าก่อนหน้า (Login)
      >
        <Text style={styles.registerText}>กลับ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#FF8A8A",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
  },
  registerText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
