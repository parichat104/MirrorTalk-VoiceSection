import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useState, useCallback } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function Section() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;  // ✅ id = sectionId

  const [sections, setSection] = useState(null);
  const [records, setRecords] = useState([]);   // ✅ ต้องมี useState


  // ✅ refresh ทุกครั้งเมื่อหน้า Section ถูก focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // ดึงข้อมูล Section
          const docRef = doc(db, "SituationSection", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setSection(docSnap.data());
          }

          // ดึง subcollection Records
          const recordsRef = collection(db, "SituationSection", id, "Records");
          const querySnapshot = await getDocs(recordsRef);
          const recordList = querySnapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
          }));
          setRecords(recordList);
        } catch (error) {
          console.error("Error fetching section or records: ", error);
        }
      };


      fetchData();
    }, [id])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{sections?.title || "โหลดข้อมูล..."}</Text>
            <View style={styles.topicTag}>
              <Text style={styles.buttonText}>{sections?.buttonText || "ไม่ระบุ"}</Text>
            </View>
          </View>

          <View style={styles.view3}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("SectionVideo", { sectionId: id })}
            >
              <Text style={styles.text3}>เริ่มฝึกซ้อม</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.text4}>ประวัติการบันทึก</Text>

        <TouchableOpacity
          style={styles.card1}
          onPress={() => navigation.navigate("RecordDetail", { sectionId: id })}
        >
          <Text style={styles.cardText}>การประเมินทั้งหมด</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollView: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    backgroundColor: "#4488E6",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 16,
    flexDirection: "column",
    alignItems: "center",
  },
  backBtn: {
    alignSelf: "flex-start",
    padding: 6,
    marginTop: 30,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  headerCenter: {
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  topicTag: {
    backgroundColor: "#CE0000",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  view3: { alignItems: "center", width: "100%" },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 36,
    marginTop: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  text3: { color: "#000000", fontSize: 18, fontWeight: "bold" },
  text4: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
    marginLeft: 20,
  },

  // ✅ การ์ดเหลืองอ่อนแบบ opacity
  card1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 215, 0, 0.3)", // สีทองอ่อน + โปร่งใส
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
