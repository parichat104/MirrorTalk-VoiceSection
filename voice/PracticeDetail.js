import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native';

export default function PracticeDetailScreen() {

  const route = useRoute();
  const { section } = route.params;

  const navigation = useNavigation();
  
      const nextPage = () => {
          navigation.navigate("Recorder", { section: section });
      };
      const allVoice = () => {
          navigation.navigate('VoiceReview', { section });
};


  return (
    
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>

          <Text style={styles.title}>{section.title}</Text>

          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{section.category}</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={nextPage}>
            <Text style={styles.startButtonText}>เริ่มฝึกซ้อม</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Script Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>สคริปท์</Text>
        <View style={styles.scriptBox}>
          <Text style={styles.scriptText}>
            {section.script}
          </Text>
        </View>
      </View>

      {/* All Voices Section */}
      <View style={styles.evaluatetitle}>
      <Text style={styles.sectionTitle}>ประวัติการบันทึก</Text>
      </View>

      <TouchableOpacity style={styles.voiceSection} onPress={allVoice}>
        <Text style={styles.voiceText}>การประเมินทั้งหมด</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
      
    </ScrollView>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 20,
    backgroundColor: "#FF8A8A", // สำหรับ expo-linear-gradient
    alignItems: 'center',
    position: 'relative',
    paddingTop: 20,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryTag: {
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 30,
  },
  startButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 7,
  },
  scriptBox: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginLeft: 7,
  },
  scriptText: {
    fontSize: 16,
    lineHeight: 20,
  },
  voiceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD580',
    padding: 16,
    justifyContent: 'space-between',
  },
  voiceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  evaluatetitle: {
    paddingLeft: 16,
  }
});
