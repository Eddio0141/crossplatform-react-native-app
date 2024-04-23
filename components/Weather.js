import { useState, useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View, Image } from "react-native";

function FetchWeather(event, setWeatherText, setWeatherIcon) {
  if (event === undefined) return;

  // NOTE: this only gets the current weather, and i'm not paying a subscription to get future data for this
  // https://openweathermap.org/current
  const apiKey = "54a469c2cfe079178a807216b5b166ca";
  // TODO: customise temp metric
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${event.lat}&lon=${event.lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json()).then((data) => {
      if (data.weather === undefined) return;

      const desc = data.weather[0].description;
      // temp is rounded to nearest whole number
      const temp = Math.round(data.main.temp);
      const icon = data.weather[0].icon;

      setWeatherText(`${desc} (${temp}°C)`);
      setWeatherIcon(icon);
    });
}

// renders the weather component
export default function Weather({ event }) {
  const [weatherText, setWeatherText] = useState(undefined);
  const [weatherIcon, setWeatherIcon] = useState(undefined);

  if (weatherText === undefined && event !== undefined) {
    FetchWeather(event, setWeatherText, setWeatherIcon);
  }

  useEffect(() => {
    const id = setInterval(() => {
      FetchWeather(event, setWeatherText, setWeatherIcon);
    }, 60000);

    return () => clearInterval(id);
  });

  const WeatherIcon = () => {
    const size = 48;
    if (weatherIcon === undefined) {
      return (
        <Feather name="cloud" size={size} color="black" />
      );
    } else {
      return (
        <Image source={{ uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png` }} style={{ width: size, height: size }} />
      )
    }
  };

  if (weatherText === undefined) {
    return (
      <View style={styles.iconTextContainer}>
        <Feather name="cloud" size={24} color="black" />
        <Text style={{ ...styles.eventText, marginLeft: 5 }}>Unknown</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.iconTextContainer}>
        <WeatherIcon />
        <Text style={{ ...styles.eventText, marginLeft: 5 }}>{weatherText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconTextContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  eventText: {
    fontSize: 16,
    textAlignVertical: "center",
  },
});
