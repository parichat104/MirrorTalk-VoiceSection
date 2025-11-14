import React, { useEffect, useState } from "react";
import {SafeAreaView,View,Text, StyleSheet,ActivityIndicator,TouchableOpacity,ScrollView,} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ScoreBox from "../components/ScoreBox"; 

export default function RecordItemDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { recordId, sectionId } = route.params;

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const ref = doc(db, "SituationSection", sectionId, "Records", recordId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRecord({ id: snap.id, ...snap.data() });
        }
      } catch (e) {
        console.error("Error fetching record detail:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [recordId, sectionId]);

  if (loading)
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4488E6" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );

  if (!record)
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noData}>ไม่พบข้อมูลการประเมิน</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>รายละเอียดการประเมิน</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* เวลา */}
        <View style={styles.card}>
          <Text style={styles.label}>ระยะเวลาคลิป</Text>
          <Text style={styles.value}>
            {record.minutes || 0} นาที {record.seconds || 0} วินาที
          </Text>
        </View>

        {/* การเคลื่อนไหว */}
        <View style={styles.card}>
          <Text style={styles.label}>จำนวนการเคลื่อนไหว</Text>
          <Text style={styles.value}>{record.moves || 0} ครั้ง</Text>
          <Text style={styles.label}>อัตราเฉลี่ย</Text>
          <Text style={styles.value}>{record.movesPerMin || 0} ครั้ง/นาที</Text>
        </View>

        {/* คะแนนย่อย (Confidence + Appropriateness) */}
        <View style={{ gap: 8, marginBottom: 12 }}>
          <ScoreBox
            title="ความมั่นใจ (Confidence)"
            description="เคลื่อนไหวมั่นใจ ไม่แข็งทื่อ"
            percent={record.confidence || 0}  // ✅ ใช้ percent จาก record
          />
          <ScoreBox
            title="ความเหมาะสม (Appropriateness)"
            description="เคลื่อนไหวพอเหมาะ ดูสุภาพ"
            percent={record.appropriateness || 0} // ✅ ใช้ percent จาก record
          />
        </View>

        {/* สิ่งที่ทำได้ดี */}
        <View style={styles.card}>
          <Text style={styles.label}>สิ่งที่ทำได้ดี</Text>
          <Text style={styles.textArea}>{record.strengths || "-"}</Text>
        </View>

        {/* สิ่งที่ควรปรับปรุง */}
        <View style={styles.card}>
          <Text style={styles.label}>สิ่งที่ควรปรับปรุง</Text>
          <Text style={styles.textArea}>{record.improvements || "-"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4488E6",
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginTop: 33,
  },
  backBtn: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: { padding: 16 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
  },
  textArea: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  noData: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});
