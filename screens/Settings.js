import { View, StyleSheet, Text, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import { Event, EventTime } from "../models/Event";
import { FontAwesome6 } from '@expo/vector-icons';
import SharedStyle from "../Style";
import { SharedContext } from "../SharedContext";
import { useContext, useState, useEffect } from "react";
import { SaveWeight, SaveHeight } from "../store/PersonalSettings";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { CentimeterToFeet, KgToPound } from "../consts/MetricConversion";

function ManagePersonalSettings() {
  const { weightKg, setWeightKg, heightCm, setHeightCm, setHeightMetric, setWeightMetric, heightMetric, weightMetric } = useContext(SharedContext);

  const [weightKgText, setWeightKgText] = useState("0");
  const [heightCmText, setHeightCmText] = useState("0");

  useEffect(() => {
    // kg wouldn't have decimal places
    const fixedLen = weightMetric === "kg" ? 0 : 1;
    setWeightKgText(weightKg.toFixed(fixedLen));
  }, [weightKg, weightMetric]);

  useEffect(() => {
    const fixedLen = heightMetric === "cm" ? 0 : 2;
    setHeightCmText(heightCm.toFixed(fixedLen));
  }, [heightCm, heightMetric]);

  return (
    <View>
      <RNPickerSelect
        onValueChange={(value) => {
          if (value === weightMetric) return;

          console.log(`changing weight metric from ${weightMetric} to ${value}`);
          if (value === "kg") {
            setWeightKg(weightKg / KgToPound);
          } else {
            setWeightKg(weightKg * KgToPound);
          }

          setWeightMetric(value);
        }}
        placeholder={{ label: "Weight metric", value: null }}
        items={[
          { label: "kg", value: "kg" },
          { label: "pound", value: "pound" },
        ]}
      />
      <RNPickerSelect
        onValueChange={(value) => {
          if (value === heightMetric) return;

          // change metric
          console.log(`changing height metric from ${heightMetric} to ${value}`);
          if (value === "cm") {
            setHeightCm(heightCm / CentimeterToFeet);
          } else {
            setHeightCm(heightCm * CentimeterToFeet);
          }
          setHeightMetric(value);
        }}
        placeholder={{ label: "Height metric", value: null }}
        items={[
          { label: "cm", value: "cm" },
          { label: "feet", value: "ft" },
        ]}
      />
      <View style={styles.weightHeightContainer}>
        <Text style={{ ...styles.weightHeightFont, marginRight: 5, flex: 1 }}>Weight</Text>
        <TextInput
          style={{ ...SharedStyle.textInput, ...styles.weightHeightFont, marginRight: 5 }}
          keyboardType="numeric"
          value={weightKgText}
          onChangeText={(text) => setWeightKgText(text)}
          onEndEditing={() => {
            if (weightKgText === "") {
              setWeightKgText(weightKg.toString());
            }
            const num = Math.abs(parseFloat(weightKgText));
            if (isNaN(num)) return;
            setWeightKg(num);
            SaveWeight(num);
          }} />
        <Text style={styles.weightHeightFont}>{weightMetric}</Text>
      </View>
      <View style={styles.weightHeightContainer}>
        <Text style={{ ...styles.weightHeightFont, marginRight: 5, flex: 1 }}>Height</Text>
        <TextInput
          style={{ ...SharedStyle.textInput, ...styles.weightHeightFont, marginRight: 5 }}
          keyboardType="numeric"
          value={heightCmText}
          onChangeText={(text) => setHeightCmText(text)}
          onEndEditing={() => {
            if (heightCmText === "") {
              setHeightCmText(heightCm.toString());
            }
            const num = Math.abs(parseFloat(heightCmText));
            if (isNaN(num)) return;
            setHeightCm(num);
            SaveHeight(num);
          }} />
        <Text style={styles.weightHeightFont}>{heightMetric}</Text>
      </View>
    </View>
  );
}

export default function Settings({ navigation }) {
  return (
    <View style={SharedStyle.container}>
      <View style={{ flex: 0.1 }} />
      <TouchableOpacity style={{ ...SharedStyle.shadowButton, ...styles.button }} onPress={() => navigation.navigate("ManageActivities")}>
        <FontAwesome6 name="person-running" size={30} color="black" />
        <Text style={styles.buttonText}>Manage Activities</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ ...SharedStyle.shadowButton, ...styles.button }} onPress={() => navigation.navigate("ManagePersonalSettings")}>
        <FontAwesome6 name="user" size={30} color="black" />
        <Text style={styles.buttonText}>Personal settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ ...SharedStyle.shadowButton, ...styles.button }}
        onPress={() => {
          Alert.alert(
            "Alert",
            "This will delete all data. Are you sure you want to continue?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Confirm", onPress: () => {
                  (async () => {
                    await AsyncStorage.clear();
                    await Updates.reloadAsync();
                  })();
                }
              }
            ]
          )
        }}>
        <FontAwesome6 name="trash-alt" size={30} color="red" />
        <Text style={{ ...styles.buttonText, color: "red" }}>Delete data</Text>
      </TouchableOpacity>
    </View >
  );
}

export { ManagePersonalSettings };

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    marginBottom: 15,
    width: "100%",
  },
  buttonText: {
    fontSize: 20,
    margin: 20,
  },
  weightHeightContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 5,
    marginBottom: 5,
    width: "90%",
  },
  weightHeightFont: {
    fontSize: 30,
  },
});
