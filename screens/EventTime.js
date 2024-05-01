import { View, Button, TouchableOpacity, Text, TextInput, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState, useContext } from "react";
import SharedStyle from "../Style";
import RNPickerSelect from "react-native-picker-select";
import { AddActivityContext } from "../SharedContext";
import { EventTime as Et } from "../models/Event";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function EventTime({ navigation }) {
  const { eventSetup, setEventSetup } = useContext(AddActivityContext);

  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const today = new Date();
  const [day, setDay] = useState(eventSetup?.timeStart?.day ?? today.getDay());
  const [time, setTime] = useState(
    eventSetup?.timeStart === undefined ?
      today :
      new Date(today.getFullYear(), today.getMonth(), today.getDate(), eventSetup.timeStart.hour, eventSetup.timeStart.minute)
  );
  const [duration, setDuration] = useState(eventSetup?.duration ?? 10);
  const [durationText, setDurationText] = useState(duration.toString());
  const [remindMinutes, setRemindMinutes] = useState(eventSetup?.remindMinutes ?? 15);
  const [remindMinutesText, setRemindMinutesText] = useState(remindMinutes.toString());

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const amPm = hours < 12 ? "AM" : "PM";

  return (
    <View style={SharedStyle.container}>
      <View style={{ flex: 0.2 }} />
      <TouchableOpacity
        onPress={() => setTimePickerVisible(true)}
      >
        <Text style={{ fontSize: 35, marginBottom: 10, marginRight: 10 }}>
          {hours}:{minutes} {amPm}
        </Text>
      </TouchableOpacity>
      <Button onPress={() => setTimePickerVisible(true)} title="Set start time" />
      {timePickerVisible ?
        <DateTimePicker mode="time" value={time} onChange={(e, newDate) => {
          setTimePickerVisible(false);
          if (e.type !== "set") return;
          setTime(newDate);
        }} />
        : null
      }
      <View style={{ flex: 0.3 }} />
      <View style={{ flexDirection: "row", alignItems: "center", flex: 0.2 }}>
        <TextInput
          style={{ ...SharedStyle.textInput, ...styles.textInputFont, marginRight: 5 }}
          keyboardType="numeric"
          value={durationText}
          onChangeText={(text) => setDurationText(text)}
          onEndEditing={() => {
            if (durationText === "") {
              setDurationText(duration.toString());
            }
            const num = Math.max(1, parseInt(durationText));
            if (isNaN(num)) return;
            setDurationText(num.toString());
            setDuration(num);
          }}
        />
        <Text style={{ fontSize: 18 }}>minutes duration</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{ ...SharedStyle.textInput, ...styles.textInputFont, marginRight: 5 }}
          keyboardType="numeric"
          value={remindMinutesText}
          onChangeText={(text) => setRemindMinutesText(text)}
          onEndEditing={() => {
            if (remindMinutesText === "") {
              setRemindMinutesText(remindMinutes.toString());
            }
            const num = Math.max(1, parseInt(remindMinutesText));
            if (isNaN(num)) return;
            setRemindMinutesText(num.toString());
            setRemindMinutes(num);
          }}
        />
        <Text style={{ fontSize: 18 }}>minutes reminder</Text>
      </View>
      <RNPickerSelect
        onValueChange={(value) => {
          // find index of day
          const index = days.indexOf(value);
          if (index === -1) return;
          console.log(`Day of week: ${value}, index: ${index}`);
          setDay(index);
        }}
        placeholder={{ label: "Day of week", value: days[time.getDay()] }}
        items={
          days.map((day) => { return { label: day, value: day } })
        }
      />
      <View style={{ flex: 0.1 }} />
      <TouchableOpacity onPress={() => {
        console.log(`Day: ${day}, Time: ${time}, Duration: ${duration}, Remind: ${remindMinutes}`);
        const timeStart = new Et(day, time.getHours(), time.getMinutes());
        setEventSetup({ ...eventSetup, timeStart, duration, remindMinutes });
        navigation.navigate("EventLocation");
      }}
        style={styles.continueSkipButton}
      >
        <Text style={styles.continueSkipText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputFont: {
    fontSize: 25
  },
  continueSkipButton: {
    ...SharedStyle.shadowButton,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  continueSkipText: {
    fontSize: 25
  }
});
