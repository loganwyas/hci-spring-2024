import { useState } from "react";
import { Button, StyleSheet, View, Text, ScrollView } from "react-native";

export default function Meals({ route, navigation: { navigate } }) {
  const { meal } = route.params ?? { meal: null };
  const [meals, setMeals] = useState([]);

  const geturl = "https://application-mock-server.loca.lt/api/user/usermeals";
  const getMealsAsync = async () => {
    try {
      const response = await fetch(geturl);
      const json = await response.json();
      if (json) {
        setMeals(json);
      }
    } catch (error) {
      console.error(error);
    }
  };

  getMealsAsync();

  if (meal && meals.indexOf(meal) == -1) {
    const url = "https://application-mock-server.loca.lt/api/user/userMeals";
    const addMealToApiAsync = async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(meal),
        });
      } catch (error) {
        console.error(error);
      }
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
      {meals &&
        meals.map((meal, index) => (
          <View style={styles.container} key={index}>
            <Text style={styles.bigText}>{meal.name}</Text>
            <Text style={styles.smallerText}>Type: {meal.type}</Text>
            <Text style={styles.smallerText}>Date: {meal.date}</Text>
          </View>
        ))}
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
});
