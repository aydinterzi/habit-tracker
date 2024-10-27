// HabitCreationScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import ColorPicker from "react-native-wheel-color-picker";

const daysOfWeek = [
  { day: "Pzt", value: 1 },
  { day: "Sal", value: 2 },
  { day: "Çar", value: 3 },
  { day: "Per", value: 4 },
  { day: "Cum", value: 5 },
  { day: "Cmt", value: 6 },
  { day: "Paz", value: 7 },
];

export default function HabitCreationScreen() {
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Günlük");
  const [selectedDays, setSelectedDays] = useState([]);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [color, setColor] = useState("#FF0000");
  const [icon, setIcon] = useState("fitness-outline"); // Ionicons ikonu

  const frequencyOptions = ["Günlük", "Haftalık"];

  const toggleDay = (dayValue) => {
    if (selectedDays.includes(dayValue)) {
      setSelectedDays(selectedDays.filter((day) => day !== dayValue));
    } else {
      setSelectedDays([...selectedDays, dayValue]);
    }
  };

  const onTimeChange = (event, selectedDate) => {
    const currentTime = selectedDate || reminderTime;
    setShowTimePicker(false);
    setReminderTime(currentTime);
  };

  const saveHabit = () => {
    // Alışkanlık verilerini kaydetme işlemleri
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Yeni Alışkanlık Oluştur
      </Text>
      {/* Alışkanlık Adı */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Alışkanlık Adı</Text>
        <TextInput
          className="border border-gray-300 rounded p-2"
          placeholder="Alışkanlık adı girin"
          value={habitName}
          onChangeText={setHabitName}
        />
      </View>
      {/* Sıklık */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Sıklık</Text>
        <View className="border border-gray-300 rounded">
          <Picker
            selectedValue={frequency}
            onValueChange={(itemValue) => setFrequency(itemValue)}
            style={{ height: 50 }}
          >
            {frequencyOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      </View>
      {/* Günler */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Günler</Text>
        <View className="flex-row flex-wrap">
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day.value}
              className={`m-1 p-2 border rounded ${
                selectedDays.includes(day.value)
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => toggleDay(day.value)}
            >
              <Text
                className={`${
                  selectedDays.includes(day.value)
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {day.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* Hatırlatma Saati */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Hatırlatma Saati</Text>
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          className="border border-gray-300 rounded p-2"
        >
          <Text>
            {reminderTime.toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>
      {/* Renk Seçimi */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Renk Seçimi</Text>
        <ColorPicker
          color={color}
          onColorChange={(selectedColor) => setColor(selectedColor)}
          style={{ height: 200 }}
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">İkon Seçimi</Text>
        <TouchableOpacity className="p-2 border border-gray-300 rounded">
          <Ionicons name={icon} size={30} color={color} />
        </TouchableOpacity>
        {/* İkon seçimi için modal veya liste ekleyebilirsiniz */}
      </View>
      {/* Kaydet Butonu */}
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded mb-10"
        onPress={saveHabit}
      >
        <Text className="text-white text-center font-bold">Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
