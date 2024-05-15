import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import the components for the main application
import Inventory from "./Inventory";
import Camera from "./Camera";
import Statistics from "./Statistics";
import Meals from "./Meals";
import NewInventoryItem from "./NewInventoryItem";
import AddMeal from "./AddMeal";
import EditProfile from "./EditProfile";
import Profile from "./Profile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main App component
export default function App() {
  const [phoneNumber, setPhoneNumber] = useState(null);

  // Function to retrieve phone number from AsyncStorage
  useEffect(() => {
    const getPhoneNumber = async () => {
      const value = await AsyncStorage.getItem("number");
      setPhoneNumber(value);
    };

    getPhoneNumber();
  }, []);

  // Login component for entering phone number
  function Login() {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm();

    // Function to handle form submission
    const onSubmit = async (data) => {
      await AsyncStorage.setItem("number", data.phone);
      setPhoneNumber(data.phone);
    };

    return (
      <View style={styles.container}>
        <Text style={styles.introText}>Welcome to Your Nutrition Tracker!</Text>
        <Text style={styles.description}>Please enter your phone number:</Text>
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              keyboardType="numeric"
              maxLength={10}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="phone"
          rules={{
            required: "You must enter your phone number to continue",
          }}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}

        <Button title="Get Started" onPress={handleSubmit(onSubmit)} />
      </View>
    );
  }

  // Define the main application tabs
  function HomeTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Inventory"
          component={Inventory}
          options={{
            tabBarLabel: "Inventory",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="shopping-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Meals"
          component={Meals}
          options={{
            tabBarLabel: "Meals",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="food-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Statistics"
          component={Statistics}
          options={{
            tabBarLabel: "Statistics",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="chart-box-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          children={(props) => (
            <Profile setPhoneNumber={setPhoneNumber} {...props} />
          )}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-settings-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  // Create the navigation and screens
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!phoneNumber ? (
          // Render Login component if phone number is not set
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        ) : (
          // Render HomeTabs if phone number is set
          <>
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Barcode Scanner" component={Camera} />
            <Stack.Screen name="Add New Item" component={NewInventoryItem} />
            <Stack.Screen name="Create Meal" component={AddMeal} />
            <Stack.Screen name="Edit Profile" component={EditProfile} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  introText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
