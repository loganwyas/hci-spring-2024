import React, { useState } from 'react';
import { Button, StyleSheet, View, TextInput, ScrollView, TouchableOpacity, Text } from 'react-native';

export default function Meals() {
  const [mealName, setMealName] = useState('');
  const [mealDate, setMealDate] = useState('');
  const [mealType, setMealType] = useState('');
  const [itemsConsumed, setItemsConsumed] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

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
    setItemsConsumed([...itemsConsumed, { name: '', quantity: '' }]);
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
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowDropdown(!showDropdown)}>
          <Text style={styles.dropdownText}>{mealType || 'Select meal type'}</Text>
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownContainer}>
            {mealTypes.map((type, index) => (
              <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => {
                console.log('Selected meal type:', type);
                setMealType(type === 'Select meal type' ? '' : type);
                setShowDropdown(false);
              }}>
                <Text>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {itemsConsumed.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <TextInput
              style={styles.inputItem}
              placeholder={`Item ${index + 1} Name`}
              value={item.name}
              onChangeText={(text) => handleItemNameChange(index, text)}
            />
            <TextInput
              style={styles.inputItem}
              placeholder={`Item ${index + 1} Quantity`}
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputItem: {
    width: '45%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: -1,
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});
