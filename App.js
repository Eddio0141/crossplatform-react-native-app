import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Home from "./screens/Home";
import Feather from "@expo/vector-icons/Feather";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false,
        }} />
        <Tab.Screen name="Calendar" component={Home} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
          headerShown: false,
        }} />
        <Tab.Screen name="Weather" component={Home} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="weather-cloudy" color={color} size={size} />
          ),
          headerShown: false,
        }} />
        <Tab.Screen name="Settings" component={Home} options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" color={color} size={size} />
          ),
          headerShown: false,
        }} />
      </Tab.Navigator>
    </NavigationContainer >
  );
}
