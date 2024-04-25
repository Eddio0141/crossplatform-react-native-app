import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Event, EventTime } from "../models/Event";
import { FontAwesome6 } from '@expo/vector-icons';
import SharedStyle from "../Style";

export default function Settings({ setEvents }) {
  const today = new Date();

  const Test = () => {
    return (
      <TouchableOpacity title="test" style={styles.button} onPress={() => {
        setEvents([
          new Event(new EventTime(today.getDay(), today.getHours(), 35), 60, "Jogging", 53.22659880937626, -0.5421307970516260),
          new Event(new EventTime(today.getDay(), today.getHours() + 1, 10), 60, "Jogging 2", 53.22659880937626, -0.5421307970516260),
          new Event(new EventTime(today.getDay(), today.getHours() + 1, 20), 60, "Jogging 3", 53.22659880937626, -0.5421307970516260),
          new Event(new EventTime(today.getDay(), today.getHours() + 1, 30), 60, "Jogging 4", 53.22659880937626, -0.5421307970516260),
          new Event(new EventTime(today.getDay(), today.getHours() + 1, 40), 60, "Jogging 5", 53.22659880937626, -0.5421307970516260),
          new Event(new EventTime(today.getDay(), today.getHours() + 1, 50), 60, "Jogging 6", 53.22659880937626, -0.5421307970516260),
          new Event(new EventTime(today.getDay(), today.getHours() + 2, 0), 60, "Jogging 7", 53.22659880937626, -0.5421307970516260),
          new Event(new EventTime(today.getDay(), today.getHours() + 2, 10), 60, "Jogging 8", 53.22659880937626, -0.5421307970516260),
        ]);
        console.log("test pressed");
      }}>
        <Text style={styles.buttonText}>Test</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={SharedStyle.container}>
      <View style={{ flex: 0.1 }} />
      <TouchableOpacity style={styles.button}>
        <FontAwesome6 name="person-running" size={30} color="black" />
        <Text style={styles.buttonText}>Manage Activities</Text>
      </TouchableOpacity>
      <Test />
    </View >
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    marginBottom: 15,

    // shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    margin: 20,
  },
});
