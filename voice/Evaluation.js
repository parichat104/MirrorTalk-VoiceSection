import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useUser } from "../context/UserContext";

export default function EvaluationScreen({ route }) {
  const navigation = useNavigation();
  const { section, result } = route.params; // ✅ result มาจาก RecorderScreen

  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [normalized, setNormalized] = useState(null);

 
  // ✅ ฟังก์ชัน normalize โครงสร้าง API → ให้เรียกง่าย
  const normalizeResult = (res, duration) => {
    return {
      clarity: res.scores?.scores?.clarity || 0,
      fluency: res.scores?.scores?.fluency || res.fluency || 0,
      filler_count: res.scores?.scores?.filler_count || 0,
      strengths: res.scores?.strengths || [],
      improvements: res.scores?.improvements || [],
      transcript: res.transcript || "",
      audio_duration: res?.audio_duration || duration || 0,
    };
  };

  // ฟังก์ชันบันทึกลง Firestore
  const saveToFirestore = async (data) => {
    try {
      await addDoc(collection(db, "VoiceEvaluations"), {
        userId: user.uid,
        clarity: data.clarity,
        fluency: data.fluency,
        filler_count: data.filler_count,
        strengths: data.strengths,
        improvements: data.improvements,
        transcript: data.transcript,
        section: section?.title || "",
        audio_duration: data.audio_duration,
        createdAt: serverTimestamp(),
      });
      console.log("✅ บันทึกผลการประเมินเรียบร้อย");
    } catch (err) {
      console.error("❌ Error saving to Firestore:", err);
      Alert.alert("บันทึกไม่สำเร็จ", "กรุณาลองใหม่อีกครั้ง");
    }
  };

  useEffect(() => {
    const saveData = async () => {
      if (result) {
        const fixed = normalizeResult(result, route.params.duration);
        setNormalized(fixed);
        await saveToFirestore(fixed);
      } else {
        console.warn("⚠️ ไม่มีข้อมูล score จาก API");
      }
      setLoading(false);
    };
    saveData();
  }, [result]);

  const nextPage = () => {
    navigation.navigate("Practice", { section });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff5c5c" />
        <Text style={{ marginTop: 10 }}>กำลังบันทึกและประเมินผล...</Text>
      </View>
    );
  }

  if (!normalized) {
    return (
      <View style={styles.center}>
        <Text>⚠️ ไม่พบข้อมูลผลการประเมิน</Text>
      </View>
    );
  }

  // ✅ ดึงข้อมูลจาก normalized
  const { clarity, fluency, filler_count, strengths, improvements, transcript, audio_duration } = normalized;

  // ✅ แปลงเวลาจากวินาที → นาที:วินาที
  const duration = {
    minutes: Math.floor(audio_duration / 60),
    seconds: Math.floor(audio_duration % 60),
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ผลการประเมิน</Text>

      {/* เวลา */}
      <Text style={styles.label}>
        ระยะเวลาคลิปเสียง : {duration.minutes} นาที {duration.seconds} วินาที
      </Text>

      {/* Transcript */}
      {transcript ? <Text style={styles.label}>สิ่งที่พูด : {transcript}</Text> : null}

      {/* Clarity */}
      <View style={styles.section}>
        <Text style={styles.criteria}>ความชัดเจน (Clarity) - {clarity}%</Text>
        <ProgressBar progress={clarity / 100} color="#4CAF50" style={styles.progress} />
      </View>

      {/* Fluency */}
      <View style={styles.section}>
        <Text style={styles.criteria}>ความลื่นไหล (Fluency) - {fluency}%</Text>
        <ProgressBar progress={fluency / 100} color="#FF9800" style={styles.progress} />
      </View>

      {/* Filler words */}
      <Text style={styles.label}>จำนวนคำเติม (Filler words): {filler_count}</Text>

      {/* Strengths */}
      <Text style={styles.label}>สิ่งที่ทำได้ :</Text>
      {strengths.length > 0 ? (
        strengths.map((s, idx) => (
          <Text key={idx} style={styles.subText}>
            - {s}
          </Text>
        ))
      ) : (
        <Text style={styles.subText}>- ไม่มีข้อมูล</Text>
      )}

      {/* Improvements */}
      <Text style={styles.label}>สิ่งที่ควรปรับปรุง :</Text>
      {improvements.length > 0 ? (
        improvements.map((imp, idx) => (
          <Text key={idx} style={styles.subText}>
            - {imp}
          </Text>
        ))
      ) : (
        <Text style={styles.subText}>- ไม่มีข้อเสนอแนะ</Text>
      )}

      {/* ปุ่ม */}
      <TouchableOpacity style={styles.button} onPress={nextPage}>
        <Text style={styles.buttonText}>เสร็จสิ้น</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, marginTop: 10, marginBottom: 10 },
  section: { marginTop: 10, backgroundColor: "#F3F3F3", borderRadius: 8, padding: 15 },
  criteria: { fontSize: 14, fontWeight: "bold" },
  subText: { fontSize: 14, color: "#555", marginBottom: 5 },
  progress: { height: 8, borderRadius: 4, marginTop: 5 },
  button: { backgroundColor: "#FF6B6B", paddingVertical: 12, borderRadius: 15, alignItems: "center", marginTop: 30 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
