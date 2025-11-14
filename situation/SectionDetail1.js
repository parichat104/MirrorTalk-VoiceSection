import React, { useState } from "react";
import { SafeAreaView, View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SectionDetail from "../components/SectionDetail";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "../context/UserContext";

export default function SectionDetail1() {
  const [title, setTitle] = useState("การนำเสนอ");
  const [exerciseName, setExerciseName] = useState("");
  const navigation = useNavigation();

  const { user } = useUser();

  const handleAddExercise = async () => {
    try {
      await addDoc(collection(db, "SituationSection"), {
        title: exerciseName,
        buttonText: title,
        uid: user.uid,
        createdAt: serverTimestamp()
      });
      navigation.navigate("Main", { screen: "Situation" });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <SectionDetail
          title={title}
          image="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/EitxTM9vxr/kcqugi6z_expires_30_days.png"
        />

        <Text style={styles.text2}>{"ชื่อบทฝึกซ้อม"}</Text>
        <TextInput
          placeholder={"Typing..."}
          value={exerciseName}
          onChangeText={setExerciseName}
          style={styles.input}
        />

        <Text style={styles.text3}>{"คำอธิบายเพิ่มเติม"}</Text>
        <Text style={styles.desc}>
          เข้าสู่ห้องประชุมจำลองเพื่อฝึกทักษะการพูดและการสื่อสารอย่างมั่นใจ
        </Text>
        <Text style={styles.desc1}>
          ระบบจะบันทึกวิดีโอ/เสียง และให้คำแนะนำจาก AI เพื่อพัฒนาทักษะของคุณ
        </Text>
        <View style={styles.view2}>
          <TouchableOpacity style={styles.button} onPress={handleAddExercise}>
            <Text style={styles.text4}>{"เลือกฝึกซ้อม"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  button: {
    backgroundColor: "#4488E6",
    borderRadius: 15,
    paddingVertical: 13,
    paddingHorizontal: 21,
  },
  input: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 41,
    marginHorizontal: 24,
    backgroundColor: "#EAEAEA",
    borderRadius: 15,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 32,
  },
  scrollView: { flex: 1, backgroundColor: "#FFFFFF" },
  text2: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 11,
    marginLeft: 24,
  },
  text3: {
    color: "#6E6E6E",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 24,
  },
  text4: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  view2: { alignItems: "center", marginBottom: 40 },

  desc: {
    color: "#6E6E6E",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 24,
  },
  desc1: {
    color: "#6E6E6E",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 100,
    marginLeft: 24,
  },
});
