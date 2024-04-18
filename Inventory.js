import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
const { manifest2 } = Constants;

const api = "https://application-mock-server.loca.lt";

export default function Inventory({ navigation: { navigate } }) {
  const [permission, requestPermission] = useCameraPermissions();

  const url = "https://application-mock-server.loca.lt/api/user/usermeals";
  const getItemsFromApiAsync = async () => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  };

  getItemsFromApiAsync();

  async function startScanning() {
    await requestPermission();
    if (permission) {
      navigate("Barcode Scanner");
    }
  }

  return (
    <View>
      <View style={styles.row}>
        <Button title="Add Manually" onPress={() => navigate("Add New Item")} />
        <Button title="Add with Barcode" onPress={startScanning} />
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
