import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  return (
    <View style={styles.container}>
      {permission && (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["upc_a"],
          }}
          onBarcodeScanned={(result) => {
            let api =
              "https://api.edamam.com/api/food-database/v2/parser?app_id=c2561828&app_key=62f3b9e585d90d6b875af08a312ca2d6&upc=" +
              result.data;
            fetch(api, {
              methods: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
              });
          }}
        ></CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
});
