import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Audio } from "expo-av";

export default function RecorderScreen() {
  const route = useRoute();
  const { section } = route.params;
  const navigation = useNavigation();

  const [recording, setRecording] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecordingStarted, setIsRecordingStarted] = useState(false);
  const [duration, setDuration] = useState(0);

  // แปลงเวลาเป็น HH:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 🎙️ เริ่มบันทึก
  const record = async () => {
    try {
      console.log("🎤 Start recording...");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsPaused(false);
      setIsRecordingStarted(true);
      setDuration(0);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  // ⏸ พักบันทึก (expo-av ยังไม่รองรับ pause โดยตรง → workaround)
  const pauseRecording = async () => {
    if (!recording) return;
    try {
      await recording.pauseAsync();
      setIsPaused(true);
    } catch (err) {
      console.warn("Pause not supported, stopping instead.");
      await stopRecording();
    }
  };

  // ▶️ กลับมาบันทึกต่อ
  const resumeRecording = async () => {
    if (!recording) return;
    try {
      await recording.startAsync();
      setIsPaused(false);
    } catch (err) {
      console.error("Error resuming recording:", err);
    }
  };

  // 🛑 หยุดบันทึก
  const stopRecording = async () => {
    try {
      console.log("🛑 Stop recording...");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("✅ File saved at:", uri);

      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const duration = status.durationMillis / 1000; // วินาที

      setIsPaused(false);
      setIsRecordingStarted(false);
      setRecording(null);
      setDuration(0);

      // ✅ Upload API
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "recorded_audio.m4a",
        type: "audio/m4a",
      });


      const API_URL = "http://10.1.26.44:8000/api/evaluate";

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("📤 API result:", result);

      navigation.navigate("Evaluation", {
        result,
        duration,
        section
      });
    } catch (err) {
      console.error("Error stopping recording:", err);
    }
  };

  // ⏱️ ตัวจับเวลา
  useEffect(() => {
    let timer;
    if (isRecordingStarted && !isPaused) {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingStarted, isPaused]);

  // 👇 UI เดิม (ไม่เปลี่ยน)
  return (
    <SafeAreaView>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>สคริปท์</Text>
        <View style={styles.scriptBox}>
          <Text style={styles.scriptText}>{section.script}</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timer}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.buttonRow}>
          {!isRecordingStarted ? (
            <TouchableOpacity style={styles.recordBtn} onPress={record}>
              <Text style={styles.btnText}>●</Text>
            </TouchableOpacity>
          ) : (
            <>
              {isPaused ? (
                <TouchableOpacity style={styles.controlBtn} onPress={resumeRecording}>
                  <Ionicons name="play" size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.controlBtn} onPress={pauseRecording}>
                  <Ionicons name="pause" size={24} color="white" />
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.stopBtn} onPress={stopRecording}>
                <Ionicons name="stop" size={24} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 7,
  },
  scriptBox: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    marginLeft: 7,
  },
  scriptText: {
    fontSize: 16,
    lineHeight: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 40,
  },
  timer: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  recordBtn: {
    backgroundColor: "red",
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  controlBtn: {
    backgroundColor: "#ffb347",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  stopBtn: {
    backgroundColor: "#ff5c5c",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 30,
    color: "#fff",
  },
  timeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
