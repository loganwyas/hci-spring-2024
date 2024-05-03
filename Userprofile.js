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

export default function Userprofile({ navigation: { navigate } }) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    Address: "",
    height:"",
    weight:"",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
      const response = await fetch(`${apiUrl}/api/getUserProfile?phoneNumber=${userPhoneNumber}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setUserData(data);
          console.log(userData);
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
    console.log("Form data:", data);

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
      const responseExists = await fetch(`${apiUrl}/api/UserProfile?phoneNumber=${userPhoneNumber}`);
      if (responseExists.ok) {
        const existingData = await responseExists.json();
        if (existingData) {
          method = "PUT"; // Change method to PUT for update
        }
      }
  
      const submitResponse = await fetch(`${apiUrl}/api/UserProfile?phoneNumber=${userPhoneNumber}`, {
        method: method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata),
      });
  
      if (submitResponse.ok) {
        // Handle success
        console.log(method === "POST" ? "Data submitted successfully." : "Data updated successfully.");
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
