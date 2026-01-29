/**
 * Checks if today or tomorrow is Yalda (winter solstice celebration)
 * Yalda is typically celebrated on December 20-21
 * @returns boolean - true if today or tomorrow is Yalda, false otherwise
 */
export function isYaldaTodayOrTomorrow(): boolean {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Yalda is typically December 20-21 (winter solstice)
    const yaldaDates = [
      { month: 11, day: 20 }, // December 20 (month is 0-indexed)
      { month: 11, day: 21 }, // December 21
    ];
    
    const checkDate = (date: Date) => {
      const month = date.getMonth();
      const day = date.getDate();
      return yaldaDates.some(yalda => yalda.month === month && yalda.day === day);
    };
    
    return checkDate(today) || checkDate(tomorrow);
  } catch (error) {
    console.error('Error checking Yalda date:', error);
    return false;
  }
}

