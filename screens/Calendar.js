import { View, Text, StyleSheet, ScrollView } from "react-native";
import SharedStyle from "../Style";
import { Calendar } from "react-native-calendars";
import { useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DaysInMonth } from "../utils/Time";
import { CalendarKeyPrefix, CalendarCaloriesKey, CalendarStepsKey, CalendarExerciseKey, CalendarEventsKey } from "../consts/Storage";
import { FormatTime, FormatMinutes } from "../utils/Time";
import { Feather } from "@expo/vector-icons";
import { CalcBurntCaloriesFromActivity, WeightToKg } from "../utils/ExerciseCalc";
import { SharedContext } from "../SharedContext";

export default function CalendarView({ navigation }) {
  const [markedDates, setMarkedDates] = useState(undefined);
  const [monthData, setMonthData] = useState([]);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [weightActual, setWeightActual] = useState(0);
  const { weight, weightMetric } = useContext(SharedContext);

  useEffect(() => {
    if (weight === undefined) return;
    setWeightActual(WeightToKg(weight, weightMetric));
  }, [weight, weightMetric]);

  // TODO: redo when month changes
  useEffect(() => {
    console.log(`fetching date entries for year: ${currentYear}, month: ${currentMonth}`);

    // fetch events from storage
    // format: calendar-YYYY-MM-DD
    const allKeys = [...Array(DaysInMonth(new Date(currentYear, currentMonth - 1, 0)))]
      .map((_, i) => `${CalendarKeyPrefix}${currentYear}-${currentMonth}-${i + 1}`);

    // fetch all keys
    AsyncStorage.multiGet(allKeys).then((data) => {
      const markedDates = {};
      let count = 0;
      data.forEach(([_, value], index) => {
        if (value === null) return;
        count++;
        markedDates[`${currentYear}-${currentMonth}-${index + 1}`] = { marked: true };
      });
      setMarkedDates(markedDates);

      // store data for when the user presses on a day
      setMonthData(data.map(([_, value]) => {
        if (value === null) return null;
        return JSON.parse(value);
      }));

      console.log(`fetched ${count} entries`);
    });
  }, [currentMonth, currentYear]);

  return (
    <View style={{ ...SharedStyle.container, alignItems: undefined, justifyContent: "center" }}>
      <Calendar
        style={{ backgroundColor: SharedStyle.containerLight.backgroundColor }}
        onDayPress={(day) => {
          if (markedDates === undefined) return;
          const data = monthData[day.day - 1];
          navigation.navigate("CalendarFocus", { data, day, weightActual });
        }}
        onMonthChange={(date) => {
          setCurrentMonth(date.month);
          setCurrentYear(date.year);
        }}
        markedDates={markedDates}
      />
    </View>
  )
}

function CalendarFocus({ route }) {
  const { data, day, weightActual } = route.params;

  if (data === null) {
    return (
      <View style={{ ...SharedStyle.container, justifyContent: "center" }}>
        <Text style={{ fontSize: 25 }}>Nothing happened this day!</Text>
      </View>
    );
  }

  // calendar day entries:
  // - calories
  // - steps
  // - exercise
  // - events (array of event entries)

  const { calories, steps, exercise, events } = data;

  return (
    <View style={SharedStyle.container}>
      <Text style={{ fontSize: 30 }}>{day.year}-{day.month.toString().padStart(2, "0")}-{day.day.toString().padStart(2, "0")}</Text>
      <Text style={{ ...styles.summaryText, marginTop: 10 }}>🔥 {calories === undefined ? 0 : Math.round(calories)} calories burnt</Text>
      <Text style={styles.summaryText}>🕖 {exercise ?? 0} mins of exercise</Text>
      <Text style={{ ...styles.summaryText, marginBottom: 15 }}>🚶 {steps ?? 0} steps</Text>
      <ScrollView>
        {
          events === undefined ?
            <Text>No events happened this day</Text> :
            events.map((event, index) => (
              <View key={index} style={{ marginTop: 20, alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Feather name="clock" size={35} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 23 }}>{FormatTime(event.timeStart)} ~ {FormatTime(event.timeEnd)}</Text>
                </View>
                <Text style={{ fontSize: 23, marginBottom: 10 }}>{event.activity} ({FormatMinutes(event.duration, true)})</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 20 }}>🔥 {CalcBurntCaloriesFromActivity(event.activity, weightActual, event.duration)} calories burnt</Text>
                </View>
              </View>
            ))
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryText: {
    fontSize: 20,
  },
});

export { CalendarFocus };
