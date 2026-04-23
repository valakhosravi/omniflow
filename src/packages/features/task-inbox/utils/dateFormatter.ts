export function toJalaliDate(dateString: string): string {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formatter.format(date); //11 مرداد 1404
}

export function toJalaliDateTime(dateString: string): string {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return formatter.format(date); // "۱۱ مرداد ۱۴۰۴، ۱۴:۳۰"
}
