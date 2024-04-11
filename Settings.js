import { Button, Text, StyleSheet, View } from "react-native";

export default function Settings() {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={[styles.bigText, styles.centered]}>3</Text>
          <Text style={styles.centered}>Meals Added</Text>
        </View>
        <View style={styles.item}>
          <Text style={[styles.bigText, styles.centered]}>5904</Text>
          <Text style={styles.centered}>Calories Consumed</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  item: {
    margin: 20,
  },
  bigText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  centered: {
    textAlign: "center",
  },
});
