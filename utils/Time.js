function FormatTime(date) {
  // formats to H:MM AM/PM
  const ampm = date.hour >= 12 ? "PM" : "AM";
  return `${date.hour % 12}:${date.minute.toString().padStart(2, "0")} ${ampm}`;
}

function DateEqualsWithoutTime(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

export { FormatTime, DateEqualsWithoutTime };
