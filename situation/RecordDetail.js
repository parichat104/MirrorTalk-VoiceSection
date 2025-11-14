import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function RecordDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sectionId } = route.params;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const recordRef = collection(db, "SituationSection", sectionId, "Records");
        const querySnapshot = await getDocs(recordRef);
        const recordList = querySnapshot.docs.map((d, index) => ({
          id: d.id,
          title: `การประเมินครั้งที่ ${index + 1}`, // ✅ ตั้งชื่อแบบออโต้
          ...d.data(),
        }));
        setRecords(recordList);
      } catch (error) {
        console.error("Error fetching records: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [sectionId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>การประเมินทั้งหมด</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#4488E6" style={{ marginTop: 40 }} />
        ) : records.length === 0 ? (
          <Text style={styles.noData}>ยังไม่มีข้อมูลการบันทึก</Text>
        ) : (
          records.map((record) => (
            <TouchableOpacity
              key={record.id}
              style={styles.recordItem}
              onPress={() =>
                navigation.navigate("RecordItemDetail", {
                  recordId: record.id,
                  sectionId: sectionId,
                })
              }
            >
              <Text style={styles.recordTitle}>{record.title}</Text>
              <Ionicons name="chevron-forward" size={22} color="#000" />
            </TouchableOpacity>
          ))
        )}
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
  noData: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#666",
  },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffe699",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
