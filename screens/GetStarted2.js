import { Text, View, TouchableOpacity } from "react-native";
import SharedStyle from "../Style";
import { ManagePersonalSettings } from "../screens/Settings";
import { WelcomedKey } from "../consts/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GetStarted2({ navigation }) {
  return (
    <View style={{ ...SharedStyle.container, justifyContent: "center" }}>
      <ManagePersonalSettings />
      <View style={{ flex: 0.6 }} />
      <TouchableOpacity
        style={{ ...SharedStyle.shadowButton, borderWidth: 1, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 45 }}
        onPress={() => {
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
