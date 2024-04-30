import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import SharedStyle from "../Style";

export default function Welcome({ navigation }) {
  return (
    <View style={SharedStyle.container}>
      <View style={{ flex: 0.2 }} />
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={{ ...styles.welcomeText, flex: 0.5 }}>FitJourney</Text>
      <TouchableOpacity
        style={{ ...SharedStyle.shadowButton, borderWidth: 1, borderRadius: 5, padding: 5 }}
        onPress={() => navigation.navigate("GetStarted")}
      >
        <Text style={{ fontSize: 35 }}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 40,
  },
});
