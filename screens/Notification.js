import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../firebaseConfig"; // 👉 config firebase
import { collection, onSnapshot } from "firebase/firestore";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 👉 ฟังการเปลี่ยนแปลงของ collection "notifications"
    const unsubscribe = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>การแจ้งเตือน</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.details}>{item.detail}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>ยังไม่มีการแจ้งเตือน</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff6f6ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#333",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#999",
  },
});
