import { StyleSheet, Text, View } from "react-native";
import HLine from "../components/HLine"

function SummaryBar(props) {
  // TODO add fire emote at start of calories
  // TODO add clock emote at start of exercise
  const { calories, exercise } = props;

  return (
    <View style={styles.summaryBar}>
      <Text style={styles.summaryText}>{calories} calories burnt</Text>
      <Text style={styles.summaryText}>{exercise} mins of exercise</Text>
    </View>
  )
}

function Upcoming() {
  return (
    <View>
      <Text style={{ fontSize: 30 }}>Upcoming</Text>
    </View>
  )
}

function CurrentEvent() {
  return (
    <View>
      <Text style={{ fontSize: 30 }}>Current Event</Text>
    </View>
  )
}

export default function Home() {
  // TODO calories, exercise
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.2 }} />
      <SummaryBar calories={0} exercise={0} />
      <Upcoming />
      <HLine />
      <CurrentEvent />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "column",
  },
  summaryBar: {
    flex: 0.5,
  },
  summaryText: {
    fontSize: 20,
  },
});
