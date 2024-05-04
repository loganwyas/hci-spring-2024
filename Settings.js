import { useState } from "react";
import {
  Button,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings({ navigation: { navigate }, setPhoneNumber }) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
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

  function calculateValue(property) {
    let value = 0;
    for (let i = 0; i < meals.length; i++) {
      if (meals[i]["items"]) {
        for (let x = 0; x < meals[i]["items"].length; x++) {
          let quantity = Number(meals[i]["itemQuantity" + (x + 1).toString()]);
          let item = meals[i]["items"][x];
          let val = (item[property] / item["weight"]) * quantity;
          value += Math.round(val);
        }
      }
    }
    return value;
  }

  function countMeals(type) {
    let count = 0;
    for (let i = 0; i < meals.length; i++) {
      if (meals[i]["type"] == type) count += 1;
    }
    return count;
  }

  return (
    <View>
      {!gottenMeals && (
        <View style={styles.loadingSpinner}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {gottenMeals && (
        <View>
          <Text style={[styles.biggestText, styles.centered]}>
            Total Consumed
          </Text>
          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={[styles.bigText, styles.centered]}>
                {calculateValue("calories")}
              </Text>
              <Text style={styles.centered}>Calories</Text>
            </View>
            <View style={styles.item}>
              <Text style={[styles.bigText, styles.centered]}>
                {calculateValue("sugar")} g
              </Text>
              <Text style={styles.centered}>Sugar</Text>
            </View>
            <View style={styles.item}>
              <Text style={[styles.bigText, styles.centered]}>
                {calculateValue("fat")} g
              </Text>
              <Text style={styles.centered}>Fat</Text>
            </View>
          </View>
          <View style={styles.row}></View>
          <Text style={[styles.biggestText, styles.centered]}>
            {meals.length} Meals Eaten
          </Text>
          <View>
            <Text style={[styles.bigText, styles.centered]}>
              {countMeals("Breakfast")} Breakfasts
            </Text>
            <Text style={[styles.bigText, styles.centered]}>
              {countMeals("Lunch")} Lunches
            </Text>
            <Text style={[styles.bigText, styles.centered]}>
              {countMeals("Dinner")} Dinners
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  item: {
    margin: 20,
  },
  bigText: {
    fontSize: 25,
    fontWeight: 700,
    marginTop: 10,
  },
  biggestText: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 15,
  },
  centered: {
    textAlign: "center",
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
