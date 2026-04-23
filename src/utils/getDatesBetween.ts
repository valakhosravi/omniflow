import addDays from "./addDay";

export default function getDatesBetween(fromDate: string, toDate: string) {
  const dates = [];
  let current = fromDate;

  while (new Date(current) <= new Date(toDate)) {
    dates.push(current);
    current = addDays(current, 1);
  }
  return dates;
}
