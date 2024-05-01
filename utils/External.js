import { Linking } from "react-native";

function OpenMaps(lat, lon) {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  Linking.openURL(url).catch(err => console.error("An error occurred", err));
}

export { OpenMaps };
