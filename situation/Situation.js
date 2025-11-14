import React, { useState, useEffect } from "react";
import { SafeAreaView, View, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import Card from "../components/Card";

import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { useUser } from "../context/UserContext";

export default function Situation() {
  const [sections, setSections] = useState([]);
  const [activeDeleteId, setActiveDeleteId] = useState(null);
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const isFocused = useIsFocused();

  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // ถ้ายังไม่ได้ login ไม่ต้องโหลด
      const q = query(
        collection(db, "SituationSection"),
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "SituationSection", id));
      setSections((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const filteredSections = sections.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <TextInput
            placeholder={"ค้นหา"}
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
          <Ionicons name="search" size={22} color="#555" />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AddSectionVideo")}
        >
          <Ionicons name="add" size={36} color="#555" />
        </TouchableOpacity>

        <View style={styles.view3}>
          {filteredSections.length === 0 ? (
            <Text style={styles.noDataText}>ยังไม่มีข้อมูล</Text>
          ) : (
            filteredSections.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                text={item.buttonText}
                onPress={() => {
                  if (!activeDeleteId) navigation.navigate("Section", { id: item.id });
                }}
                showDelete={activeDeleteId === item.id}
                onLongPress={() => setActiveDeleteId(item.id)}
                onCancel={() => setActiveDeleteId(null)}
                onConfirmDelete={() => {
                  handleDelete(item.id);
                  setActiveDeleteId(null);
                }}
              />
            ))
          )}
        </View>


      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollView: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4488E6",
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
    marginTop: 30,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAEAEA",
    borderRadius: 15,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 12,
    marginBottom: 12,
    marginTop: 10,
    marginHorizontal: 17,
  },
  input: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    paddingVertical: 6,
  },

  button: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#6B6B6B",
    borderRadius: 10,
    borderWidth: 2,
    paddingVertical: 12,
    marginBottom: 9,
    marginHorizontal: 17,
  },

  view2: {
    alignItems: "flex-end",
    marginBottom: 30,
    marginRight: 17
  },
  row2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5DA6F",
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  text: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 6,
  },
  view3: {
    marginHorizontal: 17,
    marginBottom: 20,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#707070ff",
    marginTop: 20,
  },
  text5: {
    color: "#555",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 10,
  },
});
