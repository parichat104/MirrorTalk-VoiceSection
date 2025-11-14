import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useRoute } from "@react-navigation/native";

export default function VoiceReviewDetailScreen() {
  const route = useRoute();
  const { record } = route.params || {};

  if (!record) {
    return (
      <View style={styles.center}>
        <Text>❌ ไม่มีข้อมูลการประเมิน</Text>
      </View>
    );
  }

  

  const clarity = record.clarity || 0;
  const fluency = record.fluency || 0;
  const filler_count = record.filler_count || 0;
  const strengths = record.strengths || [];
  const improvements = record.improvements || [];
  const transcript = record.transcript || "";
  const audio_duration= record.audio_duration || duration || 0;

  const duration = {
    minutes: Math.floor(audio_duration / 60),
    seconds: Math.floor(audio_duration % 60),
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ผลการประเมินย้อนหลัง</Text>

      <Text style={styles.label}>
        ระยะเวลาคลิปเสียง : {duration.minutes} นาที {duration.seconds} วินาที
      </Text>

      {transcript ? (
        <Text style={styles.label}>สิ่งที่พูด: {transcript}</Text>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.criteria}>ความชัดเจน (Clarity) - {clarity}%</Text>
        <ProgressBar progress={clarity / 100} color="#4CAF50" style={styles.progress} />
      </View>

      <View style={styles.section}>
        <Text style={styles.criteria}>ความลื่นไหล (Fluency) - {fluency}%</Text>
        <ProgressBar progress={fluency / 100} color="#FF9800" style={styles.progress} />
      </View>

      <Text style={styles.label}>จำนวนคำเติม (Filler words): {filler_count}</Text>

      <Text style={styles.label}>สิ่งที่ทำได้ :</Text>
      {strengths.length > 0 ? (
        strengths.map((s, idx) => <Text key={idx} style={styles.subText}>- {s}</Text>)
      ) : (
        <Text style={styles.subText}>- ไม่มีข้อมูล</Text>
      )}

      <Text style={styles.label}>สิ่งที่ควรปรับปรุง :</Text>
      {improvements.length > 0 ? (
        improvements.map((imp, idx) => <Text key={idx} style={styles.subText}>- {imp}</Text>)
      ) : (
        <Text style={styles.subText}>- ไม่มีข้อเสนอแนะ</Text>
      )}
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
});
