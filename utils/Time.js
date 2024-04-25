export default function FormatTime(date) {
  // formats to H:MM AM/PM
  const ampm = date.hour >= 12 ? "PM" : "AM";
  return `${date.hour % 12}:${date.minute.toString().padStart(2, "0")} ${ampm}`;
}
