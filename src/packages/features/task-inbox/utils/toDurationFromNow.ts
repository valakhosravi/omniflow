export function toDurationFromNow(isoLike: string) {
  const d = new Date(isoLike);
  if (isNaN(+d)) return "نامعتبر";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const abs = Math.abs(diffMs);

  const sec = Math.floor(abs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (day > 0) return `${day} روز پیش`;
  if (hr > 0) return `${hr} ساعت پیش`;
  if (min > 0) return `${min} دقیقه پیش`;
  return `${sec} ثانیه پیش`;
}

export function formatJalaliDateTime(isoLike: string) {
  const d = new Date(isoLike);
  if (isNaN(+d)) return "نامعتبر";

  const jalaliFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const timeFormatter = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const jalaliDate = jalaliFormatter.format(d);
  const time = timeFormatter.format(d);

  return `${time} در ${jalaliDate}`;
}
