import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function VoiceSection({ record, index }) {
  const navigation = useNavigation();

  const nextPage = () => {
    navigation.navigate("VoiceReviewDetail", { record });
  };

  return (
    <View>
      <TouchableOpacity onPress={nextPage}>
        <LinearGradient
          colors={["#fff", "#E169B0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.voiceSection}
        >
          <Text style={styles.voiceText}>การประเมินครั้งที่ {index + 1}</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  voiceSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
    marginTop: 2,
    borderRadius: 8,
  },
  voiceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});
