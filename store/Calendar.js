import { CalendarKeyPrefix } from "../consts/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

function DataEntryKey(day) {
  return `${CalendarKeyPrefix}${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
}

// Moves item to calendar storage. Will update the value to be a sum if it already has an entry
function AddItemToCalendarStorage(day, key, item) {
  ItemToCalendarStorage(day, key, item, "add");
}

function AppendItemToCalendarStorage(day, key, item) {
  ItemToCalendarStorage(day, key, item, "append");
}

function ItemToCalendarStorage(day, key, item, op) {
  (async () => {
    const entryKey = DataEntryKey(day);
    console.log(`Adding item to calendar, key: ${entryKey}, entry: ${key}, item: ${item}`);
    let data;
    try {
      data = await AsyncStorage.getItem(entryKey);
    } catch (e) {
      console.error(`Error getting calendar data: ${e}`);
      return;
    }

    data = JSON.parse(data);
    if (data === null) {
      // just need to set the value
      console.log("No existing data");
      data = {};
      if (op === "append") {
        data[key] = [item];
      } else {
        data[key] = item;
      }
    } else {
      const existing = data[key];
      console.log(`Existing data: ${existing}`);

      if (existing === undefined) {
        data[key] = item;
      } else if (op === "add") {
        data[key] = existing + item;
      } else if (op === "append") {
        data[key] = existing.concat(item);
      } else {
        data[key] = item;
      }
    }

    try {
      await AsyncStorage.setItem(entryKey, JSON.stringify(data));
    } catch (e) {
      console.error(`Error setting calendar data: ${e}`);
    }

    console.log("Done");
  })();
}

export { AddItemToCalendarStorage, AppendItemToCalendarStorage };
