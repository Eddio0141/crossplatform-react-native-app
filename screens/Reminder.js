import { View, Text, Button } from 'react-native';
import Feather from "@expo/vector-icons/Feather";
import { FormatTime } from '../utils/Time';
import { Weather } from "../components/Weather";

export default function Reminder({ navigation, route }) {
  const { event } = route.params;
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
        <Button onPress={() => { }} title="Start" />
      </View>
    </View>
  )
}
