import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Tab() {
  return (
    <View style={styles.container}>
      <Link href="/create" className="text-red-500">
        <Text>Yeni alışkanlık oluştur.</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
