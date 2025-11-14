// ===== SectionVideo.js =====
import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CameraView, useCameraPermissions, useMicrophonePermissions, } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";


export default function SectionVideo() {
  const navigation = useNavigation();
  const route = useRoute();
  const { sectionId } = route.params || {};
  const cameraRef = useRef(null);


  // ===== Permission =====
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();


  // ===== State กล้อง/วิดีโอ =====
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);


  // ===== State เสียง + stopwatch + chat =====
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioRec, setAudioRec] = useState(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const voiceTimerRef = useRef(null);
  const [chat, setChat] = useState([]); // [{ from: 'user'|'bot', text: string }]


  // ===== FastAPI base URLs =====
  const MEDIAPIPE_BASE = "http://10.0.162.74:8000/analyze-video";

  const GATEWAY_BASE =
    Platform.OS === "android"
      ? "http://10.0.252.144:8001"
      : "http://localhost:8001";


  // ===== ขอ permission =====
  useEffect(() => {
    if (!cameraPermission) requestCameraPermission();
    if (!micPermission) requestMicPermission();
  }, [cameraPermission, micPermission]);


  // ===== ส่งวิดีโอไป FastAPI =====
  async function sendVideoToAPI(uri) {
    try {
      console.log("📌 Sending video to MediaPipe API:", MEDIAPIPE_BASE);
      const formData = new FormData();
      formData.append("file", { uri, name: "video.mp4", type: "video/mp4" });


      const res = await fetch(MEDIAPIPE_BASE, { method: "POST", body: formData });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`API error ${res.status}: ${t}`);
      }
      const result = await res.json();
      console.log("📌 MediaPipe API Result:", result);


      await AsyncStorage.setItem("evaluationResult", JSON.stringify(result));
      navigation.replace("EvaluationVideo", { sectionId });
    } catch (err) {
      console.error("sendVideoToAPI error:", err);
      Alert.alert("อัปโหลดวิดีโอไม่สำเร็จ", String(err));
    }
  }


  // ===== Video Recording =====
  const startVideoRecording = async () => {
    if (!cameraRef.current) return;
    if (!cameraPermission?.granted || !micPermission?.granted) {
      Alert.alert("ต้องอนุญาตทั้งกล้องและไมโครโฟนก่อน");
      await requestCameraPermission();
      await requestMicPermission();
      return;
    }
    try {
      setIsRecording(true);
      const data = await cameraRef.current.recordAsync();
      console.log("Video recorded:", data.uri);


      await MediaLibrary.createAssetAsync(data.uri);
      await AsyncStorage.setItem("recordedVideo", data.uri);
      setVideoUri(data.uri);


      await sendVideoToAPI(data.uri);
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert("อัดวิดีโอไม่สำเร็จ", String(error));
    } finally {
      setIsRecording(false);
    }
  };


  const stopVideoRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };


  // ===== Audio Recording =====
  async function startVoiceRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) return Alert.alert("ต้องอนุญาตไมโครโฟนก่อน");


      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });


      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();


      setAudioRec(rec);
      setIsAudioRecording(true);


      setElapsedSec(0);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    } catch (e) {
      console.warn("startVoiceRecording error:", e);
    }
  }


  async function sendVoiceToBot(uri, sender = "user-1") {
    const form = new FormData();
    form.append("file", { uri, name: "speech.m4a", type: "audio/m4a" });
    form.append("sender", sender);


    const res = await fetch(`${GATEWAY_BASE}/chat/voice`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Gateway ${res.status} ${t}`);
    }
    return res.json(); // { userText, botReplies }
  }


async function stopAndSendVoice() {
  try {
    if (!audioRec) return;
    await audioRec.stopAndUnloadAsync();
    const uri = audioRec.getURI();
    setAudioRec(null);
    setIsAudioRecording(false);


    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
    if (!uri) return;


    const data = await sendVoiceToBot(uri, "user-1");
    console.log("📌 Data from Whisper+Rasa:", data);


    // user
    if (data?.text) {
      setChat((prev) => [{ from: "user", text: data.text }, ...prev]);
    }


    // bot
    if (Array.isArray(data?.replies)) {
      data.replies.forEach((msg) => {
        if (msg.text) {
          setChat((prev) => [{ from: "bot", text: msg.text }, ...prev]);
        }
      });
    }


  } catch (e) {
    console.warn("stopAndSendVoice error:", e);
    Alert.alert("ส่งเสียงไม่สำเร็จ", String(e));
  }
}
  // ===== ไปหน้าถัดไป =====
  function goNext() {
    navigation.replace("EvaluationVideo", { sectionId }); // ✅ ส่ง sectionId ไปด้วย
  }


  // ===== Formatter stopwatch (เสียง) =====
  const mmVoice = String(Math.floor(elapsedSec / 60)).padStart(2, "0");
  const ssVoice = String(elapsedSec % 60).padStart(2, "0");


  if (!cameraPermission || !micPermission) return <View style={styles.container} />;
  if (!cameraPermission.granted || !micPermission.granted)
    return (
      <View style={[styles.container, styles.center]}>
        <Text>No access to camera/microphone</Text>
      </View>
    );


  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>




        {/* รูปด้านบน + overlay panel */}
        <View style={styles.heroWrap}>
          <Video
            source={require("./../image/Sensei.mp4")}
            resizeMode="cover"
            style={styles.imageLarge}
            shouldPlay
            isLooping
            isMuted={true}
            useNativeControls={false}
          />








          <View style={styles.overlayPanel}>
            {/* ปุ่มไมค์ + ไปหน้าถัดไป */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                onPress={isAudioRecording ? stopAndSendVoice : startVoiceRecording}
                style={[styles.micBtn, isAudioRecording && { backgroundColor: "#E53935" }]}
                activeOpacity={0.9}
              >
                <Ionicons name={isAudioRecording ? "stop-circle" : "mic"} size={20} color="#fff" />
                <Text style={styles.micText}>{isAudioRecording ? "หยุด & ส่ง" : "กดพูด"}</Text>
              </TouchableOpacity>




              <TouchableOpacity onPress={goNext} style={styles.nextBtn} activeOpacity={0.9}>
                <Text style={styles.nextText}>ไปหน้าถัดไป</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>




            {/* แชต */}
            <View style={styles.chatList}>
              <ScrollView contentContainerStyle={{ paddingBottom: 1 }}>
                {chat.length === 0 ? (
                  <Text style={{ color: "#555" }}>ผลลัพธ์การสนทนาจะปรากฏที่นี่</Text>
                ) : (
                  chat.map((m, idx) => (
                    <View
                      key={idx}
                      style={[styles.chatBubble, m.from === "user" ? styles.chatUser : styles.chatBot]}
                    >
                      <Text style={{ color: "#111" }}>{m.text}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </View>




        {/* กล้อง + ปุ่มอัดวิดีโอ */}
        <View style={styles.cameraContainer}>
          {!videoUri ? (
            <CameraView style={styles.camera} ref={cameraRef} facing="front" mode="video">
              <TouchableOpacity
                onPress={isRecording ? stopVideoRecording : startVideoRecording}
                style={[
                  styles.micBtn,
                  {
                    flex: 1,
                    justifyContent: "center",
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    right: 16,
                  },
                ]}
              >
                <Ionicons name={isRecording ? "stop-circle" : "videocam"} size={24} color="#fff" />
                <Text style={[styles.micText, { textAlign: "center" }]}>
                  {isRecording ? "หยุดอัดวิดีโอ" : "เริ่มอัดวิดีโอ"}
                </Text>
              </TouchableOpacity>
            </CameraView>
          ) : (
            <View style={{ flex: 1 }}>
              <Video
                source={{ uri: videoUri }}
                style={{ flex: 1 }}
                useNativeControls
                resizeMode="contain"
                isLooping
              />
              <TouchableOpacity
                onPress={() => setVideoUri(null)}
                style={[styles.micBtn, { margin: 12, justifyContent: "center" }]}
              >
                <Text style={styles.micText}>อัดวิดีโอใหม่</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
    </SafeAreaView>
  );

}


// ===== Styles (เหมือนเดิม) =====
const RADIUS = 24;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4488E6"
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#4488E6"
  },


  header: {
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: "#4488E6",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    marginTop: 30,
  },


  heroWrap: {
    position: "relative",
    marginHorizontal: 7,
    marginBottom: 10
  },
  imageLarge: {
    height: 320,
    marginHorizontal: 7,
    marginBottom: 10,
    borderRadius: RADIUS
  },
  overlayPanel: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 16,
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  micBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#222",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  micText: {
    color: "#fff",
    fontWeight: "700"
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0D6EFD",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  nextText: {
    color: "#fff",
    fontWeight: "700",
    marginRight: 4
  },


  chatList: {
    maxHeight: 140,
    borderRadius: 12,
    backgroundColor: "#FFF",
    padding: 8,
  },
  chatBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE",
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
    maxWidth: "100%",
  },
  chatUser: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
  chatBot: { alignSelf: "flex-start", backgroundColor: "#EEE" },




  cameraContainer: {
    height: 280,
    marginHorizontal: 10,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },


  center: {
    alignItems: "center",
    marginBottom: 16
  },
});

