import { View, Text, TouchableOpacity } from "react-native";
import { useContext, useState, useEffect } from "react";
import { SharedContext } from "../SharedContext";
import { Feather } from "@expo/vector-icons";
import SharedStyle from "../Style";
import { Weather } from "../components/Weather";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { OpenMaps } from "../utils/External";

export default function Activity() {
  const { currentEvent } = useContext(SharedContext);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds

  // BUG: on midnight, date will reset and countdown resets
  useEffect(() => {
    if (currentEvent === null) {
      setTimeLeft(0);
      return;
    }

    // don't assume interval is accurate, because it isn't
    const id = setInterval(() => {
      const secondsLeft = currentEvent.timeEnd.secondsTillDate();
      setTimeLeft(Math.max(0, secondsLeft));
    }, 100);

    return () => clearInterval(id);
  }, [currentEvent]);

  if (currentEvent === null) {
    return <ActivityNone />;
  }

  const duration = currentEvent.duration * 60000;
  const timeLeftSeconds = timeLeft / 1000;

  // TODO: remove
  return (
    <View style={SharedStyle.container}>
      <View style={{ flex: 0.1 }} />
      <Text style={{ fontSize: 35, flex: 0.2 }}>{currentEvent.activity}</Text>
      <Weather event={currentEvent} />
      <View style={{ flex: 0.2 }} />
      <AnimatedCircularProgress
        size={180}
        width={20}
        backgroundWidth={10}
        fill={((duration - timeLeft) / duration) * 100}
        style={{ flex: 0.35 }}
        tintColor="#00e0ff"
        backgroundColor="grey"
        lineCap="round"
      >
        {
          () => (
            <Text style={{ fontSize: 30, flex: 0.3, color: timeLeft > duration ? "lightgrey" : "black" }}>
              {Math.floor(timeLeftSeconds / 60)}:{Math.floor(timeLeftSeconds % 60).toString().padStart(2, '0')}
            </Text>
          )
        }
      </AnimatedCircularProgress>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => OpenMaps(currentEvent.lat, currentEvent.lon)}
      >
        <Feather name="map-pin" size={35} color="black" style={{ marginRight: 10 }} />
        <Text style={{ fontSize: 20 }}>Navigation</Text>
      </TouchableOpacity>
    </View >
  );
}

function ActivityNone() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>No activity currently!</Text>
    </View>
  );
}
