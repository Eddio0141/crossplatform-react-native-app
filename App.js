import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import Home from "./screens/Home";
import Calendar from "./screens/Calendar";
import Weather from "./screens/Weather";
import Settings from "./screens/Settings";
import Reminder from "./screens/Reminder";
import Activity from "./screens/Activity";
import { SharedContext } from "./SharedContext";
import { FromStorage } from "./utils/Storage";
import { UpdateTodayEvents, LoadEventsFromStorage } from "./store/TodayEvents";
import { FilterIndex } from "./utils/Array";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function EventsResetMidnight(todayEvents, setTodayEvents, events) {
  UpdateTodayEvents(todayEvents, setTodayEvents, events);

  const id = setInterval(() => {
    if (todayEvents?.date === null || todayEvents?.date === undefined) return;
    const today = new Date();
    if (today.getHours() === 0 && today.getMinutes() === 0 && today.getSeconds() === 0) {
      UpdateTodayEvents(todayEvents, setTodayEvents, events);
    }
  }, 1000);

  return () => clearInterval(id);
}

function ReminderCheck(todayEvents, setTodayEvents, reminderShow, setReminderShow, navigation) {
  const id = setInterval(() => {
    if (reminderShow) return;
    const currentEvent = todayEvents.events[0];
    if (currentEvent === undefined) return;
    const today = new Date();
    const minutesLeft = (currentEvent.timeStart.hour - today.getHours()) * 60 + (currentEvent.timeStart.minute - today.getMinutes());
    const minutesTillEnd = minutesLeft + currentEvent.duration;
    if (minutesTillEnd > 0) {
      if (minutesLeft <= currentEvent.remindMinutes) {
        setReminderShow(true);
        navigation.navigate("Reminder");
      }
    } else {
      // event has ended
      setTodayEvents(FilterIndex(todayEvents, 0));
    }
  }, 1000);

  return () => clearInterval(id);
}

export default function App() {
  const [events, setEvents] = useState(undefined);
  const [todayEvents, setTodayEvents] = useState(undefined);
  const [currentEvent, setCurrentEvent] = useState(undefined);
  const [reminderShow, setReminderShow] = useState(false);

  if (events === undefined) {
    FromStorage("events", []).then((eventsData) => {
      console.log("Loaded events from storage");
      setEvents(eventsData);
    });
  }

  if (todayEvents === undefined) {
    LoadEventsFromStorage(todayEvents, setTodayEvents, events);
  }

  if (currentEvent === undefined) {
    FromStorage("current-event").then((currentEventData) => {
      console.log("Loaded current event from storage");
      // validate
      if (currentEventData !== null) {
        const today = new Date();
        if (currentEventData.timeStart.getDay() === today.getDay() && currentEventData.timeStart < today && currentEventData.timeEnd > today) {
          setCurrentEvent(currentEventData);
          return;
        }
      }
      setCurrentEvent(null);
    });
  }

  // handle resetting today events at midnight
  useEffect(() => EventsResetMidnight(todayEvents, setTodayEvents, events), [events]);

  const AppRoot = ({ navigation }) => {
    // handle reminder notifications
    useEffect(() => ReminderCheck(todayEvents, setTodayEvents, reminderShow, setReminderShow, navigation), [todayEvents]);

    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" children={() => <Home currentEvent={currentEvent} />} options={{
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
        <Tab.Screen name="Activity" component={Activity} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="run" color={color} size={size} />
          ),
          headerShown: false,
        }} />
        <Tab.Screen name="Weather" component={Weather} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="weather-cloudy" color={color} size={size} />
          ),
          headerShown: false,
        }} />
        <Tab.Screen name="Settings"
          children={(props) => <Settings {...props} events={events} setEvents={setEvents} setCurrentEvent={setCurrentEvent} />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="settings" color={color} size={size} />
            ),
            headerShown: false,
          }} />
      </Tab.Navigator>
    );
  };

  return (
    <SharedContext.Provider value={{ currentEvent, setCurrentEvent, todayEvents, setTodayEvents, setReminderShow }}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Group>
            <RootStack.Screen name="Root" component={AppRoot} options={{ headerShown: false }} />
          </RootStack.Group>
          <RootStack.Group screenOptions={{ presentation: "modal" }}>
            <RootStack.Screen name="Reminder" component={Reminder} />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer >
    </SharedContext.Provider >
  );
}
