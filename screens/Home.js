import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import HLine from "../components/HLine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Event from "../data/Storage";
import Feather from "@expo/vector-icons/Feather";
import FormatTime from "../utils/Time";

function SummaryBar() {
  // TODO: make this args
  const [calories, setCalories] = useState(null);
  const [exercise, setExercise] = useState(null);

  // only read from storage when nessesary
  if (calories === null) {
    async function getData() {
      try {
        const caloriesTodayData = await AsyncStorage.getItem("calories-today");

        if (caloriesTodayData !== null) {
          setCalories(caloriesTodayData);
        } else {
          setCalories(0);
        }

        const exerciseTodayData = await AsyncStorage.getItem("exercise-today");

        if (exerciseTodayData !== null) {
          setExercise(exerciseTodayData);
        } else {
          setExercise(0);
        }
      } catch (e) {
        console.error(`Error getting calories: ${e}`);

        setCalories(0);
        setExercise(0);
      }
    }

    getData().then();
  }

  return (
    <View style={styles.summaryBar}>
      <Text style={styles.summaryText}>🔥 {calories} calories burnt</Text>
      <Text style={styles.summaryText}>🕖 {exercise} mins of exercise</Text>
    </View>
  );
}

function Upcoming({ events }) {
  const today = new Date();

  const upcoming = events.filter((event) => {
    return event.timeStart.getDay() === today.getDay() && event.timeStart > today;
  });

  const NoEvents = () => {
    return (
      <View style={{ marginTop: 25, marginBottom: 25 }}>
        <Text style={{ textAlign: "center" }}>No more events for today</Text>
      </View>
    )
  };

  // TODO: check events
  // TODO: weather
  // TODO: clock react to time
  const Events = () => {
    if (upcoming.length > 0) {
      const event = upcoming[0];

      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.iconTextContainer}>
            <Feather name="clock" size={40} color="black" style={{ alignSelf: "center" }} />
            <Text style={{ fontSize: 17, textAlignVertical: "center", marginLeft: 10 }}>
              {FormatTime(event.timeStart)} ~ {FormatTime(event.timeEnd)}
            </Text>
          </View>
          <Text style={{ ...styles.upcomingSpace, fontSize: 18 }}>
            {event.activity}
          </Text>
          <Navigation style={styles.upcomingSpace} />
          <Weather />
        </View>
      )
    } else {
      return (
        <View>
          <NoEvents />
        </View >
      )
    }
  };

  return (
    <View>
      <Text style={styles.bigText}>Upcoming</Text>
      <Events />
    </View>
  );
}

function CurrentEvent({ events }) {
  // TODO: change this not accept all events. user can cancel, which makes this useless
  const today = new Date();

  // filter events to get current event
  const currentEvents = events.filter((event) => {
    return event.timeStart.getDay() === today.getDay() && event.timeStart <= today && event.timeEnd >= today;
  });

  const NoEvents = () => {
    return (
      <View style={{ marginTop: 25, marginBottom: 25 }}>
        <Text style={{ textAlign: "center" }}>Nothing going on!</Text>
      </View>
    )
  };

  const Events = () => {
    if (currentEvents.length > 0) {
      const currentEvent = currentEvents[0];
      // TODO: clock react to time

      return (
        <View>
          <Text style={{ textAlign: "center", fontSize: 18 }}>{currentEvent.activity}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Feather name="clock" size={24} color="black" style={{ alignSelf: "center" }} />
              <Text style={styles.eventText}>{FormatTime(currentEvent.timeStart)}</Text>
              <Text style={{ textAlign: "center" }}>to</Text>
              <Text style={styles.eventText}>{FormatTime(currentEvent.timeEnd)}</Text>
            </View>
            <View style={{ justifyContent: "space-evenly" }}>
              <Navigation />
              <Weather />
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View>
          <NoEvents />
        </View >
      )
    }
  };

  return (
    <View style={{ width: "65%" }}>
      <Text style={styles.bigText}>Current Event</Text>
      <Events />
    </View>
  );
}

export default function Home() {
  // TODO: restore
  // const [events, setEvents] = useState(null);
  const [events, setEvents] = useState([
    new Event(new Date(2024, 3, 22, 15, 40), 60, "Jogging")
  ]);

  if (events === null) {
    async function getData() {
      try {
        const eventsData = await AsyncStorage.getItem("events");
        if (eventsData !== null) {
          setEvents(eventsData);
        } else {
          setEvents([]);
        }
      } catch (e) {
        console.error(`Error getting events: ${e}`);
        setEvents([]);
      }
    }
    getData().then();
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.2 }} />
      <SummaryBar />
      <Upcoming events={events} />
      <HLine />
      <CurrentEvent events={events} />
    </View >
  );
}

function Navigation({ style }) {
  return (
    <View style={{ ...styles.iconTextContainer, ...style }}>
      <Feather name="map-pin" size={24} color="black" />
      <Text style={{ ...styles.eventText, marginLeft: 5 }}>Navigation</Text>
    </View>
  );
}

function Weather() {
  // TODO: weather implement
  return (
    <View style={styles.iconTextContainer}>
      <Feather name="cloud" size={24} color="black" />
      <Text style={{ ...styles.eventText, marginLeft: 5 }}>TODO: weather</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  summaryBar: {
    flex: 0.8,
  },
  summaryText: {
    fontSize: 20,
  },
  bigText: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  iconTextContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  eventText: {
    fontSize: 16,
    textAlignVertical: "center",
  },
  upcomingSpace: {
    marginBottom: 10,
  }
});
