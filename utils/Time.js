export default function FormatTime(date) {
  // formats to H:MM AM/PM
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" }) + " " + ampm;
}
