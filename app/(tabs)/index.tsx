// Tab.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Tab({ navigation }) {
  const [habits, setHabits] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    // Ekran odaklandığında alışkanlıkları yükle
    if (isFocused) {
      loadHabits();
    }
  }, [isFocused]);

  const loadHabits = async () => {
    try {
      const storedHabits = await AsyncStorage.getItem("habits");
      const habits = storedHabits ? JSON.parse(storedHabits) : [];
      setHabits(habits);
    } catch (error) {
      console.error("Alışkanlıklar yüklenirken hata oluştu:", error);
    }
  };

  const renderHabit = ({ item }) => (
    <View
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
      <Text>Sıklık: {item.frequency}</Text>
      <Text>Günler: {item.days.map((day) => getDayName(day)).join(", ")}</Text>
      <Text>
        Hatırlatma Saati:{" "}
        {new Date(item.reminderTime).toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  const getDayName = (dayValue) => {
    const day = daysOfWeek.find((d) => d.value === dayValue);
    return day ? day.day : "";
  };

  const daysOfWeek = [
    { day: "Pzt", value: 1 },
    { day: "Sal", value: 2 },
    { day: "Çar", value: 3 },
    { day: "Per", value: 4 },
    { day: "Cum", value: 5 },
    { day: "Cmt", value: 6 },
    { day: "Paz", value: 7 },
  ];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("HabitCreationScreen")}
        style={{ marginBottom: 16 }}
      >
        <Text style={{ color: "#007bff" }}>Yeni Alışkanlık Oluştur</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Alışkanlıklarınız
      </Text>

      {habits.length === 0 ? (
        <Text>Henüz bir alışkanlık eklemediniz.</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHabit}
        />
      )}
    </View>
  );
}
