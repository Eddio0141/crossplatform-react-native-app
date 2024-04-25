import { View, Text, ScrollView } from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import { WeatherIcon } from "../components/Weather";
import { firstCharToUpper } from "../utils/String";
import { FormatTime } from "../utils/Time";
import SharedStyle from "../Style";

export default function Weather({ events }) {
  const [cantGetWeather, setCantGetWeather] = useState(false);
  const [mainIcon, setMainIcon] = useState(undefined);
  const [mainText, setMainText] = useState(undefined);
  const [mainSubText, setMainSubText] = useState(undefined);
  const [mainSubText2, setMainSubText2] = useState(undefined);

  const [todayEvents, setTodayEvents] = useState([]);

  useEffect(() => {
    const weatherUpdate = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.error("Location permission not granted");
        setCantGetWeather(true);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = location.coords;

      console.log(`Fetching weather data, lat: ${latitude}, lon: ${longitude}`);

      const currentHours = new Date().getHours();
      const hoursTillMidnight = 24 - currentHours;

      // https://openweathermap.org/api/hourly-forecast
      // this can be used to obtain current weather data
      const apiKey = "54a469c2cfe079178a807216b5b166ca";
      // TODO: customise temp metric
      const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${latitude}&lon=${longitude}&appid=${apiKey}&cnt=${hoursTillMidnight}&units=metric`;

      fetch(url).then((response) => response.json()).then((data) => {
        const mainData = data.list[0];
        const mainDesc = mainData.weather[0].description;
        const mainTemp = Math.round(mainData.main.temp);
        const mainTempFeels = Math.round(mainData.main.feels_like);

        setMainText(`${firstCharToUpper(mainDesc)} (${mainTemp}°C)`);
        setMainIcon(mainData.weather[0].icon);
        // TODO: metric customisation
        setMainSubText(`Feels like: ${mainTempFeels}°C`);
        setMainSubText2(`Wind speed: ${mainData.wind.speed} m/s`);

        if (events === undefined) return;

        const today = new Date();
        const todayEvents = events.filter((event) => {
          return event.timeStart.day === today.getDay() && event.timeStart.timeMoreThanOrEqualDate(today);
        }).map((event) => {
          const weatherData = data.list[event.timeStart.hour - currentHours];

          return {
            hour: FormatTime(event.timeStart),
            icon: weatherData.weather[0].icon,
            desc: event.activity,
            desc2: `${firstCharToUpper(weatherData.weather[0].description)} (${Math.round(weatherData.main.temp)}°C)`,
            desc3: `Wind speed: ${weatherData.wind.speed} m/s`
          };
        });

        // TODO: add event count

        setTodayEvents(todayEvents);
      });
    };

    weatherUpdate();

    const id = setInterval(() => {
      if ((new Date()).getSeconds() === 0) {
        weatherUpdate();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [events]);

  if (cantGetWeather) {
    console.error("Unable to get weather data");

    return (
      <View>
        <Text>Unable to get weather data</Text>
      </View>
    )
  }

  const sizeMain = 80;
  const sizeEvent = 40;

  // TODO: main icon needs space above i think
  return (
    <View style={SharedStyle.container}>
      <View style={{ height: "5%" }} />
      <WeatherIcon icon={mainIcon} viewStyle={{ width: sizeMain + 2, height: sizeMain + 2 }} size={sizeMain} />
      <Text style={{ marginTop: 15, fontSize: 25, fontWeight: "bold" }}>{mainText}</Text>
      <Text style={{ marginTop: 10, fontSize: 15 }}>{mainSubText}</Text>
      <Text style={{ marginTop: 10, fontSize: 15 }}>{mainSubText2}</Text>
      <ScrollView style={{ marginTop: 30, width: "100%" }}>
        {
          todayEvents.map((event, index) => (
            <View key={index} style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ fontSize: 25, marginRight: 15 }}>{event.hour}</Text>
              <WeatherIcon icon={event.icon} size={sizeEvent} viewStyle={{ width: sizeEvent, height: sizeEvent, marginRight: 15 }} />
              <View>
                <Text style={{ fontSize: 18 }}>{event.desc}</Text>
                <Text>{event.desc2}</Text>
                <Text>{event.desc3}</Text>
              </View>
            </View>
          ))
        }
      </ScrollView>
    </View >
  )
}
