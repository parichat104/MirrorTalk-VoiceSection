import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { collection, getDocs, deleteDoc, doc, query, where, } from "firebase/firestore";
import { db } from "../firebaseConfig"
import { useUser } from "../context/UserContext";


import SectionCard from '../components/SectionCard';


const categories = [
  "ทั้งหมด",
  "การนำเสนอ",
  "แนะนำตัว",
  "ซ้อมสัมภาษณ์",
  "การพูดอิสระ",
  "พูดภาษาอังกฤษ",
  "พูดในที่สาธารณะ"
];

export default function SectionVoiceHomeScreen() {
  const { user } = useUser();   // ดึงข้อมูล user จาก context

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ทั้งหมด");
  

  const handleSelect = (option) => {
    setSelectedFilter(option);
    setShowDropdown(false);
  };

  // ดึงข้อมูลจาก firebase
  useEffect(() => {
  const fetchData = async () => {
    if (!user) return; // ถ้ายังไม่ได้ login ไม่ต้องโหลด
    const q = query(
      collection(db, "VoiceSection"),
      where("uid", "==", user.uid)   // 👈 ให้โหลดเฉพาะ section ของ user นี้
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSections(data);
    setFilteredSections(data);
  };
  fetchData();
}, [isFocused, user]);


  // ฟังก์ชันสำหรับกรองข้อมูล
  useEffect(() => {
    let data = sections;

    // กรองตาม search
    if (searchText.trim() !== "") {
      data = data.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // กรองตามหมวดหมู่
    if (selectedFilter !== "ทั้งหมด") {
      data = data.filter(item => item.category === selectedFilter);
    }

    setFilteredSections(data);
  }, [searchText, selectedFilter, sections]);


  //ลบsection
  const [activeDeleteId, setActiveDeleteId] = useState(null);


  const handleDelete = async (id, title) => {
  try {
    // 1. ลบ Section หลัก
    await deleteDoc(doc(db, "VoiceSection", id));

    // 2. ลบ records ที่มี field section == title
    const q = query(
      collection(db, "VoiceEvaluations"),
      where("section", "==", title)   // 👈 ใช้ title ไม่ใช่ id
    );
    const snap = await getDocs(q);

    const batchDeletes = snap.docs.map((d) =>
      deleteDoc(doc(db, "VoiceEvaluations", d.id))
    );
    await Promise.all(batchDeletes);

    // 3. อัปเดต state
    setSections((prev) => prev.filter((item) => item.id !== id));

    console.log("✅ Section และประวัติถูกลบแล้ว");
  } catch (error) {
    console.error("❌ Error deleting section and records:", error);
  }
};


  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
        <Ionicons name="notifications-outline" size={24} color="#fff" style={styles.bellIcon} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="ค้นหา"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
      </View>

      {/* Add Button */}
      <TouchableOpacity onPress={() => navigation.navigate("Add")}>
        <View style={styles.addBox}>
          <View style={styles.addButton} >
            <Ionicons name="add" size={24} color="#000" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Filter Button */}
      <View style={{ marginHorizontal: 15, marginTop: 10 }}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.filterText}>{selectedFilter}</Text>
          <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={16} color="#000" />
        </TouchableOpacity>

        {/* Dropdown List */}
        {showDropdown && (
          <View style={styles.dropdown}>
            {categories.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleSelect(option)}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Item List */}
      {filteredSections.length > 0 ? (
        filteredSections.map((item) => (
          <SectionCard
            key={item.id}
            title={item.title}
            category={item.category}
            onPress={() => navigation.navigate("Practice", { section: item })}
            showDelete={activeDeleteId === item.id}
                onLongPress={() => setActiveDeleteId(item.id)}
                onCancel={() => setActiveDeleteId(null)}
                onConfirmDelete={() => {
                  handleDelete(item.id, item.title);
                  setActiveDeleteId(null);
                }}
          />
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>ไม่พบข้อมูล</Text>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#FF8A8A',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 25,
    paddingBottom: 10,
  },
  bellIcon: {
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
  },
  searchIcon: {
    marginLeft: 5,
  },
  addBox: {
    marginHorizontal: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD966',
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  filterText: {
    marginRight: 5,
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 5,
    paddingVertical: 5,
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
