import { FromStorage, ToStorage } from "../utils/Storage";
import { DateEqualsWithoutTime } from "../utils/Time";

const TodayEventsKey = "today-events";

function UpdateTodayEvents(todayEvents, setTodayEvents, events) {
  if (events === undefined) return;
  const today = new Date();
  let filtered = events.filter((event) => event.timeStart.day === today.getDay() && event.timeStart.timeMoreThanOrEqualDate(today));
  let cancelled = [];
  if (todayEvents !== undefined) {
    // outright remove all cancelled events if day is different
    if (DateEqualsWithoutTime(today, todayEvents.date)) {
      cancelled = todayEvents.cancelled;
      filtered = filtered.filter((event) => cancelled.findIndex((cancelled) => cancelled.uuid === event.uuid) < 0);
    }
  }
  // TODO: test cancellation then modify events, and see if cancelled event comes up that has timeStart before current
  const newToday = { date: today, events: filtered, cancelled };
  setTodayEvents(newToday);
  TodayEventsToStorage(newToday);
  console.log(`Updated today events: ${filtered.length}`);
}

function TodayEventsToStorage(todayEvents) {
  ToStorage(TodayEventsKey, todayEvents);
}

function LoadEventsFromStorage(todayEvents, setTodayEvents, events) {
  FromStorage(TodayEventsKey).then((todayEventsData) => {
    const data = { ...todayEventsData, date: new Date(todayEventsData.date) };

    console.log(`Loaded today events from storage, count: ${todayEventsData}`);
    // make sure date is the same
    if (todayEventsData === null || !DateEqualsWithoutTime(data.date, new Date())) {
      // invalidate
      UpdateTodayEvents(todayEvents, setTodayEvents, events);
    } else {
      setTodayEvents(data);
    }
  });
}

export { UpdateTodayEvents, LoadEventsFromStorage };
