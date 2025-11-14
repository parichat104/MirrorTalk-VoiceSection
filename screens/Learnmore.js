import React, { useEffect, useState } from "react";
import {SafeAreaView,View,Text,TextInput,TouchableOpacity,FlatList,StyleSheet,ActivityIndicator,} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { db } from "../firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import LessonCard from "../components/LearnMoreCard";
import { useNavigation } from "@react-navigation/native"; 

export default function LearnMoreScreen() {
    const navigation = useNavigation(); 
    const [search, setSearch] = useState("");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const q = query(collection(db, "articles"), orderBy("updatedAt", "desc"));
                const snapshot = await getDocs(q);

                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setArticles(data);
            } catch (err) {
                console.error("❌ Error fetching articles:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const renderItem = ({ item }) => (
        <LessonCard
            title={item.title}
            image={
                item.imageUrl && item.imageUrl !== ""
                    ? item.imageUrl
                    : "https://via.placeholder.com/300x150.png?text=No+Image"
            }
            onPress={() => navigation.navigate("LearnMoreDetail", { articleId: item.id })}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header} />

            {/* Search */}
            <View style={styles.searchRow}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#666" style={{ marginRight: 6 }} />
                    <TextInput
                        placeholder="ค้นหา"
                        value={search}
                        onChangeText={setSearch}
                        style={{ flex: 1 }}
                    />
                </View>
            </View>

            {/* Content */}
            {loading ? (
                <ActivityIndicator size="large" color="#E75480" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={articles.filter((a) =>
                        a.title.toLowerCase().includes(search.toLowerCase())
                    )}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
         flex: 1,
         backgroundColor: "#fff" 
        },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d077abff",
    paddingVertical: 35,
    paddingHorizontal: 14,
    marginTop: 30,
    marginBottom: 30,
  },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: -20,
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
    filterBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFD700",
        paddingHorizontal: 10,
        height: 40,
        borderRadius: 8,
        marginLeft: 8,
    },
});
