import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useState } from "react";
import { Button, StyleSheet, View, Text, ScrollView } from "react-native";

const api = "https://application-mock-server.loca.lt";

export default function Inventory({ route, navigation: { navigate } }) {
  const [permission, requestPermission] = useCameraPermissions();
  const { item } = route.params ?? { item: null };
  const [items, setItems] = useState([]);

  if (item && items.indexOf(item) == -1) {
    const url =
      "https://application-mock-server.loca.lt/api/user/userDataManually";
    const addItemToApiAsync = async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });
      } catch (error) {
        console.error(error);
      }
    };

    addItemToApiAsync();
    setItems([...items, item]);
  }

  async function startScanning() {
    await requestPermission();
    if (permission) {
      navigate("Barcode Scanner");
    }
  }

  return (
    <ScrollView>
      <View style={styles.row}>
        <Button title="Add Manually" onPress={() => navigate("Add New Item")} />
        <Button title="Add with Barcode" onPress={startScanning} />
      </View>
      {items &&
        items.map((item, index) => (
          <View style={styles.container} key={index}>
            <Text style={styles.bigText}>{item.name}</Text>
            <Text style={styles.smallerText}>
              Calories: {item.calories} calories
            </Text>
            <Text style={styles.smallerText}>Fat: {item.fat} grams</Text>
            <Text style={styles.smallerText}>Sugar: {item.sugar} grams</Text>
            <Text style={styles.smallerText}>Weight: {item.weight} grams</Text>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  bigText: {
    fontSize: 20,
  },
  smallerText: {
    fontSize: 16,
  },
  container: {
    padding: 20,
  },
});
