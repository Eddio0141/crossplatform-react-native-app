import { Text, View, TouchableOpacity, Button, Alert } from "react-native";
import SharedStyle from "../Style";
import { SharedContext, AddActivityContext } from "../SharedContext";
import { useContext } from "react";
import { FormatTime } from "../utils/Time";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function EventsDisplay() {
  const { events } = useContext(SharedContext);

  if (events === undefined || events === null || events.length === 0) {
    return null;
  }

  return (
    <View style={{ borderWidth: 1.5, padding: 4 }}>
      {
        events.map((event, index) => (
          <Text key={index} style={{ fontSize: 15 }}>
            {days[event.timeStart.day]} - {FormatTime(event.timeStart)} - {event.activity} - {event.duration} minutes
          </Text>
        ))
      }
    </View>
  );
}

export default function GetStarted({ navigation }) {
  const { setEventSetup } = useContext(AddActivityContext);

  return (
    <View style={SharedStyle.container}>
      <View style={{ flex: 0.15 }} />
      <Text style={{ fontSize: 35, marginBottom: 15 }}>Add exercises!</Text>
      <EventsDisplay />
      <View style={{ marginBottom: 10 }} />
      <Button title="Add Exercise" onPress={() => {
        setEventSetup({ navigationStart: "GetStarted" });
        navigation.navigate("EventSetup");
      }} />
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
