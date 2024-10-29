// HabitCreationScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";

const daysOfWeek = [
  { day: "Mon", value: 1 },
  { day: "Tue", value: 2 },
  { day: "Wed", value: 3 },
  { day: "Thu", value: 4 },
  { day: "Fri", value: 5 },
  { day: "Sat", value: 6 },
  { day: "Sun", value: 7 },
];

export default function HabitCreationScreen({ navigation }) {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      habitName: "",
      frequency: "Daily",
      selectedDays: [],
      reminderTime: new Date(),
    },
  });

  const frequencyOptions = ["Daily", "Weekly"];

  const onTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setValue("reminderTime", selectedDate);
    }
  };

  const toggleDay = (dayValue, selectedDays) => {
    if (selectedDays.includes(dayValue)) {
      return selectedDays.filter((day) => day !== dayValue);
    } else {
      return [...selectedDays, dayValue];
    }
  };

  const onSubmit = async (data) => {
    const habit = {
      id: Date.now(), // Use timestamp as a unique ID
      name: data.habitName,
      frequency: data.frequency,
      days: data.selectedDays,
      reminderTime: data.reminderTime.toISOString(),
    };

    try {
      // Retrieve existing habits
      const existingHabits = await AsyncStorage.getItem("habits");
      const habits = existingHabits ? JSON.parse(existingHabits) : [];

      // Add the new habit
      habits.push(habit);

      // Save the habits back to AsyncStorage
      await AsyncStorage.setItem("habits", JSON.stringify(habits));

      Alert.alert("Success", "Habit saved successfully");

      // Reset the form
      reset();

      // Navigate back to the home screen
      navigation.goBack();
    } catch (error) {
      console.error("Error saving habit:", error);
      Alert.alert("Error", "An error occurred while saving the habit");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Create New Habit
      </Text>

      {/* Habit Name */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Habit Name</Text>
        <Controller
          control={control}
          name="habitName"
          rules={{ required: "Habit name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded p-2"
              placeholder="Enter habit name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.habitName && (
          <Text className="text-red-500">{errors.habitName.message}</Text>
        )}
      </View>

      {/* Frequency */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Frequency</Text>
        <Controller
          control={control}
          name="frequency"
          render={({ field: { onChange, value } }) => (
            <View className="border border-gray-300 rounded">
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={{ height: 50 }}
              >
                {frequencyOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          )}
        />
      </View>

      {/* Days */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Days</Text>
        <Controller
          control={control}
          name="selectedDays"
          rules={{
            validate: (value) =>
              value.length > 0 || "You must select at least one day",
          }}
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap">
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day.value}
                  className={`m-1 p-2 border rounded ${
                    value.includes(day.value)
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => onChange(toggleDay(day.value, value))}
                >
                  <Text
                    className={`${
                      value.includes(day.value) ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {day.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.selectedDays && (
          <Text className="text-red-500">{errors.selectedDays.message}</Text>
        )}
      </View>

      {/* Reminder Time */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Reminder Time</Text>
        <Controller
          control={control}
          name="reminderTime"
          render={({ field: { value } }) => (
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="border border-gray-300 rounded p-2"
            >
              <Text>
                {value.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          )}
        />
        {showTimePicker && (
          <DateTimePicker
            value={getValues("reminderTime")}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded mb-10"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white text-center font-bold">Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
