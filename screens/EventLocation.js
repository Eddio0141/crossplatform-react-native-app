import { View, Text, Button } from "react-native";
import SharedStyle from "../Style";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import { AddActivityContext, SharedContext } from "../SharedContext";
import { Event } from "../models/Event";
import { ToStorage } from "../utils/Storage";
import { EventsKey } from "../consts/Storage";

export default function EventLocation({ navigation }) {
  const { eventSetup } = useContext(AddActivityContext);
  const { events, setEvents } = useContext(SharedContext);

  const [marker, setMarker] = useState(
    eventSetup.lat === undefined ?
      null :
      { latitude: eventSetup.lat, longitude: eventSetup.lon }
  );
  const [initialLat, setInitialLat] = useState(undefined);
  const [initialLon, setInitialLon] = useState(undefined);

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = location.coords;

      console.log(`Initial location: lat: ${latitude}, lon: ${longitude}`);

      setInitialLat(latitude);
      setInitialLon(longitude);
    })();
  });

  if (initialLat === undefined || initialLon === undefined) {
    return (
      <View style={{ ...SharedStyle.container, justifyContent: "center" }}>
        <Text style={{ fontSize: 25 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={SharedStyle.container}>
      <Text style={{ fontSize: 22, marginVertical: 10 }}>
        Tap to place a pin!
      </Text>
      <MapView
        initialRegion={{
          latitude: initialLat,
          longitude: initialLon,
          latitudeDelta: 0.015,
          longitudeDelta: 0.007,
        }}
        style={{ width: "100%", height: "80%", marginBottom: "5%" }}
        onPress={(e) => {
          if (e.nativeEvent.action === "marker-press") return;

          const { latitude, longitude } = e.nativeEvent.coordinate;
          setMarker({ latitude, longitude });
        }}
      >
        <Marker coordinate={{ latitude: initialLat, longitude: initialLon }} pinColor="orange" />
        {
          marker === null ? null : (
            <Marker coordinate={marker} pinColor="red" />
          )
        }
      </MapView>
      <Button title="Done" onPress={() => {
        if (marker === null) return;
        const { latitude, longitude } = marker;

        console.log(`Selected location: lat: ${latitude}, lon: ${longitude}`);

        // construct the full event object finally
        const event = new Event(eventSetup.timeStart, eventSetup.duration, eventSetup.remindMinutes, eventSetup.activity, latitude, longitude);

        // are we updating an existing event?
        if (eventSetup.uuid === undefined) {
          // no
          const foundIndex = events.findIndex((e) => {
            if (e.timeStart.day > event.timeStart.day) return true;
            if (e.timeStart.day < event.timeStart.day) return false;
            if (e.timeStart.hour > event.timeStart.hour) return true;
            if (e.timeStart.hour < event.timeStart.hour) return false;
            return e.timeStart.minute > event.timeStart.minute;
          });

          const eventsLen = events?.length ?? 0;
          const insertIndex = foundIndex < 0 ? eventsLen : foundIndex;

          console.log(`Inserting at index ${insertIndex}`);

          setEvents([...events.slice(0, insertIndex), event, ...events.slice(insertIndex)]);
        } else {
          const editIndex = events.findIndex((e) => e.uuid === eventSetup.uuid);

          if (editIndex < 0) {
            console.error("Could not find event to edit!");
            navigation.navigate(eventSetup.navigationStart);
            return;
          }

          setEvents([...events.slice(0, editIndex), event, ...events.slice(editIndex + 1)]);
        }

        ToStorage(EventsKey, events);

        navigation.navigate(eventSetup.navigationStart);
      }} />
    </View>
  );
}
