import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";

export default function NewInventoryItem({ navigation: { navigate } }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Calculate nutritional info based on what the user entered and send the data
  const onSubmit = (data) => {
    let item = {
      name: data.name,
      calories: data.calories * data.servings,
      sugar: data.sugar * data.servings,
      fat: data.fat * data.servings,
      weight: data.servings * data.size,
    };
    navigate("Inventory", { item: item });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* Textbox for entering the item's name */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="name"
          rules={{ required: "You must enter the name of the item" }}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        {/* Textbox for entering the item's serving size */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Serving size (grams)"
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="size"
          rules={{ required: "You must enter the serving size" }}
        />
        {errors.size && (
          <Text style={styles.errorText}>{errors.size.message}</Text>
        )}

        {/* Textbox for entering the item's number of servings */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Number of servings"
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="servings"
          rules={{ required: "You must enter the number of servings" }}
        />
        {errors.servings && (
          <Text style={styles.errorText}>{errors.servings.message}</Text>
        )}

        {/* Textbox for entering the item's calorie count */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Calories (per serving)"
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="calories"
          rules={{ required: "You must enter the number of calories" }}
        />
        {errors.calories && (
          <Text style={styles.errorText}>{errors.calories.message}</Text>
        )}

        {/* Textbox for entering the item's fat content */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Total Fat (grams per serving)"
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="fat"
          rules={{ required: "You must enter the amount of total fat" }}
        />
        {errors.fat && (
          <Text style={styles.errorText}>{errors.fat.message}</Text>
        )}

        {/* Textbox for entering the item's sugar content */}
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder="Total Sugars (grams per serving)"
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
          name="sugar"
          rules={{ required: "You must enter the amount of total sugars" }}
        />
        {errors.sugar && (
          <Text style={styles.errorText}>{errors.sugar.message}</Text>
        )}

        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
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
