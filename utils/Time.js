function FormatTime(date) {
  // formats to H:MM AM/PM
  const ampm = date.hour >= 12 ? "PM" : "AM";
  const hour = date.hour === 12 ? 12 : date.hour % 12;
  return `${hour}:${date.minute.toString().padStart(2, "0")} ${ampm}`;
}

function DateEqualsWithoutTime(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

function DaysInMonth(date) {
  date.setDate(0);
  return date.getDate();
}

function FormatMinutes(minutes, shorthand = false) {
  const postfixS = minutes === 1 ? "" : "s";
  const postfix = shorthand ? "min" : "minute";
  return `${minutes} ${postfix}${postfixS}`
}

export { FormatTime, DateEqualsWithoutTime, DaysInMonth, FormatMinutes };
