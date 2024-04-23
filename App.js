import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import Home from "./screens/Home";
import Calendar from "./screens/Calendar";
import Weather from "./screens/Weather";
import Settings from "./screens/Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function GetEvents() {
  try {
    const eventsData = await AsyncStorage.getItem("events");
    if (eventsData !== null) {
      return eventsData;
    }
  } catch (e) {
    console.error(`Error getting events: ${e}`);
  }

  return [];
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [events, setEvents] = useState(null);

  if (events === null) {
    GetEvents().then((eventsData) => {
      console.log("Loaded events from storage")
      setEvents(eventsData);
    });
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" children={() => <Home events={events} />} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false,
        }} />
        <Tab.Screen name="Calendar" component={Calendar} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
          headerShown: false,
        }} />
        <Tab.Screen name="Weather" component={Weather} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="weather-cloudy" color={color} size={size} />
          ),
          headerShown: false,
        }} />
        <Tab.Screen name="Settings" children={() => <Settings setEvents={setEvents} />} options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" color={color} size={size} />
          ),
          headerShown: false,
        }} />
      </Tab.Navigator>
    </NavigationContainer >
  );
}
