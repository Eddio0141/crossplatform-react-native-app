import { StyleSheet, Text, View } from "react-native";
import HLine from "../components/HLine";

function SummaryBar(props) {
  // TODO: probably has to be processed from raw data, we'll see
  const { calories, exercise } = props;

  return (
    <View style={styles.summaryBar}>
      <Text style={styles.summaryText}>🔥 {calories} calories burnt</Text>
      <Text style={styles.summaryText}>🕖 {exercise} mins of exercise</Text>
    </View>
  );
}

function Upcoming() {
  const NoEvents = () => {
    return (
      <View style={{ marginTop: 25, marginBottom: 25 }}>
        <Text style={{ textAlign: "center" }}>No more events for today</Text>
      </View>
    )
  };

  // TODO: check events
  const Events = () => {
    return (
      <View>
        <NoEvents />
      </View >
    )
  };

  return (
    <View>
      <Text style={styles.bigText}>Upcoming</Text>
      <Events />
    </View>
  );
}

function CurrentEvent() {
  const NoEvents = () => {
    return (
      <View style={{ marginTop: 25, marginBottom: 25 }}>
        <Text style={{ textAlign: "center" }}>Nothing going on!</Text>
      </View>
    )
  };

  // TODO: check events
  const Events = () => {
    return (
      <View>
        <NoEvents />
      </View >
    )
  };

  return (
    <View>
      <Text style={styles.bigText}>Current Event</Text>
      <Events />
    </View>
  );
}

export default function Home() {
  // TODO: calories, exercise
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
  }
});
