import { CameraView, useCameraPermissions } from "expo-camera/next";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  View,
} from "react-native";

export default function Camera({ navigation: { navigate } }) {
  const [openCamera, setOpenCamera] = useState(false);
  const [isFetchingData, setIsFetching] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  function goToManualEntry() {
    setModalVisible(false);
    navigate("Add New Item");
  }

  function addItem() {
    setModalVisible(false);
    navigate("Inventory", { item: scannedData });
  }

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
                setIsFetching(false);
              })
              .catch(() => {
                setScannedData(null);
                setModalVisible(true);
                setIsFetching(false);
              });
          }
        }}
      ></CameraView>
      {isFetchingData && (
        <View style={styles.loadingSpinner}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
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
                <View style={styles.row}>
                  <Pressable
                    style={styles.button}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.button} onPress={() => addItem()}>
                    <Text style={styles.buttonText}>Add to Inventory</Text>
                  </Pressable>
                </View>
              </View>
            )}
            {!scannedData && (
              <View>
                <Text style={styles.modalText}>
                  There was an error getting the data. Most likely, the barcode
                  scanned is not in our database. Please manually enter your
                  food item.
                </Text>
                <View style={styles.row}>
                  <Pressable
                    style={styles.button}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.button}
                    onPress={() => goToManualEntry()}
                  >
                    <Text style={styles.textStyle}>Manually Enter Data</Text>
                  </Pressable>
                </View>
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
    padding: 25,
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
    margin: 10,
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  loadingSpinner: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
});
