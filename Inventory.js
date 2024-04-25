import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";

const api = "https://application-mock-server.loca.lt";

export default function Inventory({ route, navigation: { navigate } }) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [permission, requestPermission] = useCameraPermissions();
  const { item } = route.params ?? { item: null };
  const [items, setItems] = useState([]);
  const [gottenItems, setGottenItems] = useState(false);

  const geturl = apiUrl + "/api/getItems";
  const getItemsAsync = async () => {
    try {
      const response = await fetch(geturl);
      const json = await response.json();
      if (json) {
        setItems(json);
        setGottenItems(true);
      }
    } catch (error) {
      // console.error(error);
    }
  };

  if (!gottenItems) {
    getItemsAsync();
  }

  if (item && items.indexOf(item) == -1) {
    const url = apiUrl + "/api/addItem";
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
      {!gottenItems && (
        <View style={styles.loadingSpinner}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {items &&
        items.map((item, index) => (
          <View style={styles.container} key={index}>
            <Text style={styles.bigText}>{item.name}</Text>
            <Text style={styles.smallerText}>
              Calories: {Math.round(item.calories * 100) / 100} calories
            </Text>
            <Text style={styles.smallerText}>
              Fat: {Math.round(item.fat * 100) / 100} grams
            </Text>
            <Text style={styles.smallerText}>
              Sugar: {Math.round(item.sugar * 100) / 100} grams
            </Text>
            <Text style={styles.smallerText}>
              Weight: {Math.round(item.weight * 100) / 100} grams
            </Text>
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
  loadingSpinner: {
    marginTop: 100,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
