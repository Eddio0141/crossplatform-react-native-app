import { Text, View, TouchableOpacity, Alert } from "react-native";
import SharedStyle from "../Style";
import { ManagePersonalSettings } from "../screens/Settings";
import { WelcomedKey } from "../consts/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { SharedContext } from "../SharedContext";

export default function GetStarted2({ navigation }) {
  const { weightKg, heightCm } = useContext(SharedContext);

  return (
    <View style={{ ...SharedStyle.container, justifyContent: "center" }}>
      <ManagePersonalSettings />
      <View style={{ flex: 0.6 }} />
      <TouchableOpacity
        style={{ ...SharedStyle.shadowButton, borderWidth: 1, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 45 }}
        onPress={() => {
          if (weightKg === 0 || heightCm === 0) {
            Alert.alert("Error", "Please fill in your weight and height.");
            return;
          }

          (async () => {
            try {
              const jsonValue = JSON.stringify(true);
              await AsyncStorage.setItem(WelcomedKey, jsonValue);
            } catch (e) {
              console.error(`Error setting ${WelcomedKey}: ${e}`);
              return;
            }

            // make sure storage is processed before navigating to prevent welcome screen again
            navigation.navigate("Root");
          })();
        }}
      >
        <Text style={{ fontSize: 25 }}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}
