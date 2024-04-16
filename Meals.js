import React, { useState } from "react";
import { Button, StyleSheet, View, TextInput, ScrollView } from "react-native";

export default function Meals() {
  const [mealName, setMealName] = useState("");
  const [mealDate, setMealDate] = useState("");
  const [mealType, setMealType] = useState("");
  const [itemsConsumed, setItemsConsumed] = useState([]);

  function addMeal() {
    // Save the meal data here
    console.log("Meal data:", {
      mealName,
      mealDate,
      mealType,
      itemsConsumed,
    });
  }

  function handleItemNameChange(index, name) {
    const updatedItems = [...itemsConsumed];
    updatedItems[index].name = name;
    setItemsConsumed(updatedItems);
  }

  function handleItemQuantityChange(index, quantity) {
    const updatedItems = [...itemsConsumed];
    updatedItems[index].quantity = quantity;
    setItemsConsumed(updatedItems);
  }

  function addItem() {
    setItemsConsumed([...itemsConsumed, { name: "", quantity: "" }]);
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Meal Name"
          value={mealName}
          onChangeText={(text) => setMealName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Date Consumed"
          value={mealDate}
          onChangeText={(text) => setMealDate(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Meal Type"
          value={mealType}
          onChangeText={(text) => setMealType(text)}
        />
        {itemsConsumed.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <TextInput
              style={styles.inputItem}
              placeholder="Item Name"
              value={item.name}
              onChangeText={(text) => handleItemNameChange(index, text)}
            />
            <TextInput
              style={styles.inputItem}
              placeholder="Quantity"
              value={item.quantity}
              onChangeText={(text) => handleItemQuantityChange(index, text)}
            />
          </View>
        ))}
        <Button title="Add Item" onPress={addItem} />
        <Button title="Save Meal" onPress={addMeal} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputItem: {
    width: "45%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
