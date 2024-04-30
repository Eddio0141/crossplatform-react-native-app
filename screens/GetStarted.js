import { Text, View, TouchableOpacity, Button, Alert } from "react-native";
import SharedStyle from "../Style";
import { SharedContext } from "../SharedContext";
import { useContext } from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function EventsDisplay() {
  const { events } = useContext(SharedContext);

  if (events === undefined || events === null || events.length === 0) {
    return null;
  }

  return (
    <View style={{ borderWidth: 1 }}>
      {
        events.map((event) => (
          <Text>{days[event.timeStart.day]}</Text>
        ))
      }
    </View>
  );
}

export default function GetStarted({ navigation }) {
  return (
    <View style={SharedStyle.container}>
      <View style={{ flex: 0.15 }} />
      <Text style={{ fontSize: 35 }}>Add exercises!</Text>
      <EventsDisplay />
      <View style={{ marginBottom: 10 }} />
      <Button title="Add Exercise" />
      <View style={{ flex: 0.7 }} />
      <TouchableOpacity
        style={{ ...SharedStyle.shadowButton, borderWidth: 1, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 45 }}
        onPress={() => Alert.alert(
          "Info",
          "You can add exercises later in the settings",
          [
            {
              text: "Ok", onPress: () => {
                navigation.navigate("GetStarted2");
              }
            }
          ]
        )}
      >
        <Text style={{ fontSize: 25 }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
