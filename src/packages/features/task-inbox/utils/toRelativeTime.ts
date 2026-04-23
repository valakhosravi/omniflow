export function toRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  if (isNaN(date.getTime())) return "نامشخص";
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return "لحظاتی پیش";
  if (diffMinutes < 60) return `${diffMinutes} دقیقه پیش`;
  if (diffHours < 24) return `${diffHours} ساعت پیش`;
  if (diffDays < 30) return `${diffDays} روز پیش`;
  if (diffMonths < 12) return `${diffMonths} ماه پیش`;
  if (diffMs < 0) return "در آینده";
  return `${diffYears} سال پیش`;
}
