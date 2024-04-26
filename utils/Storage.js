import AsyncStorage from "@react-native-async-storage/async-storage";

async function FromStorage(item, fallbackValue = null) {
  try {
    const data = await AsyncStorage.getItem(item);
    if (data !== null) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error(`Error getting ${item}: ${e}`);
  }
  return fallbackValue;
}

function ToStorage(key, data) {
  (async () => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error(`Error setting ${key}: ${e}`);
    }
  })();
}

export { FromStorage, ToStorage };
