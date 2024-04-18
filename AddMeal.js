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
  const [mealDate, setMealDate] = useState(new Date());
  const [mealType, setMealType] = useState("Breakfast");
  const [itemsConsumed, setItemsConsumed] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    data["date"] = mealDate.toLocaleDateString();
    data["type"] = mealType;
    console.log(data);
    navigate("Meals", { meal: data });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setMealDate(currentDate);
  };

  function addItem() {
    setItemsConsumed([...itemsConsumed, "Item"]);
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
        {itemsConsumed.map((item, index) => {
          let nameId = `itemName${index + 1}`;
          let nameLabel = `Item ${index + 1} Name`;
          let quantityId = `itemQuantity${index + 1}`;
          let quantityLabel = `Item ${index + 1} Quantity`;
          return (
            <View key={index}>
              <View style={styles.itemContainer}>
                <Controller
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      placeholder={nameLabel}
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                  name={nameId}
                  rules={{
                    required: `You must enter the name/quantity of item ${
                      index + 1
                    }`,
                  }}
                />

                <Controller
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      placeholder={quantityLabel}
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={2}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                  name={quantityId}
                  rules={{
                    required: `You must enter the name/quantity of item ${
                      index + 1
                    }`,
                  }}
                />
              </View>
              {(errors[nameId] || errors[quantityId]) && (
                <Text
                  style={styles.errorText}
                >{`You must enter the name/quantity of item ${
                  index + 1
                }`}</Text>
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
  inputItem: {
    width: "45%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  dropdown: {
    height: 40,
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
    paddingHorizontal: 10,
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
});
