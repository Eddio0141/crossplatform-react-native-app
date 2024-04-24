import { useState, useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View, Image } from "react-native";

function FetchWeather(event, setWeatherText, setWeatherIcon) {
  if (event === undefined) return;

  const today = new Date();
  const hoursFromNow = event.timeStart.getHours() - today.getHours() + 1;

  console.log(`Fetching weather data, lat: ${event.lat}, lon: ${event.lon}`);

  // https://openweathermap.org/api/hourly-forecast
  const apiKey = "54a469c2cfe079178a807216b5b166ca";
  // TODO: customise temp metric
  const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${event.lat}&lon=${event.lon}&appid=${apiKey}&cnt=${hoursFromNow}&units=metric`;

  fetch(url)
    .then((response) => response.json()).then((data) => {
      const weather = data.list[hoursFromNow - 1];

      const desc = weather.weather[0].description;
      // temp is rounded to nearest whole number
      const temp = Math.round(weather.main.temp);
      const icon = weather.weather[0].icon;

      setWeatherText(`${desc} (${temp}°C)`);
      setWeatherIcon(icon);
    });
}

// renders the weather component
export default function Weather({ event }) {
  const [weatherText, setWeatherText] = useState(undefined);
  const [weatherIcon, setWeatherIcon] = useState(undefined);

  // update often enough
  useEffect(() => {
    FetchWeather(event, setWeatherText, setWeatherIcon);
    const id = setInterval(FetchWeather, 60000 * 2, event, setWeatherText, setWeatherIcon);

    return () => clearInterval(id);
  }, [event]);

  const WeatherIcon = () => {
    const size = 48;
    if (weatherIcon === undefined) {
      return (
        <Feather name="cloud" size={size} color="black" />
      );
    } else {
      return (
        <View style={{ backgroundColor: "#c6c6c6", borderRadius: 30 }}>
          <Image source={{ uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png` }} style={{ width: size, height: size }} />
        </View>
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
