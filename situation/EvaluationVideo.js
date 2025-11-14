import { 
  SafeAreaView, 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import ScoreBox from "../components/ScoreBox";

import { db } from "../firebaseConfig"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Evaluation() {
  const navigation = useNavigation(); 
  const route = useRoute();
  const { sectionId } = route.params || {};   // ✅ รับ sectionId จาก Section.js

  const [evalData, setEvalData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const resultStr = await AsyncStorage.getItem("evaluationResult");
        if (resultStr) {
          const raw = JSON.parse(resultStr);

          const minutes = Math.floor(raw.duration_sec / 60);
          const seconds = Math.floor(raw.duration_sec % 60);

          const result = {
            confidence: raw.confidence_percent || 0,
            appropriateness: raw.appropriateness_percent || 0,
            strengths: raw.strengths || "-",
            improvements: raw.improvements || "-",
            moves: raw.moves_detected || 0,
            movesPerMin: raw.moves_per_min?.toFixed(2) || 0,
            minutes,
            seconds,
            createdAt: serverTimestamp(),
          };

          setEvalData(result);
        }
      } catch (e) {
        console.error("Error loading evaluationResult:", e);
      }
    })();
  }, []);

  // ✅ ฟังก์ชันบันทึกผลลง Firestore
  const saveToFirebase = async () => {
  if (!evalData || !sectionId) {
    console.warn("⚠️ Missing data, ไม่สามารถบันทึก:", { sectionId, evalData });
    return;
  }

  try {
    console.log("📤 เตรียมบันทึก Subcollection ...");
    console.log("📂 Path: SituationSection/" + sectionId + "/Records");
    console.log("➡️ sectionId:", sectionId);
    console.log("➡️ evalData:", JSON.stringify(evalData, null, 2));

    const docRef = await addDoc(
      collection(db, "SituationSection", sectionId, "Records"),
      evalData
    );

    console.log("✅ บันทึกผลสำเร็จ → Subcollection");
    console.log("🆔 New Record DocId:", docRef.id);
  } catch (error) {
    console.error("❌ Error saving evaluation:", error);
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.box}></View>
        <Text style={styles.text}>{"คะแนนประเมิน"}</Text>

        {/* เวลา */}
        <View style={styles.view}>
          <View style={styles.row}>
            <Text style={styles.text2}>{"ระยะเวลาคลิปเสียง : "}</Text>
            <Text style={styles.text2}>{evalData?.minutes || "00"}</Text>
            <Text style={styles.text3}>{"นาที"}</Text>
            <Text style={styles.text2}>{evalData?.seconds || "00"}</Text>
            <Text style={styles.text4}>{"วินาที"}</Text>
          </View>
        </View>

        {/* จำนวนการเคลื่อนไหว */}
        <View style={styles.view}>
          <View style={styles.row}>
            <Text style={styles.text2}>{"จำนวนการเคลื่อนไหว : "}</Text>
            <Text style={styles.text2}>{evalData?.moves || 0}</Text>
            <Text style={styles.text4}>{"ครั้ง"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text2}>{"อัตราเฉลี่ย : "}</Text>
            <Text style={styles.text2}>{evalData?.movesPerMin || 0}</Text>
            <Text style={styles.text4}>{"ครั้ง/นาที"}</Text>
          </View>
        </View>

        {/* คะแนนย่อย */}
        <View style={styles.column}>
          <ScoreBox
            title="ความมั่นใจ (Confidence)"
            description="เคลื่อนไหวมั่นใจ ไม่แข็งทื่อ"
            percent={evalData?.confidence || 0}
          />
          <ScoreBox
            title="ความเหมาะสม (Appropriateness)"
            description="เคลื่อนไหวพอเหมาะ ดูสุภาพ"
            percent={evalData?.appropriateness || 0}
          />
        </View>

        {/* คำอธิบายเพิ่มเติม */}
        <View style={styles.column5}>
          <Text style={styles.text10}>{"สิ่งที่ทำได้ดี :"}</Text>
          <View style={styles.box3}>
            <Text style={{ padding: 8, color: "#555" }}>
              {evalData?.strengths || "-"}
            </Text>
          </View>
          <Text style={styles.text10}>{"สิ่งที่ควรปรับปรุง :"}</Text>
          <View style={styles.box4}>
            <Text style={{ padding: 8, color: "#555" }}>
              {evalData?.improvements || "-"}
            </Text>
          </View>
        </View>

        {/* ปุ่ม */}
        <View style={styles.view2}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={async () => {
              await saveToFirebase(); // ✅ บันทึกผลก่อน
              navigation.navigate("Main", { screen: "Situation" });
            }}
          >
            <Text style={styles.text11}>{"เสร็จสิ้น"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1,
	 backgroundColor: "#FFFFFF" 
	},
  scrollView: { flex: 1, 
	backgroundColor: "#FFFFFF" 
},

  box: {
    height: 68,
    backgroundColor: "#5595F2",
    marginBottom: 12,
	marginTop: -5,
	},


  text: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 20,       
    color: "#000",
	},

  view: { 
	alignItems: "center", 
	marginBottom: 10 
	},
  row: { 
	flexDirection: "row", 
	alignItems: "center" 
	},
  text2: { 
	fontSize: 14, color: "#555", 
	fontWeight: "700" 
},
  text3: { 
	fontSize: 14, color: "#555", 
	marginHorizontal: 6, 
	fontWeight: "700" 
},
  text4: { 
	fontSize: 14, 
	color: "#555", 
	marginLeft: 6, 
	fontWeight: "700"
 },

  column: { 
	gap: 8,
	 paddingHorizontal: 16, 
	 marginBottom: 12 
	},
  column2: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  column3: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  column4: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  text5: { fontSize: 14, 
	fontWeight: "800", 
	color: "#333" 
},
  row2: {
    marginTop: 2,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row3: {
    marginTop: 2,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text6: { 
	fontSize: 12, 
	color: "#8F8F8F", 
	flex: 1, 
	marginRight: 10 },
  text7: { fontSize: 12, 
	color: "#8F8F8F", 
	fontWeight: "700" 
},

  box2: {
    height: 8,
    backgroundColor: "#E6E6E6",
    borderRadius: 8,
    overflow: "hidden",
  },

  fill: { height: "100%", 
	backgroundColor: "#5595F2", 
	borderRadius: 8 
  },

  column5: { 
	paddingHorizontal: 16, 
	marginBottom: 12 
},
  text8: {
	 fontSize: 14, 
	 fontWeight: "800", 
	 color: "#333", 
	 marginTop: 6, 
	 marginBottom: 6 
	},
  row4: {
	 flexDirection: "row", 
	 alignItems: "center", 
	 marginBottom: 10 

  },
  text9: {
    fontSize: 18,
    fontWeight: "900",
    color: "#333",
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 100,
    textAlign: "center",
  },
  text10: { fontSize: 14, 
	fontWeight: "800", 
	color: "#333", 
	marginTop: 6, 
	marginBottom: 6 
},

  box3: {
    width: "100%",
    minHeight: 64,
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    marginBottom: 10,
  },
  box4: {
    width: "100%",
    minHeight: 64,
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
  },

  view2: { alignItems: "center", 
	paddingVertical: 16, 
	marginTop : 20,
},
  button: {
    backgroundColor: "#5595F2",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  text11: { color: "#fff", 
	fontSize: 16, 
	fontWeight: "900" },
});
