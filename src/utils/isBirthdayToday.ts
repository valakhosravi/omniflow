/**
 * Checks if today is the user's birthday
 * @param birthDate - The user's birth date in format "MM/DD/YYYY HH:mm:ss" or any valid date string
 * @returns boolean - true if today is the user's birthday, false otherwise
 */
export function isBirthdayToday(birthDate: string): boolean {
  if (!birthDate) return false;

  try {
    // Parse the birth date
    const birthDateObj = new Date(birthDate);
    
    // Get today's date
    const today = new Date();
    
    // Compare month and day (ignore year)
    const birthMonth = birthDateObj.getMonth();
    const birthDay = birthDateObj.getDate();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    
    return birthMonth === todayMonth && birthDay === todayDay;
  } catch (error) {
    console.error('Error checking birthday:', error);
    return false;
  }
}
