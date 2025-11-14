import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function LearnMoreDetail({ route, navigation }) {
  const { articleId } = route.params; // รับ id ที่ส่งมาจาก LearnMore.js
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const ref = doc(db, "articles", articleId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setArticle(snap.data());
        }
      } catch (err) {
        console.error("❌ Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#E75480" />
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>ไม่พบบทความ</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{article.title}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Title */}
        <View style={styles.titleBox}>
          <Image
            source={require("../image/Crap.png")}
            style={styles.titleImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>{article.title}</Text>
        </View>

        {/* Image */}
        <Image
          source={{
            uri:
              article.imageUrl && article.imageUrl !== ""
                ? article.imageUrl
                : "https://via.placeholder.com/400x200.png?text=No+Image",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Description */}
        <View style={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Description</Text>

          <View style={styles.tag}>
            <Text style={styles.tagText}>การนำเสนอ</Text>
          </View>

          <Text style={styles.content}>{article.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d077abff",
    paddingVertical: 25,
    paddingHorizontal: 14,
    marginTop: 30,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
  titleBox: {
    width: "100%",
    backgroundColor: "#d09bbaff",
    paddingVertical: 50,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    overflow: "hidden",
  },

  titleImage: {
    position: "absolute",
    width: 400,
    height: 400,
    opacity: 0.9,
    marginTop: 110,
    marginRight: 220,
    transform: [{ rotate: "25deg" }],
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffffff",
    textAlign: "center",
    letterSpacing: 0.8,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
    marginLeft: 130,
  },

  image: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
  },
  tag: {
    backgroundColor: "rgba(215, 12, 12, 0.7)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  tagText: { color: "#fff", fontWeight: "bold" },
  content: { fontSize: 14, lineHeight: 22, textAlign: "justify" },
});
