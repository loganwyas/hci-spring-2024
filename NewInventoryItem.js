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

  const onSubmit = (data) => {
    navigate("Inventory", { item: data });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
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
