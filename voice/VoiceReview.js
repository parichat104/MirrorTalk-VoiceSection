import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, ActivityIndicator, Text, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useUser } from "../context/UserContext";

import VoiceSection from "../components/VoiceSection";

export default function VoiceReviewScreen() {
  const route = useRoute();
  const { section } = route.params;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "VoiceEvaluations"),
          where("section", "==", section.title)
        );

        const snapshot = await getDocs(q);
        let list = snapshot.docs.map((doc, idx) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // sort by createdAt
        list = list.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setRecords(list);
      } catch (err) {
        console.error("❌ Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [section]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#ff5c5c" />
        <Text>กำลังโหลดประวัติ...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {records.length > 0 ? (
          records.map((rec, idx) => (
            <VoiceSection key={rec.id} record={rec} index={idx} />
          ))
        ) : (
          <Text style={styles.empty}>ยังไม่มีประวัติ</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 20, color: "#666" },
});
