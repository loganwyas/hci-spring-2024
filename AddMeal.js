import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function AddMeal({ navigation: { navigate } }) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [mealDate, setMealDate] = useState(new Date());
  const [mealType, setMealType] = useState("Breakfast");
  const [itemsConsumed, setItemsConsumed] = useState([]);
  const [itemDropdowns, setItemDropdowns] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [gottenAllItems, setGottenAllItems] = useState(false);

  const geturl = apiUrl + "/api/getItems";
  const getItemsAsync = async () => {
    try {
      const response = await fetch(geturl);
      const json = await response.json();
      if (json) {
        setAllItems(json);
        setGottenAllItems(true);
      }
    } catch (error) {
      // console.error(error);
    }
  };

  if (!gottenAllItems) {
    getItemsAsync();
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    data["date"] = mealDate.toLocaleDateString();
    data["type"] = mealType;
    data["items"] = itemsConsumed;
    navigate("Meals", { meal: data });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setMealDate(currentDate);
  };

  function addItem() {
    setItemDropdowns([...itemDropdowns, false]);
    setItemsConsumed([
      ...itemsConsumed,
      allItems ? allItems[0] : { _id: "-1", name: "No Items Available" },
    ]);
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Meal Name"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="name"
          rules={{ required: "You must enter the name of the meal" }}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        <View style={styles.row}>
          <Text>Date Consumed: </Text>
          <DateTimePicker value={mealDate} mode="date" onChange={onChange} />
        </View>

        <Text>Meal Type:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <Text style={styles.dropdownText}>{mealType}</Text>
        </TouchableOpacity>
        {showDropdown && (
          <Picker
            selectedValue={mealType}
            onValueChange={(itemValue, itemIndex) => setMealType(itemValue)}
          >
            <Picker.Item label="Breakfast" value="Breakfast" />
            <Picker.Item label="Lunch" value="Lunch" />
            <Picker.Item label="Dinner" value="Dinner" />
          </Picker>
        )}
        {itemDropdowns &&
          itemDropdowns.map((item, index) => {
            let quantityId = `itemQuantity${index + 1}`;
            let quantityLabel = `Item ${index + 1} Quantity (grams)`;
            return (
              <View key={index}>
                <View style={styles.itemContainer}>
                  <View style={styles.item}>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() =>
                        setItemDropdowns([
                          ...itemDropdowns.slice(0, index),
                          !item,
                          ...itemDropdowns.slice(index + 1),
                        ])
                      }
                    >
                      <Text style={styles.dropdownText}>
                        {`${itemsConsumed[index]["name"]} (${itemsConsumed[index]["_id"]})`}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Controller
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextInput
                        placeholder={quantityLabel}
                        style={[styles.input, styles.item]}
                        keyboardType="numeric"
                        maxLength={2}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    )}
                    name={quantityId}
                    rules={{
                      required: `You must enter the quantity of item ${
                        index + 1
                      }`,
                    }}
                  />
                </View>
                {item && (
                  <Picker
                    selectedValue={`${itemsConsumed[index]["name"]} (${itemsConsumed[index]["_id"]})`}
                    onValueChange={(itemValue, itemIndex) =>
                      setItemsConsumed([
                        ...itemsConsumed.slice(0, index),
                        allItems[itemIndex],
                        ...itemsConsumed.slice(index + 1),
                      ])
                    }
                  >
                    {allItems &&
                      allItems.map((item) => {
                        return (
                          <Picker.Item
                            label={item["name"]}
                            value={`${item["name"]} (${item["_id"]})`}
                          />
                        );
                      })}
                    {!allItems && (
                      <Picker.Item
                        label="No Items Available"
                        value="No Items Available"
                      />
                    )}
                  </Picker>
                )}
                {errors[quantityId] && (
                  <Text style={styles.errorText}>
                    {errors[quantityId].message}
                  </Text>
                )}
              </View>
            );
          })}
        <Button title="Add Item" onPress={addItem} />
        <Button title="Save Meal" onPress={handleSubmit(onSubmit)} />
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
    justifyContent: "space-around",
    marginBottom: 10,
  },
  dropdown: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownContainer: {
    borderColor: "gray",
    borderWidth: 1,
    marginTop: -1,
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  item: {
    width: "50%",
  },
});
