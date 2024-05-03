import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile({ navigation: { navigate } }) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [userData, setUserData] = useState({
    name: null,
    email: null,
    Address: null,
    height: null,
    weight: null,
  });

  useEffect(() => {
    getUserData();
  }, []);

  const getPhoneNumber = async () => {
    const value = await AsyncStorage.getItem("number");
    return value;
  };

  const getUserData = async () => {
    try {
      const userPhoneNumber = await getPhoneNumber();
      const response = await fetch(
        `${apiUrl}/api/getUserProfile?phoneNumber=${userPhoneNumber}`
      );
      if (response.ok) {
        const data = await response.json();
        let val = null;
        for (let i = 0; i < data.length; i++) {
          if (data[i]["user"] == userPhoneNumber) val = data[i];
        }
        if (val) {
          setUserData(val);
        }
      } else {
        console.error("Failed to fetch user data:", response.status);
        // Handle failure to fetch user data
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error
    }
  };

  return (
    <View style={styles.container}>
      <Text>Name: {userData.name ?? "N/A"}</Text>
      <Text>Email: {userData.email ?? "N/A"}</Text>
      <Text>Address: {userData.Address ?? "N/A"}</Text>
      <Text>Height: {userData.height ?? "N/A"}</Text>
      <Text>Weight: {userData.weight ?? "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
