import { View, Text } from "react-native";
import { useContext, useState, useEffect } from "react";
import { SharedContext } from "../SharedContext";
import { Feather } from "@expo/vector-icons";
import SharedStyle from "../Style";
import { Weather } from "../components/Weather";
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function Activity() {
  const { currentEvent } = useContext(SharedContext);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds

  useEffect(() => {
    if (currentEvent === null) {
      setTimeLeft(0);
      return;
    }

    const id = setInterval(() => {
      const secondsLeft = currentEvent.timeEnd.secondsTillDate();
      setTimeLeft(Math.max(0, secondsLeft));
    }, 100);

    return () => clearInterval(id);
  }, [currentEvent]);

  if (currentEvent === null) {
    return <ActivityNone />;
  }

  return (
    <View style={SharedStyle.container}>
      <View style={{ flex: 0.1 }} />
      <Text style={{ fontSize: 35, flex: 0.2 }}>{currentEvent.activity}</Text>
      <Weather event={currentEvent} />
      <View style={{ flex: 0.2 }} />
      <Text style={{ fontSize: 35, flex: 0.3 }}>{Math.floor(timeLeft / 1000 / 60)}:{Math.floor(timeLeft / 1000 % 60).toString().padStart(2, '0')}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Feather name="map-pin" size={35} color="black" style={{ marginRight: 10 }} />
        <Text style={{ fontSize: 20 }}>Navigation</Text>
      </View>
    </View>
  );
}

function ActivityNone() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>No activity currently!</Text>
    </View>
  );
}
