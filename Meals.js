import { useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Meals({ route, navigation: { navigate } }) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { meal } = route.params ?? { meal: null };
  const [meals, setMeals] = useState([]);
  const [gottenMeals, setGottenMeals] = useState(false);

  const getPhoneNumber = async () => {
    const value = await AsyncStorage.getItem("number");
    return value;
  };

  const geturl = apiUrl + "/api/getMeals";
  const getMealsAsync = async () => {
    try {
      const response = await fetch(geturl);
      const json = await response.json();
      if (json) {
        let number = await getPhoneNumber();
        if (number && number != "0") {
          let items = [];
          for (let i = 0; i < json.length; i++) {
            if (json[i]["user"] && json[i]["user"] == number) {
              items.push(json[i]);
            }
          }
          setMeals(items);
        } else {
          setMeals(json);
        }
        setGottenMeals(true);
      }
    } catch (error) {}
  };

  if (!gottenMeals) {
    getMealsAsync();
  }

  if (meal && meals.indexOf(meal) == -1) {
    const url = apiUrl + "/api/createMeal";
    const addMealToApiAsync = async () => {
      try {
        meal["user"] = await getPhoneNumber();
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(meal),
        });
      } catch (error) {}
    };

    addMealToApiAsync();
    setMeals([...meals, meal]);
  }
  return (
    <ScrollView>
      <View style={styles.row}>
        <Button
          title="Create New Meal"
          onPress={() => navigate("Create Meal")}
        />
      </View>
      {!gottenMeals && (
        <View style={styles.loadingSpinner}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {gottenMeals &&
        meals &&
        meals.map((meal, index) => {
          let items = [];
          let i = 1;
          while (meal["itemName" + i.toString()]) {
            items.push(
              <Text key={index + "-item" + i.toString()}>
                {meal["itemName" + i.toString()]} -{" "}
                {meal["itemQuantity" + i.toString()]} grams
              </Text>
            );
            i += 1;
          }
          if (meal["items"]) {
            for (let x = 0; x < meal["items"].length; x++) {
              items.push(
                <Text key={index + "-item" + x.toString()}>
                  {meal["items"][x]["name"]} -{" "}
                  {meal["itemQuantity" + (x + 1).toString()]} grams
                </Text>
              );
            }
          }
          return (
            <View style={styles.container} key={index}>
              <Text style={styles.bigText}>{meal.name}</Text>
              <Text style={styles.smallerText}>Type: {meal.type}</Text>
              <Text style={styles.smallerText}>Date: {meal.date}</Text>
              {items}
            </View>
          );
        })}
      {gottenMeals && (!meals || meals.length == 0) && (
        <Text>No meals have been created.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  bigText: {
    fontSize: 20,
  },
  smallerText: {
    fontSize: 16,
  },
  container: {
    padding: 20,
  },
  loadingSpinner: {
    marginTop: 100,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
