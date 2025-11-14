import {View,Text,ImageBackground,TouchableOpacity,StyleSheet,} from "react-native";

export default function SectionSelect({ title = "การนำเสนอ", image, onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.touch}
      >
        <ImageBackground
          source={{ uri: image }}
          style={styles.bg}
          imageStyle={styles.bgImage}
          resizeMode="cover"
        >
          <View style={styles.redOverlay} />

          <View style={styles.textWrap}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const CARD_HEIGHT = 170;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  touch: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3, // เงา Android
    shadowColor: "#000", // เงา iOS
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  bg: {
    height: CARD_HEIGHT,
    width: "100%",
    justifyContent: "center",
  },
  bgImage: {
    borderRadius: 16,
  },
  redOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    backgroundColor: "rgba(215, 12, 12, 0.7)" 
  },
  textWrap: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "55%",
    paddingLeft: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
});
