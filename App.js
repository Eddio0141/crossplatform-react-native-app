import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import Home from "./screens/Home";
import CalendarView, { CalendarFocus } from "./screens/Calendar";
import Weather from "./screens/Weather";
import Settings, { ManagePersonalSettings } from "./screens/Settings";
import Reminder from "./screens/Reminder";
import Activity from "./screens/Activity";
import { SharedContext, AddActivityContext } from "./SharedContext";
import { FromStorage } from "./utils/Storage";
import { UpdateTodayEvents, LoadEventsFromStorage } from "./store/TodayEvents";
import { FilterIndex } from "./utils/Array";
import * as Notifications from "expo-notifications";
import {
  CurrentEventKey, WelcomedKey, EventsKey,
  ExerciseTodayKey, CaloriesTodayKey, CalendarCaloriesKey,
  CalendarEventsKey, StepsTodayKey
} from "./consts/Storage";
import { CopyEventTime } from "./models/Event";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ManageActivities from "./screens/ManageActivities";
import { LoadWeight, LoadHeight, LoadHeightMetric, LoadWeightMetric } from "./store/PersonalSettings";
import Welcome from "./screens/Welcome";
import GetStarted from "./screens/GetStarted";
import GetStarted2 from "./screens/GetStarted2";
import { View } from "react-native";
import { ToStorage } from "./utils/Storage";
import EventSetup from "./screens/EventSetup";
import EventTime from "./screens/EventTime";
import EventLocation from "./screens/EventLocation";
import { AddItemToCalendarStorage, AppendItemToCalendarStorage } from "./store/Calendar";
import { CalcBurntCaloriesFromActivity } from "./utils/ExerciseCalc";
import { WeightToKg } from "./utils/ExerciseCalc";

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
      const updatedEvents = { ...todayEvents, events: FilterIndex(todayEvents.events, 0) };
      setTodayEvents(updatedEvents);
    }
  }, 1000);

  return () => clearInterval(id);
}

