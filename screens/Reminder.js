import { View, Text, Button, Alert } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { FormatTime } from "../utils/Time";
import { Weather } from "../components/Weather";
import { useContext } from "react";
import { SharedContext } from "../SharedContext";
import { FilterIndex } from "../utils/Array";
import * as Notifications from "expo-notifications";
import { CurrentEventKey } from "../consts/Storage";
import { ToStorage } from "../utils/Storage";
import { TodayEventsToStorage } from "../store/TodayEvents";
import { CopyEventTime } from "../models/Event";

export default function Reminder({ navigation }) {
  const { todayEvents, setTodayEvents, setCurrentEvent, setReminderShow } = useContext(SharedContext);
  const event = todayEvents.events[0];

  if (event !== undefined) {
    (async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Exercise Reminder!",
          body: `${event.activity}, starting from ${FormatTime(event.timeStart)} to ${FormatTime(event.timeEnd)}`,
        },
        trigger: null,
      });
    })();
  }

  // TODO: check if same date, handle midnight reset

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
        <Button onPress={() => {
          // TODO: alert, are you sure you want to cancel?
          // BUG: handle reset midnight
          let cancelled = todayEvents.cancelled;
          cancelled.push(event);
          const events = FilterIndex(todayEvents.events, 0);
          setTodayEvents({ ...todayEvents, events, cancelled });
          setReminderShow(false);
          navigation.goBack();
        }} title="Cancel" />
        <Button onPress={() => {
          const eventParsed = { ...event, timeStart: CopyEventTime(event.timeStart), timeEnd: CopyEventTime(event.timeEnd) };

          // make sure event is still valid
          if (event.timeStart.day !== (new Date()).getDay() || eventParsed.timeEnd.timeLessThanDate(new Date())) {
            Alert.alert("Event is no longer valid");
            return;
          }

          console.log("Reminder: event is now active");
          setCurrentEvent(eventParsed);
          ToStorage(CurrentEventKey, eventParsed);

          const events = FilterIndex(todayEvents.events, 0);
          const newToday = { ...todayEvents, events };
          setTodayEvents(newToday);
          TodayEventsToStorage(newToday);
          setReminderShow(false);

          navigation.navigate("Activity");
        }} title="Start" />
      </View>
    </View>
  )
}
