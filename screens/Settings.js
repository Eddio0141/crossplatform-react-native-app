import { View, StyleSheet, Text, TouchableOpacity, Button } from "react-native";
import { Event, EventTime } from "../models/Event";
import { FontAwesome6 } from '@expo/vector-icons';
import SharedStyle from "../Style";
import ManageActivities from "../screens/ManageActivities";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function SettingsMain({ events, setEvents, navigation, setCurrentEvent }) {
  const today = new Date();

  const Test = () => {
    return (
      <View>
        <Button title="test" onPress={() => {
          setEvents([
            new Event(new EventTime(today.getDay(), today.getHours(), today.getMinutes() + 2), 5, 1, "Jogging", 53.22659880937626, -0.5421307970516260),
            new Event(new EventTime(today.getDay(), today.getHours() + 1, 10), 60, 10, "Jogging 2", 53.22659880937626, -0.5421307970516260),
            new Event(new EventTime(today.getDay(), today.getHours() + 1, 20), 60, 10, "Jogging 3", 53.22659880937626, -0.5421307970516260),
            new Event(new EventTime(today.getDay(), today.getHours() + 1, 30), 60, 10, "Jogging 4", 53.22659880937626, -0.5421307970516260),
            new Event(new EventTime(today.getDay(), today.getHours() + 1, 40), 60, 10, "Jogging 5", 53.22659880937626, -0.5421307970516260),
            new Event(new EventTime(today.getDay(), today.getHours() + 1, 50), 60, 10, "Jogging 6", 53.22659880937626, -0.5421307970516260),
            new Event(new EventTime(today.getDay(), today.getHours() + 2, 0), 60, 10, "Jogging 7", 53.22659880937626, -0.5421307970516260),
            new Event(new EventTime(today.getDay(), today.getHours() + 2, 10), 60, 10, "Jogging 8", 53.22659880937626, -0.5421307970516260),
            new Event(new EventTime(today.getDay() + 1 > 6 ? 0 : today.getDay() + 1, today.getHours(), today.getMinutes()), 60, 10, "Jogging 9", 53.22659880937626, -0.5421307970516260),
          ]);
          console.log("test pressed");
        }} />
        <Button title="clear storage" onPress={() => {
          setEvents([]);
        }} />
        <Button title="test2" onPress={() => navigation.navigate("Reminder")} />
      </View>
    );
  };

  return (
    <View style={SharedStyle.container}>
      <View style={{ flex: 0.1 }} />
      <TouchableOpacity style={{ ...SharedStyle.shadowButton, ...styles.button }} onPress={() => navigation.navigate("ManageActivities")}>
        <FontAwesome6 name="person-running" size={30} color="black" />
        <Text style={styles.buttonText}>Manage Activities</Text>
      </TouchableOpacity>
      <Test />
    </View >
  )
}

const Stack = createNativeStackNavigator();

export default function Settings({ events, setEvents, setCurrentEvent }) {
  return (
    <Stack.Navigator initialRouteName="SettingsMain">
      <Stack.Screen name="SettingsMain" options={{ headerTitle: "Settings" }}>
        {(props) => <SettingsMain {...props} events={events} setEvents={setEvents} setCurrentEvent={setCurrentEvent} />}
      </Stack.Screen>
      <Stack.Screen name="ManageActivities" options={{ headerTitle: "Manage Activities" }}>
        {(props) => <ManageActivities {...props} events={events} setEvents={setEvents} />}
      </Stack.Screen>
    </Stack.Navigator >
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    marginBottom: 15,
    width: "100%",
  },
  buttonText: {
    fontSize: 20,
    margin: 20,
  },
});
