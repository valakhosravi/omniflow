export function formatTodayAt(
  hour: number,
  minute: number = 0,
  dayOffset = 0,
  locale = "fa-IR",
  targetWeekday?: number // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
) {
  const date = new Date();

  if (targetWeekday !== undefined) {
    const todayWeekday = date.getDay();
    // Calculate days to add to reach the target weekday
    let offset = (targetWeekday - todayWeekday + 7) % 7;
    // If today is the target weekday but time has passed, go to next week
    if (offset === 0 && date.getHours() >= hour) {
      offset = 7;
    }
    date.setDate(date.getDate() + offset);
  } else {
    // Use normal dayOffset if targetWeekday is not provided
    date.setDate(date.getDate() + dayOffset);
  }

  date.setHours(hour, minute, 0, 0);

  const weekday = date.toLocaleDateString(locale, { weekday: "long" });
  const time = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    date, 
    formatted: `${weekday}, ${time}`, 
  };
}
