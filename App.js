import { useState } from "react";
import { Button, StyleSheet, Text, Modal, Pressable, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Inventory from "./Inventory";
import Camera from "./Camera";
import Settings from "./Settings";
import Meals from "./Meals";

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
        name="Profile"
        component={Settings}
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
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Barcode Scanner" component={Camera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
