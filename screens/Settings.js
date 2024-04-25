import { View, Button } from "react-native";
import { Event, EventTime } from "../models/Event";

export default function Settings({ setEvents }) {
  const today = new Date();
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Button title="test" onPress={() => { setEvents([new Event(new EventTime(today.getDay(), today.getHours() + 1, 0), 60, "Jogging", 53.22659880937626, -0.5421307970516260)]); console.log("test pressed"); }} />
    </View>
  )
}
