import dayjs from "dayjs";
import jalali from "dayjs-jalali";
import { DateObject } from "react-multi-date-picker";

dayjs.extend(jalali);

export const toJalaliObject = (date?: string | DateObject) => {
  if (!date) return undefined;

  if (typeof date !== "string") {
    const jDate = date.format("YYYY/MM/DD");
    return dayjs(jDate, { jalali: true }).format("YYYY-MM-DDTHH:mm:ss");
  }

  const normalized = toEnglishDigits(date);
  return dayjs(normalized, { jalali: true }).format("YYYY-MM-DDTHH:mm:ss");
};

const toEnglishDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
