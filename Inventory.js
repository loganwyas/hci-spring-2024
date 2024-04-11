import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";

export default function Inventory({ navigation: { navigate } }) {
  const [permission, requestPermission] = useCameraPermissions();

  async function startScanning() {
    await requestPermission();
    if (permission) {
      navigate("Barcode Scanner");
    }
  }

  return (
    <View>
      <View style={styles.row}>
        <Button title="Add Manually" />
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
