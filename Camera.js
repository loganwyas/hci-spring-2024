import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useState } from "react";
import { Button, StyleSheet, Text, Modal, Pressable, View } from "react-native";

export default function Camera() {
  const [openCamera, setOpenCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isFetchingData, setIsFetching] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["upc_a"],
        }}
        onBarcodeScanned={(result) => {
          if (!isFetchingData && !modalVisible) {
            setIsFetching(true);
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
                if (data && data["hints"]) {
                  let scannedItem = {};
                  let food = data["hints"][0]["food"];
                  let nutrients = food["nutrients"];
                  scannedItem["name"] = food["label"] ?? "Unknown";
                  scannedItem["calories"] = nutrients["ENERC_KCAL"] ?? null;
                  scannedItem["sugar"] = nutrients["SUGAR"] ?? null;
                  scannedItem["fat"] = nutrients["FAT"] ?? null;
                  scannedItem["weight"] =
                    data["hints"][0]["measures"][1]["weight"] ?? null;
                  setScannedData(scannedItem);
                } else {
                  setScannedData(null);
                }
                setModalVisible(true);
                setOpenCamera(false);
                setIsFetching(false);
              })
              .catch(() => {
                setScannedData(null);
                setModalVisible(true);
                setOpenCamera(false);
                setIsFetching(false);
              });
          }
        }}
      ></CameraView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {scannedData && (
              <View>
                <Text style={styles.modalText}>
                  Name: "{scannedData["name"]}"
                </Text>
                <Text style={styles.modalText}>
                  Calories: {scannedData["calories"]}
                </Text>
                <Text style={styles.modalText}>
                  Sugar: {scannedData["sugar"]}
                </Text>
                <Text style={styles.modalText}>Fat: {scannedData["fat"]}</Text>
                <Text style={styles.modalText}>
                  Weight: {scannedData["weight"]}
                </Text>
                <Pressable
                  style={styles.button}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={styles.button}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Add to Inventory</Text>
                </Pressable>
              </View>
            )}
            {!scannedData && (
              <View>
                <Text style={styles.modalText}>
                  There was an error getting the data. Most likely, the barcode
                  scanned is not in our database. Please manually enter your
                  food item.
                </Text>
                <Pressable
                  style={styles.button}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={styles.button}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Manually Enter Data</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
