import uuid from 'react-native-uuid';

class Event {
  // (day: number, timeStart: EventTime, duration: number (minutes), activity: string, lat: number, lon: number)
  constructor(timeStart, duration, activity, lat, lon) {
    this.timeStart = timeStart;
    this.timeEnd = timeStart.addMinutes(duration < 0 ? 0 : duration);
    this.activity = activity;
    this.lat = lat;
    this.lon = lon;
    this.uuid = uuid.v4();
  }

  equals(other) {
    return this.uuid === other.uuid;
  }
}

// made only for storing event time, Date isn't required
class EventTime {
  // (day: number, hour: number, minute: number)
  // day is 0 ~ 6, where 0 is Sunday
  constructor(day, hour, minute) {
    this.day = day;
    this.hour = hour;
    this.minute = minute;
  }

  addMinutes(minutes) {
    const newTime = new EventTime(this.day, this.hour, this.minute);
    newTime.minute += minutes;
    if (newTime.minute >= 60) {
      newTime.minute -= 60;
      newTime.hour++;
    }
    return newTime;
  }

  timeLessThanDate(other) {
    if (this.hour < other.getHours()) return true;
    if (this.hour > other.getHours()) return false;
    if (this.minute < other.getMinutes()) return true;
    return false;
  }

  timeMoreThanDate(other) {
    if (this.hour > other.getHours()) return true;
    if (this.hour < other.getHours()) return false;
    if (this.minute > other.getMinutes()) return true;
    return false;
  }

  timeEqualDate(other) {
    return this.hour === other.getHours() && this.minute === other.getMinutes();
  }

  timeMoreThanOrEqualDate(other) {
    return this.timeMoreThanDate(other) || this.timeEqualDate(other);
  }
}

export { EventTime, Event };
