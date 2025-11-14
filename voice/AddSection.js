import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, TextInput, View, TouchableOpacity, Modal,ScrollView, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"
import { useUser } from "../context/UserContext";


import CategorySelect from '../components/CategorySelect';

export default function AddSectionScreen() {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(""); // รับจาก CategorySelect
  const [script, setScript] = useState("");

  const { user } = useUser();   // 👈 ได้ user จาก Context

  const navigation = useNavigation();
  
  const handleSave = async () => {
    if(!title || !category) {
      Alert.alert("กรุณากรอกข้อมูล");
      return;
    }

    try {
      await addDoc(collection(db, "VoiceSection"), {
        title,
        category,
        script,
        uid: user.uid,
        createdAt: new Date()
      });

      navigation.navigate("Main"); // กลับไปหน้าหลัก 

    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    }
  };

  return (
    <SafeAreaView>
    <ScrollView>
      {/* Header */}
      <View>
          <Text style={styles.texthead}>ชื่อบทฝึกซ้อม</Text>
          <TextInput style={styles.inputheader} 
          placeholder="ชื่อบทฝึกซ้อม" 
          value={title}
          onChangeText={setTitle}
          />
      </View>

      {/* category */}
      <View>
        <Text style={styles.texthead}>หมวดหมู่</Text>
        <View style={styles.category}>
        <CategorySelect onSelect={setCategory}/>
        </View>
      </View>

      {/* script */}
      <Text style={styles.texthead}>สคริปท์</Text>
      <TextInput 
      placeholder="Typing..." 
      style={styles.textArea} 
      multiline 
      value={script}
      onChangeText={setScript}
      />


      <View style={styles.nextButtonContainer}>
      <TouchableOpacity style={styles.nextButton} onPress={handleSave}>
        <Text style={styles.nextButtonText}>บันทึก</Text>
      </TouchableOpacity>
      </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  texthead: {
    fontSize: 18,
    marginLeft: 15,
    marginTop: 15,
    fontWeight: 'bold',
  },
  inputheader: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 15,
    backgroundColor: '#dbd9d9ff',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,
  },
  textArea: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 8, 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    minHeight: 100, 
    textAlignVertical: "top", 
    margin: 15 
    },
  category: {
    marginLeft: 15,
    marginTop: 10,
  },
  nextButtonContainer: {
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#FF8A8A",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: 200,
  },
  nextButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});
