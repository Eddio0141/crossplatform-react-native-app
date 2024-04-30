import { View, Button, TouchableOpacity, Text, TextInput, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import SharedStyle from "../Style";
import RNPickerSelect from "react-native-picker-select";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function EventTime() {
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(1);
  const [durationText, setDurationText] = useState("1");

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const amPm = hours < 12 ? "AM" : "PM";

  return (
    <View style={SharedStyle.container}>
      <View style={{ flex: 0.2 }} />
      <Text style={{ fontSize: 35, marginBottom: 10, marginRight: 10 }}>
        {hours}:{minutes} {amPm}
      </Text>
      <Button onPress={() => setTimePickerVisible(true)} title="Set start time" />
      {timePickerVisible ?
        <DateTimePicker mode="time" value={time} onChange={(e, newDate) => {
          setTimePickerVisible(false);
          if (e.type === "dismissed") return;
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
        <Text style={{ fontSize: 18 }}>Minutes duration</Text>
      </View>
      <RNPickerSelect
        onValueChange={(value) => {
          // find index of day
          const index = days.indexOf(value);
          if (index === -1) return;
          console.log(`Day of week: ${value}, index: ${index}`);
          setDay(index);
        }}
        placeholder={{ label: "Day of week", value: days[0] }}
        items={
          days.map((day) => { return { label: day, value: day } })
        }
      />
      <View style={{ flex: 0.1 }} />
      <Button title="Continue" onPress={() => {
        console.log(`Day: ${day}, Time: ${time}, Duration: ${duration}`);
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  textInputFont: {
    fontSize: 25
  }
});
