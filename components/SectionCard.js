import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function SectionCard({ title, category, onPress, showDelete, onLongPress, onCancel, onConfirmDelete }) {

  return (
    <View>
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{category}</Text>
        </View> 
        </TouchableOpacity> 
        </View>


        {showDelete && (
        <View style={styles.deleteBox}>
          <Text style={styles.deleteText}>คุณต้องการลบ "{title}" หรือไม่?</Text>
          <View style={styles.deleteButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirmDelete}>
              <Text style={styles.confirmText}>ลบ</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      )}
        
        </View>

  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFBABA',
    marginHorizontal: 15,
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tag: {
    backgroundColor: '#E53935',
    alignSelf: 'flex-start',
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
  deleteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  deleteButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  cancelText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },
  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

});