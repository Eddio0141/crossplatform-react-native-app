import { View } from "react-native";
import SharedStyle from "../Style";
import { Calendar, DateData } from "react-native-calendars";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DaysInMonth } from "../utils/Time";

const CalendarKeyPrefix = "calendar-";

export default function CalendarView({ navigation }) {
  const [markedDates, setMarkedDates] = useState(undefined);
  const [monthData, setMonthData] = useState([]);
  // const [pendingPress, setPendingPress] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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
          const data = monthData[day.day - 1];
          navigation.navigate("CalendarFocus", { data });
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
  const { data } = route.params;

  return (
    <View>

    </View>
  );
}

export { CalendarFocus };
