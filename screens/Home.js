import { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HLine from "../components/HLine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@expo/vector-icons/Feather";
import { FormatTime } from "../utils/Time";
import { Weather } from "../components/Weather";
import SharedStyle from "../Style";
import { SharedContext } from "../SharedContext";
import { Pedometer } from "expo-sensors";
import { StepsTodayKey, CaloriesTodayKey } from "../consts/Storage";
import { CentimeterToFeet, KgToPound } from "../consts/MetricConversion";
import { ToStorage } from "../utils/Storage";
import { OpenMaps } from "../utils/External";
import { AddItemToCalendarStorage } from "../store/Calendar";

function SummaryBar() {
  const { weightMetric, heightMetric, weightKg, heightCm, exercise, calories, steps, setSteps, setCalories } = useContext(SharedContext);
  const [canUsePedometer, setCanUsePedometer] = useState(undefined);

  useEffect(() => {
    if (canUsePedometer !== undefined) return;

    (async () => {
      // only render steps if pedometer is available
      const available = await Pedometer.isAvailableAsync();
      if (!available) {
        setSteps(0);
        return;
      }

      try {
        const permStatus = await Pedometer.requestPermissionsAsync();
        if (!permStatus.granted) {
          setSteps(0);
          return;
        }
      } catch (e) {
        console.log(`Error requesting pedometer permissions: ${e}`);
      }

      setCanUsePedometer(false);
    })();
  });

  useEffect(() => {
    if (canUsePedometer === undefined || !canUsePedometer) return;
    console.log("Pedometer is available");

    const stepWatch = async () => {
      try {
        const stepsTodayData = await AsyncStorage.getItem(StepsTodayKey);
        if (stepsTodayData !== null) {
          setSteps(JSON.parse(stepsTodayData));
        } else {
          setSteps(0);
        }
      } catch (e) {
        console.error(`Error getting steps: ${e}`);
        setSteps(0);
      }

      console.log("Ready to watch steps");

      return Pedometer.watchStepCount((result) => {
        console.log(`Steps: ${result.steps}`);

        const total = steps + result.steps;
        setSteps(total);
        // to storage
        AsyncStorage.setItem(StepsTodayKey, total.toString()).then();

        // https://www.omnicalculator.com/sports/steps-to-calories
        // - MET values
        //   - slow (0.9m/s) = 2.8
        //   - normal (1.34m/s) = 3.5
        //   - fast (1.79m/s) = 5
        // - assuming normal pace
        const height = (heightMetric === "cm" ? heightCm : heightCm / CentimeterToFeet) / 100;
        const weight = weightMetric === "kg" ? weightKg : weightKg / KgToPound;
        const met = 3.5;

        const stride = height * 0.414;
        const time = result.steps * stride;

        const caloriesBurnt = time * met * 3.5 * weight / 12000;
        console.log(`Calories burnt: ${caloriesBurnt}`);
        const totalCalories = calories + caloriesBurnt;

        setCalories(totalCalories);
        ToStorage(CaloriesTodayKey, totalCalories);

        AddItemToCalendarStorage(new Date(), "calories", caloriesBurnt);
        AddItemToCalendarStorage(new Date(), "steps", result.steps);
      });
    };

    console.log("Starting step watch");
    const subscription = stepWatch();

    return () => subscription.then((e) => e.remove());
  }, [canUsePedometer]);

  return (
    <View style={styles.summaryBar}>
      <Text style={styles.summaryText}>🔥 {Math.round(calories)} calories burnt</Text>
      <Text style={styles.summaryText}>🕖 {exercise} mins of exercise</Text>
      {
        steps === undefined ? null : (<Text style={styles.summaryText}>🚶 {steps} steps</Text>)
      }
    </View>
  );
}

function Upcoming() {
  const { todayEvents } = useContext(SharedContext);

  // TODO: check events
  // TODO: clock react to time
  // BUG: fix this shit
  const Events = () => {
    if (todayEvents?.events !== undefined) {
      const upcoming = todayEvents.events[0];
      if (upcoming !== undefined) {
        return (
          <View style={{ alignItems: "center" }}>
            <View style={styles.iconTextContainer}>
              <Feather name="clock" size={40} color="black" style={{ alignSelf: "center" }} />
              <Text style={{ fontSize: 17, textAlignVertical: "center", marginLeft: 10 }}>
                {FormatTime(upcoming.timeStart)} ~ {FormatTime(upcoming.timeEnd)}
              </Text>
            </View>
            <Text style={{ ...styles.upcomingSpace, fontSize: 18 }}>
              {upcoming.activity}
            </Text>
            <Navigation style={styles.upcomingSpace} event={upcoming} />
            <Weather event={upcoming} />
          </View>
        )
      }
    }

    return (
      <View style={{ marginTop: 25, marginBottom: 25 }}>
        <Text style={{ textAlign: "center" }}>No more events for today</Text>
      </View>
    )
  };

  return (
    <View>
      <Text style={styles.bigText}>Upcoming</Text>
      <Events />
    </View>
  );
}

function CurrentEvent({ currentEvent }) {
  const NoEvents = () => {
    return (
      <View style={{ marginTop: 25, marginBottom: 25 }}>
        <Text style={{ textAlign: "center" }}>Nothing going on!</Text>
      </View>
    )
  };

  const Events = () => {
    if (currentEvent !== undefined && currentEvent !== null) {
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
              <Navigation event={currentEvent} />
              <Weather event={currentEvent} />
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

export default function Home({ currentEvent }) {
  return (
    <View style={{ ...SharedStyle.container, justifyContent: "flex-end" }}>
      <View style={{ flex: 0.2 }} />
      <SummaryBar />
      <Upcoming />
      <HLine />
      <CurrentEvent currentEvent={currentEvent} />
    </View >
  );
}

function Navigation({ style, event }) {
  return (
    <TouchableOpacity
      style={{ ...styles.iconTextContainer, ...style }}
      onPress={() => OpenMaps(event.lat, event.lon)}
    >
      <Feather name="map-pin" size={24} color="black" />
      <Text style={{ ...styles.eventText, marginLeft: 5 }}>Navigation</Text>
    </TouchableOpacity>
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
    textAlign: "center",
  },
  upcomingSpace: {
    marginBottom: 10,
  }
});
