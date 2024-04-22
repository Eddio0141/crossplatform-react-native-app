// all user registered exercises are converted to events
export default class Event {
  // TODO: map info
  // (day: number, timeStart: Date, duration: number (minutes), activity: string)
  constructor(timeStart, duration, activity) {
    this.timeStart = timeStart;
    this.timeEnd = new Date(timeStart.getTime() + duration * 60000);
    this.activity = activity;
  }
}
