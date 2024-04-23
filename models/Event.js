export default class Event {
  // (day: number, timeStart: Date, duration: number (minutes), activity: string, lat: number, lon: number)
  constructor(timeStart, duration, activity, lat, lon) {
    this.timeStart = timeStart;
    this.timeEnd = new Date(timeStart.getTime() + duration * 60000);
    this.activity = activity;
    this.lat = lat;
    this.lon = lon;
  }
}
