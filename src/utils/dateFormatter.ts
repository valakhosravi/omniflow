export function toLocalDateShort(date?: string | Date) {
  if (!date) return "";

  const d = new Date(date);
  const parts = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";

  return `${day} / ${month} / ${year}`;
}

export function toLocalDateShortExel(date?: string | Date) {
  if (!date) return "";

  const d = new Date(date);
  const parts = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";

  return `${year}/${month}/${day}`;
}

export function toLocalDateTimeShort(date?: string | Date) {
  if (!date) return "";
  const d = new Date(date);
  const datePart = d.toLocaleDateString("fa-IR").replace(/\//g, "/"); // تبدیل / به -
  const timePart = d.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
  });

  return `${timePart} - ${datePart}`;
}

export function toLocalTimeShort(date?: string | Date) {
  if (!date) return "";
  const d = new Date(date);
  const timePart = d.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${timePart}`;
}

export function toPersianDateWithMonthName(isoDate: string) {
  if (!isoDate) return "";

  try {
    const date = new Date(isoDate);

    const formatter = new Intl.DateTimeFormat("fa-IR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Format like "۲۵ مرداد ۱۴۰۴"
    const formatted = formatter.format(date);

    // Add comma between day/month and year
    const parts = formatted.split(" "); // ["۲۵", "مرداد", "۱۴۰۴"]
    if (parts.length === 3) {
      return `${parts[0]} ${parts[1]}, ${parts[2]}`; // "۲۵ مرداد, ۱۴۰۴"
    }

    return formatted;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Returns the date-only portion of a Persian locale string (e.g. "۱۴۰۲/۱۰/۱۱").
 * Shared utility — replaces inline `toLocaleString("fa-IR").split(", ")[0]` calls.
 */
export function toPersianDateOnly(date?: string | Date): string {
  if (!date) return "";
  try {
    return new Date(date).toLocaleString("fa-IR").split(", ")[0];
  } catch {
    return "";
  }
}

export function formatTimePeriod(startDate: string | Date): string {
  if (!startDate) return "";

  const start = new Date(startDate);
  const now = new Date();
  const diffInMs = now.getTime() - start.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 30) {
    return `${diffInDays} روز گذشته`;
  }

  const years = Math.floor(diffInDays / 365);
  const remainingDaysAfterYears = diffInDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;

  let result = "";
  const parts = [];

  if (years > 0) {
    parts.push(`${years} سال`);
  }

  if (months > 0) {
    parts.push(`${months} ماه`);
  }

  if (days > 0) {
    parts.push(`${days} روز`);
  }

  if (parts.length === 0) {
    return "کمتر از یک روز گذشته";
  }

  if (parts.length === 1) {
    result = parts[0];
  } else if (parts.length === 2) {
    result = `${parts[0]} و ${parts[1]}`;
  } else {
    result = `${parts[0]} و ${parts[1]} و ${parts[2]}`;
  }

  return `${result} گذشته`;
}
