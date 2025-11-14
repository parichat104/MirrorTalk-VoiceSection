import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ProgressBar } from "react-native-paper";
import { useUser } from "../context/UserContext";  // ✅ ใช้ context

export default function ProfileScreen({ navigation }) {
  const { user, userData } = useUser(); // ✅ ดึงจาก Context
  const [averages, setAverages] = useState({
    clarity: 0,
    fluency: 0,
    appropriateness: 0,
    confidence: 0,
  });

  const [counts, setCounts] = useState({
    practice: 0,
    situation: 0,
  });

  // ✅ โหลดสถิติทุกครั้งเมื่อเข้าหน้า
  useEffect(() => {
    if (user) {
      loadUserStats(user.uid);
    }

    const unsubscribe = navigation.addListener("focus", () => {
      if (user) {
        loadUserStats(user.uid);
      }
    });

    return unsubscribe;
  }, [navigation, user]);

  // ✅ โหลดคะแนน Voice + Situation
  const loadUserStats = async (uid) => {
    const voice = await loadVoiceStats(uid);
    const situation = await loadSituationStats(uid);

    setAverages({
      clarity: voice.clarity,
      fluency: voice.fluency,
      appropriateness: situation.appropriateness,
      confidence: situation.confidence,
    });

    setCounts({
      practice: voice.count,
      situation: situation.count,
    });
  };

  // ✅ สถิติการฝึกพูด
  const loadVoiceStats = async (uid) => {
    try {
      const q = query(collection(db, "VoiceEvaluations"), where("userId", "==", uid));
      const snapshot = await getDocs(q);

      let totalClarity = 0;
      let totalFluency = 0;
      let count = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalClarity += data.clarity || 0;
        totalFluency += data.fluency || 0;
        count++;
      });

      return {
        clarity: count ? Math.round(totalClarity / count) : 0,
        fluency: count ? Math.round(totalFluency / count) : 0,
        count,
      };
    } catch (error) {
      console.error("Error loading voice stats:", error);
      return { clarity: 0, fluency: 0, count: 0 };
    }
  };

  // ✅ สถิติการจำลองสถานการณ์
  const loadSituationStats = async (uid) => {
    try {
      const situationRef = collection(db, "SituationSection");
      const snapshot = await getDocs(situationRef);

      let totalAppropriateness = 0;
      let totalConfidence = 0;
      let count = 0;

      for (const docSnap of snapshot.docs) {
        const situationData = docSnap.data();
        if (situationData.uid === uid) {
          const evalRef = collection(docSnap.ref, "Records");
          const evalSnap = await getDocs(evalRef);

          evalSnap.forEach((evalDoc) => {
            const data = evalDoc.data();
            totalAppropriateness += data.appropriateness || 0;
            totalConfidence += data.confidence || 0;
            count++;
          });
        }
      }

      return {
        appropriateness: count ? Math.round(totalAppropriateness / count) : 0,
        confidence: count ? Math.round(totalConfidence / count) : 0,
        count,
      };
    } catch (error) {
      console.error("Error loading situation stats:", error);
      return { appropriateness: 0, confidence: 0, count: 0 };
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigation.replace("Login");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: userData?.photoURL
              ? userData.photoURL
              : "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData?.username || "User"}</Text>
        <Text style={styles.email}>{userData?.email || user?.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>{counts.practice}</Text>
          <Text style={styles.statsLabel}>ฝึกซ้อมพูด</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>{counts.situation}</Text>
          <Text style={styles.statsLabel}>จำลองสถานการณ์</Text>
        </View>
      </View>

      {/* Averages */}
      <View style={styles.metricBox}>
        <Text style={styles.metricTitle}>ความชัดเจนในการพูด (Clarity) - {averages.clarity} %</Text>
        <ProgressBar progress={averages.clarity / 100} color="#f18dabff" style={styles.progress} />
      </View>

      <View style={styles.metricBox}>
        <Text style={styles.metricTitle}>ความลื่นไหล (Fluency) - {averages.fluency} %</Text>
        <ProgressBar progress={averages.fluency / 100} color="#b7e1b8ff" style={styles.progress} />
      </View>

      <View style={styles.metricBox}>
        <Text style={styles.metricTitle}>ความเหมาะสม (Appropriateness) - {averages.appropriateness} %</Text>
        <ProgressBar progress={averages.appropriateness / 100} color="#93c8e3ff" style={styles.progress} />
      </View>

      <View style={styles.metricBox}>
        <Text style={styles.metricTitle}>ความมั่นใจ (Confidence) - {averages.confidence} %</Text>
        <ProgressBar progress={averages.confidence / 100} color="#e6e283ff" style={styles.progress} />
      </View>

      {/* Buttons */}
      <View style={styles.bottombox}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.actionText}>ตั้งค่าโปรไฟล์</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Text style={styles.actionText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  profileHeader: { alignItems: "center", marginVertical: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "bold" },
  email: { fontSize: 14, color: "#555" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    backgroundColor: "#ebe9e9ff",
    padding: 12,
    margin: 12,
    borderRadius: 15,
  },
  statsBox: { alignItems: "center" },
  statsValue: { fontSize: 20, fontWeight: "bold" },
  statsLabel: { fontSize: 14, color: "#555" },
  metricBox: {
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },
  metricTitle: { fontSize: 15, fontWeight: "bold"},
  metricScore: { fontSize: 16, textAlign: "right" },
  actionButton: {
    backgroundColor: "#FF8A8A",
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
  },
  actionText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  bottombox: { marginBottom: 30 },
  progress: { height: 8, borderRadius: 4, marginTop: 12 },
});
