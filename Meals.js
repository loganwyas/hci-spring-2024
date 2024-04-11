import { Button, StyleSheet, View } from "react-native";

export default function Meals() {
  function addMeal() {}

  return (
    <View>
      <View style={styles.row}>
        <Button title="Create New Meal" onPress={addMeal} />
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
});
