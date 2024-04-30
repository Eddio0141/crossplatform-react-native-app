import { View, Text, Image, TouchableOpacity } from "react-native";
import SharedStyle from "../Style";
import { AddActivityContext } from "../SharedContext";
import { useContext } from "react";

const exercises = [
  { name: "Jogging", source: require("../assets/jogging.jpg") },
  { name: "Swimming", source: require("../assets/swimming.jpg") },
  { name: "Cycling", source: require("../assets/cycling.jpg") },
];

export default function EventSetup({ navigation }) {
  const { setEventSetup } = useContext(AddActivityContext);

  return (
    <View style={SharedStyle.container}>
      <Text style={{ fontSize: 40, marginBottom: 20 }}>Select Category</Text>
      <View style={{ alignItems: "flex-end" }}>
        {
          exercises.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => {
                setEventSetup({ activity: exercise.name });
                navigation.navigate("EventTime");
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 10 }}>{exercise.name}</Text>
              <Image source={exercise.source} style={{ width: 150, height: 150, marginBottom: 15 }} />
            </TouchableOpacity>
          ))
        }
      </View>
    </View>
  );
}
