import { SafeAreaView, View, ScrollView, Image, Text, ImageBackground, TouchableOpacity, StyleSheet, } from "react-native";
import { useNavigation } from '@react-navigation/native';
import SectionSelect from '../components/SectionSelect';
import { Ionicons } from '@react-native-vector-icons/ionicons';

//มีปัญหากับ linear-gradient

export default function AddSection() {
  const navigation = useNavigation();
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} >
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerText}>จำลองสถานการณ์</Text>

        </View>

        <View style={styles.sectionWrap}>
          <SectionSelect
            title="การนำเสนอ"
            image="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/EitxTM9vxr/q49w435i_expires_30_days.png"
            onPress={() => navigation.navigate("SectionDetail1")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#4488E6",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingTop: 24,
    paddingBottom: 90,
    paddingHorizontal: 14,
    position: "relative",
  },
  backBtn: {
    padding: 4,
    marginTop: 40,

  },
  headerText: {
    position: "absolute",
    left: "48%",
    transform: [{ translateX: -90 }],
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 50,
  },

  sectionWrap: {
    marginHorizontal: 8,
    marginTop: 24
  },
});