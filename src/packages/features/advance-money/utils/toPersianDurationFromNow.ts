export function toPersianDurationFromNow(targetDate: string): string {
  if (!targetDate) return "";

  const now = new Date();
  const target = new Date(targetDate);

  // difference in milliseconds
  let diffMs = target.getTime() - now.getTime();

  // If past date, take absolute value
  if (diffMs < 0) diffMs = Math.abs(diffMs);

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const months = Math.floor(diffDays / 30); // approx months
  const days = diffDays % 30;

  let result = "";
  if (months > 0) result += `${months} ماه`;
  if (days > 0) {
    result += (result ? " و " : "") + `${days} روز`;
  }

  return result || "۰ روز";
}
