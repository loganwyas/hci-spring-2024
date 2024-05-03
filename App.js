import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Inventory from "./Inventory";
import Camera from "./Camera";
import Settings from "./Settings";
import Meals from "./Meals";
import NewInventoryItem from "./NewInventoryItem";
import AddMeal from "./AddMeal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Userprofile from "./Userprofile";
import Profile from "./Profile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
        component={Settings}
        options={{
          tabBarLabel: "Statistics",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-settings-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
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

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const getPhoneNumber = async () => {
    const value = await AsyncStorage.getItem("number");
    setPhoneNumber(value);
    return value;
  };

  getPhoneNumber();

  function Login() {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
      await AsyncStorage.setItem("number", data.phone);
      setPhoneNumber(data.phone);
    };

    return (
      <View style={styles.container}>
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
            required: "You must enter your phone number to get your data",
          }}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}

        <Button title="Get Started" onPress={handleSubmit(onSubmit)} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {phoneNumber && (
          <>
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Barcode Scanner" component={Camera} />
            <Stack.Screen name="Add New Item" component={NewInventoryItem} />
            <Stack.Screen name="Create Meal" component={AddMeal} />
          </>
        )}
        {!phoneNumber && (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    paddingTop: 100,
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