export default function App() {
  const [events, setEvents] = useState(undefined);
  const [todayEvents, setTodayEvents] = useState(undefined);
  const [currentEvent, setCurrentEvent] = useState(undefined);
  const [reminderShow, setReminderShow] = useState(false);
  const [settingUp, setSettingUp] = useState(false);

  const [weightKg, setWeightKg] = useState(undefined);
  const [heightCm, setHeightCm] = useState(undefined);
  const [weightMetric, setWeightMetric] = useState(undefined);
  const [heightMetric, setHeightMetric] = useState(undefined);

  const [exercise, setExercise] = useState(undefined);
  const [calories, setCalories] = useState(undefined);
  const [steps, setSteps] = useState(undefined);

  const [eventSetup, setEventSetup] = useState({});

  // only read from storage when nessesary
  if (calories === undefined) {
    AsyncStorage.getItem(CaloriesTodayKey).then((data) => {
      if (data === null) {
        setCalories(0);
      } else {
        setCalories(JSON.parse(data));
      }
    }).catch((e) => {
      console.error(`Error getting calories: ${e}`);
      setCalories(0);
    });

    AsyncStorage.getItem(ExerciseTodayKey).then((data) => {
      if (data === null) {
        setExercise(0);
      } else {
        setExercise(JSON.parse(data));
      }
    }).catch((e) => {
      console.error(`Error getting exercise: ${e}`);
      setExercise(0);
    });

    AsyncStorage.getItem(StepsTodayKey).then((data) => {
      if (data === null) {
        setSteps(0);
      } else {
        setSteps(JSON.parse(data));
      }
    }).catch((e) => {
      console.error(`Error getting steps: ${e}`);
      setSteps(0);
    });
  }

  if (weightKg === undefined) {
    LoadWeight(setWeightKg);
    LoadWeightMetric(setWeightMetric);
  }

  if (heightCm === undefined) {
    LoadHeight(setHeightCm);
    LoadHeightMetric(setHeightMetric);
  }

  if (events === undefined) {
    FromStorage(EventsKey, []).then((eventsDataRaw) => {
      const eventsData = eventsDataRaw.map((event) => {
        const { timeStart, timeEnd } = event;
        return {
          ...event,
          timeStart: CopyEventTime(timeStart),
          timeEnd: CopyEventTime(timeEnd),
        };
      });

      console.log("Loaded events from storage");
      setEvents(eventsData);
    });
  }

  if (todayEvents === undefined) {
    LoadEventsFromStorage(todayEvents, setTodayEvents, events);
  }

  if (currentEvent === undefined) {
    FromStorage(CurrentEventKey).then((currentEventDataRaw) => {
      console.log("Loaded current event from storage");
      // validate
      if (currentEventDataRaw !== null) {
        const today = new Date();
        const { timeStart, timeEnd } = currentEventDataRaw;
        const currentEventData = {
          ...currentEventDataRaw,
          timeStart: CopyEventTime(timeStart),
          timeEnd: CopyEventTime(timeEnd),
        };
        if (currentEventData.timeEnd.day === today.getDay() &&
          currentEventData.timeEnd.timeMoreThanDate(today)
        ) {
          setCurrentEvent(currentEventData);
          return;
        }
      }
      setCurrentEvent(null);
    });
  }

  // check if current event has ended
  useEffect(() => {
    if (currentEvent === null || currentEvent === undefined) return;

    const id = setInterval(() => {
      const today = new Date();
      if (currentEvent.timeEnd.day !== today.getDay() ||
        currentEvent.timeEnd.timeLessThanOrEqualDate(today)
      ) {
        // add minutes of exercise done
        const totalExercise = exercise + currentEvent.duration;
        setExercise(totalExercise);

        // calculate calories burnt
        let caloriesBurnt = 0;
        const weightKgActual = WeightToKg(weightKg, weightMetric);

        caloriesBurnt = CalcBurntCaloriesFromActivity(currentEvent.activity, weightKgActual, currentEvent.duration);
        const totalCalories = calories + caloriesBurnt;
        setCalories(totalCalories);
        ToStorage(CaloriesTodayKey, totalCalories);
        ToStorage(ExerciseTodayKey, totalExercise);

        // update calendar entry
        AddItemToCalendarStorage(today, CalendarCaloriesKey, caloriesBurnt);
        AppendItemToCalendarStorage(today, CalendarEventsKey, currentEvent);

        setCurrentEvent(null);
        // remove current event from storage
        AsyncStorage.removeItem(CurrentEventKey).then();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [currentEvent]);

  // handle resetting today events at midnight, as well as updating today events
  useEffect(() => {
    UpdateTodayEvents(todayEvents, setTodayEvents, events);

    return EventsResetMidnight(todayEvents, setTodayEvents, events);
  }, [events]);

  const AppRoot = ({ navigation }) => {
    // have we welcomed the user?
    if (!settingUp) {
      FromStorage(WelcomedKey, false).then((welcomed) => {
        if (!welcomed) {
          navigation.navigate("Welcome");
          setSettingUp(true);
        }
      });
    }

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
        <Tab.Screen name="Calendar" component={CalendarView} options={{
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
          component={Settings}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="settings" color={color} size={size} />
            ),
            headerShown: true,
            headerTitleAlign: "center",
          }} />
      </Tab.Navigator>
    );
  };

  const ContainedPersonalSettings = () => (
    <View style={{ ...SharedStyle.container, justifyContent: "center" }}>
      <ManagePersonalSettings />
    </View>
  );

  return (
    <AddActivityContext.Provider value={{
      eventSetup,
      setEventSetup
    }}>
      <SharedContext.Provider value={{
        events,
        setEvents,
        currentEvent,
        setCurrentEvent,
        todayEvents,
        setTodayEvents,
        setReminderShow,
        weightKg,
        setWeightKg,
        heightCm,
        setHeightCm,
        weightMetric,
        setWeightMetric,
        heightMetric,
        setHeightMetric,
        exercise,
        calories,
        steps,
        setSteps,
        setCalories,
      }}>
        <NavigationContainer>
          <RootStack.Navigator>
            <RootStack.Group>
              <RootStack.Screen name="Root" component={AppRoot} options={{ headerShown: false }} />
            </RootStack.Group>
            <RootStack.Group screenOptions={{ presentation: "modal" }}>
              <RootStack.Screen name="Reminder" component={Reminder} />
              <RootStack.Screen name="ManageActivities" component={ManageActivities} options={{ headerTitle: "Manage Activities" }} />
              <RootStack.Screen name="ManagePersonalSettings" component={ContainedPersonalSettings} options={{ headerTitle: "Manage Personal Settings" }} />
              <RootStack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
              <RootStack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} />
              <RootStack.Screen name="GetStarted2" component={GetStarted2} options={{ headerShown: false }} />
              <RootStack.Screen name="EventSetup" component={EventSetup} options={{ headerTitle: "Add activity" }} />
              <RootStack.Screen name="EventTime" component={EventTime} options={{ headerTitle: "Activity time" }} />
              <RootStack.Screen name="EventLocation" component={EventLocation} options={{ headerTitle: "Location" }} />
              <RootStack.Screen name="CalendarFocus" component={CalendarFocus} options={{ headerTitle: "" }} />
            </RootStack.Group>
          </RootStack.Navigator>
        </NavigationContainer >
      </SharedContext.Provider >
    </AddActivityContext.Provider>
  );
}
