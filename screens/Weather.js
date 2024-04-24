import { View, Text, Image } from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";

export default function Weather({ events }) {
  const [cantGetWeather, setCantGetWeather] = useState(false);
  const [mainIcon, setMainIcon] = useState(undefined);
  const [mainText, setMainText] = useState(undefined);
  const [mainSubText, setMainSubText] = useState(undefined);
  const [mainSubText2, setMainSubText2] = useState(undefined);

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

      // https://openweathermap.org/api/hourly-forecast
      // this can be used to obtain current weather data
      const apiKey = "54a469c2cfe079178a807216b5b166ca";
      // TODO: customise temp metric
      const url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${latitude}&lon=${longitude}&appid=${apiKey}&cnt=24&units=metric`;

      fetch(url).then((response) => response.json()).then((data) => {
        const mainData = data.list[0];
        const mainDesc = mainData.weather[0].description;
        const mainTemp = Math.round(mainData.main.temp);
        const mainTempFeels = Math.round(mainData.main.feels_like);

        setMainText(`${mainDesc} (${mainTemp}°C)`);
        setMainIcon(mainData.weather[0].icon);
        // TODO: metric customisation
        setMainSubText(`Feels like: ${mainTempFeels}°C`);
        setMainSubText2(`Wind speed: ${mainData.wind.speed} m/s`);
      });
    };

    weatherUpdate();

    const id = setInterval(weatherUpdate, 60000 * 2);

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

  const size = 80;

  return (
    <View style={{
      flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "flex-start"
    }}>
      <View style={{ flex: 0.1 }} />
      <View style={{ backgroundColor: "#c6c6c6", borderRadius: 30, width: size + 2, height: size + 2 }}>
        <Image source={{ uri: `https://openweathermap.org/img/wn/${mainIcon}@2x.png` }} style={{ width: size, height: size }} />
      </View>
      <Text style={{ marginTop: 15, fontSize: 25, fontWeight: "bold" }}>{mainText}</Text>
      <Text style={{ marginTop: 10, fontSize: 15 }}>{mainSubText}</Text>
      <Text style={{ marginTop: 10, fontSize: 15 }}>{mainSubText2}</Text>
    </View>
  )
}
