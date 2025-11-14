import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function SectionDetail({
  title = "การนำเสนอ",
  image = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/EitxTM9vxr/kcqugi6z_expires_30_days.png",
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} style={styles.touch}>
        <ImageBackground
          source={{ uri: image }}
          style={styles.bg}
          imageStyle={styles.bgImage}
          resizeMode="cover"
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <View style={styles.redOverlay} />

          <View style={styles.textWrap}>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const CARD_HEIGHT = 190;

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 12, 
    paddingVertical: 8 
  },
  touch: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    marginTop: 30,
  },
  bg: { 
    height: CARD_HEIGHT, 
    width: "100%", 
    justifyContent: "center" 
  },
  bgImage: { 
    borderRadius: 16
   },

  redOverlay: {
    position: "absolute",
    left: 0, top: 0, bottom: 0,
    width: "50%",
    backgroundColor: "rgba(215, 12, 12, 0.7)",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  textWrap: {
    position: "absolute",
    left: 16, top: 0, bottom: 0,
    width: "55%",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff"
  },

  backBtn: {
    position: "absolute",
    left: 12,
    top: 40,
    zIndex: 2
  },
});
