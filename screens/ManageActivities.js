import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Button, Alert } from "react-native";
import SharedStyle from "../Style";
import { FontAwesome6 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FormatTime } from "../utils/Time";
import HLine from "../components/HLine";
import { SharedContext, AddActivityContext } from "../SharedContext";
import { useContext, useState, useEffect } from "react";

const dayText = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function RenderDay(setEventSetupEnabled, day, eventsFiltered, lastIndex, index, events, setEvents) {
  const { setEventSetup } = useContext(AddActivityContext);

  const iconSize = 25;
  return (
    <View key={index} style={{ marginLeft: "7%" }}>
      <Text style={{ fontSize: 25, marginBottom: 15 }}>{dayText[day]}</Text>
      {
        // now generate events for each day
        // TODO: clock icon with real time
        eventsFiltered.map((event, index) => (
          <View key={index} style={{ flexDirection: "row", marginBottom: 15 }}>
            <View style={{ alignSelf: "flex-start" }}>
              <TouchableOpacity
                style={{ ...SharedStyle.shadowButton, ...styles.button }}
                onPress={() => {
                  setEventSetup({ ...event, navigationStart: "ManageActivities" });
                  setEventSetupEnabled(true);
                }}
              >
                <FontAwesome6 name="edit" style={styles.buttonFont} size={iconSize} color="black" />
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...SharedStyle.shadowButton, ...styles.button }}
                onPress={() => Alert.alert(
                  "Confirmation",
                  "Are you sure you want to remove?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "OK", onPress: () => {
                        const removeIndex = lastIndex + index;
                        setEvents(events.filter((_, i) => i !== removeIndex));
                      }
                    }
                  ]
                )}
              >
                <FontAwesome6 name="trash" style={styles.buttonFont} size={iconSize} color="black" />
                <Text>Remove</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignSelf: "flex-start", alignItems: "center", marginLeft: 20, marginTop: 10 }}>
              <Text style={{ fontSize: 25, marginBottom: 15 }}>{event.activity}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="clock" size={iconSize} color="black" style={{ alignSelf: "center", marginRight: 5 }} />
                <Text style={{ fontSize: 15 }}>{FormatTime(event.timeStart)} to {FormatTime(event.timeEnd)}</Text>
              </View>
            </View>
          </View>
        ))
      }
    </View>
  );
}

export default function ManagedActivities({ navigation }) {
  const { events, setEvents } = useContext(SharedContext);
  const { setEventSetup } = useContext(AddActivityContext);
  const [eventSetupEnabled, setEventSetupEnabled] = useState(false);

  useEffect(() => {
    if (eventSetupEnabled) {
      setEventSetupEnabled(false);
      navigation.navigate("EventSetup");
    }
  }, [eventSetupEnabled]);

  let lastIndex = 0;
  // TODO: performance can be better by replacing scrollview
  return (
    <View style={{ ...SharedStyle.container, alignSelf: "flex-start", width: "100%" }}>
      <View style={{ marginBottom: 7 }} />
      <Button title="Add Activity" onPress={() => {
        setEventSetup({ navigationStart: "ManageActivities" });
        navigation.navigate("EventSetup");
      }} />
      <View style={{ marginBottom: 5 }} />
      <HLine />
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.scrollPad} />
        {
          // iterator for 7 days
          [...Array(7).keys()]
            .map((day) => {
              const eventsFiltered =
                events === undefined || events === null ?
                  [] : events.filter((event) => event.timeStart.day === day);
              const returnObj = {
                day: day,
                eventsFiltered: eventsFiltered,
                lastIndex: lastIndex
              };

              lastIndex += eventsFiltered.length;

              return returnObj;
            })
            .filter(({ eventsFiltered }) => eventsFiltered.length > 0)
            .map(({ day, eventsFiltered, lastIndex }, index) => RenderDay(setEventSetupEnabled, day, eventsFiltered, lastIndex, index, events, setEvents))
        }
      </ScrollView>
    </View>
  )
  // TODO: add activity
}

const styles = StyleSheet.create({
  weekDayText: {
    fontSize: 20,
  },
  button: {
    borderRadius: 7,
    marginBottom: 7,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonFont: {
    marginRight: 7,
  },
  scrollPad: {
    marginBottom: 15
  }
});
