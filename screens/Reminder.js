import { View, Text, Button } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { FormatTime } from "../utils/Time";
import { Weather } from "../components/Weather";
import { useContext } from "react";
import { SharedEventContext } from "../SharedContext";

export default function Reminder({ navigation, route }) {
  const { event } = route.params;
  const { setCurrentEvent } = useContext(SharedEventContext);

  // TODO: clock react to time
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 35, marginBottom: 30 }}>Reminder</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
        <Feather name="clock" size={60} color="black" style={{ alignSelf: "center", marginRight: 20 }} />
        <Text style={{ fontSize: 25 }}>{FormatTime(event.timeStart)} ~ {FormatTime(event.timeEnd)}</Text>
      </View>
      <Text style={{ fontSize: 25, marginBottom: 15 }}>{event.activity}</Text>
      <Weather event={event} />
      <View style={{ marginBottom: 35 }} />
      <View style={{ flexDirection: "row", justifyContent: "space-around", width: "70%" }}>
        <Button onPress={() => navigation.goBack()} title="Cancel" />
        <Button onPress={() => {
          // make sure event is still valid
          if (event.timeStart.day === (new Date()).getDay() && event.timeEnd.timeMoreThanDate(new Date())) {
            console.log("Reminder: event is now active");
            setCurrentEvent(event);
          }
        }} title="Start" />
      </View>
    </View>
  )
}
