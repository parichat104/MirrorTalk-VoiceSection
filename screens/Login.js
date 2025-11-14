import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";
import { auth, db } from "../firebaseConfig"; 
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);

  // 🔑 ฟังก์ชันล็อกอิน
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      // ✅ ล็อกอินด้วย email / password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ ตรวจสอบสถานะจาก Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        if (userData.status === "suspended") {
          // 🔴 หากถูกระงับ
          Alert.alert(
            "บัญชีถูกระงับ",
            "กรุณาติดต่อผู้ดูแลระบบเพื่อเปิดใช้งานอีกครั้ง"
          );
          await signOut(auth);
          return;
        }

        // ✅ ถ้า activate ให้เข้าสู่ระบบ
        Alert.alert("สำเร็จ", "เข้าสู่ระบบเรียบร้อย");
        navigation.replace("Main");
      } else {
        Alert.alert("ไม่พบข้อมูลผู้ใช้", "กรุณาติดต่อผู้ดูแลระบบ");
        await signOut(auth);
      }
    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

  // 🔑 ฟังก์ชันส่งลิงก์รีเซ็ตรหัสผ่าน
  const handleResetPassword = () => {
    if (!resetEmail) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกอีเมลก่อน");
      return;
    }

    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        Alert.alert(
          "สำเร็จ",
        `ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${resetEmail}\n(หากไม่พบ กรุณาตรวจสอบในอีเมลขยะ)`,
        [{ text: "ตกลง" }]
        );
        setShowReset(false);
        setResetEmail("");
        Keyboard.dismiss();
      })
      .catch((error) => {
        Alert.alert("เกิดข้อผิดพลาด", `${error.code} : ${error.message}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>เข้าสู่ระบบ</Text>

      {/* Email */}
      <Text style={styles.label}>อีเมลล์</Text>
      <TextInput
        style={styles.input}
        placeholder="Typing..."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => setShowReset(true)}>
        <Text style={styles.forgotPassword}>ลืมรหัสผ่าน?</Text>
      </TouchableOpacity>

      {/* Popup Reset Password */}
      {showReset && (
        <View style={styles.popup}>
          <Text style={styles.popupTitle}>รีเซ็ตรหัสผ่าน</Text>
          <TextInput
            style={styles.input}
            placeholder="กรอกอีเมล..."
            value={resetEmail}
            onChangeText={setResetEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleResetPassword}
          >
            <Text style={styles.loginText}>ส่งลิงก์รีเซ็ต</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowReset(false)}>
            <Text style={{ textAlign: "center", marginTop: 10 }}>ยกเลิก</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Register Section */}
      <View style={styles.registerRow}>
        <View style={styles.line} />
        <Text style={styles.registerLabel}>ยังไม่มีบัญชีใช่ไหม?</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerText}>ลงทะเบียน</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 STYLE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#444",
  },
  input: {
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#FF8A8A",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  forgotPassword: {
    color: "#0066CC",
    textAlign: "center",
    marginVertical: 15,
    fontWeight: "500",
    fontSize: 14,
  },
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#999",
  },
  registerLabel: {
    marginHorizontal: 8,
    fontWeight: "bold",
    color: "#555",
  },
  registerButton: {
    backgroundColor: "#FF8A8A",
    borderRadius: 10,
    paddingVertical: 14,
  },
  registerText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  // Popup reset password
  popup: {
    position: "absolute",
    top: "30%",
    left: "5%",
    right: "5%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
});
