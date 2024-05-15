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
import { useForm, Controller } from "react-hook-form";

export default function EditProfile({ navigation: { navigate } }) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    Address: "",
    height: "",
    weight: "",
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    reset(userData);
  }, [userData]);

  // Gets phone number from stored data
  const getPhoneNumber = async () => {
    const value = await AsyncStorage.getItem("number");
    return value;
  };

  // Gets all of the user's profile data
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

  const onSubmit = async (data) => {
    // Fetch user phone number
    const userPhoneNumber = await getPhoneNumber();

    // Create the userdata object with user phone number
    const userdata = {
      name: data.name,
      email: data.email,
      Address: data.Address,
      height: data.height,
      weight: data.weight,
      user: userPhoneNumber,
    };

    try {
      let method = "POST"; // Default to POST

      // Check if user data already exists
      const responseExists = await fetch(
        `${apiUrl}/api/UserProfile?phoneNumber=${userPhoneNumber}`
      );
      if (responseExists.ok) {
        const existingData = await responseExists.json();
        if (existingData) {
          method = "PUT"; // Change method to PUT for update
        }
      }

      const submitResponse = await fetch(
        `${apiUrl}/api/UserProfile?phoneNumber=${userPhoneNumber}`,
        {
          method: method,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userdata),
        }
      );

      if (submitResponse.ok) {
        // Handle success
        console.log(
          method === "POST"
            ? "Data submitted successfully."
            : "Data updated successfully."
        );
        navigate("Profile", { data: userdata });
      } else {
        console.error("Failed to submit data:", submitResponse.status);
        // Handle failure to submit data
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* Textbox for entering the user's name */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="name"
          defaultValue={userData.name}
          rules={{ required: "You must enter the name" }}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        {/* Textbox for entering the user's email */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="email"
          defaultValue={userData.email}
          rules={{ required: "You must enter the email" }}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        {/* Textbox for entering the user's address */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Address"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="Address"
          defaultValue={userData.Address}
          rules={{ required: "You must enter the address" }}
        />
        {errors.Address && (
          <Text style={styles.errorText}>{errors.Address.message}</Text>
        )}

        {/* Textbox for entering the user's height */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Height"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="height"
          defaultValue={userData.height}
          rules={{ required: "You must enter the height" }}
        />
        {errors.height && (
          <Text style={styles.errorText}>{errors.height.message}</Text>
        )}

        {/* Textbox for entering the user's weight */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Weight"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="weight"
          defaultValue={userData.weight}
          rules={{ required: "You must enter the weight" }}
        />
        {errors.weight && (
          <Text style={styles.errorText}>{errors.weight.message}</Text>
        )}

        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </View>
    </SafeAreaView>
  );
}

// Styles
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
