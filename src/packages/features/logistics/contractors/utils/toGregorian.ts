import moment from "moment-jalaali";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const toGregorian = (date?: string | DateObject) => {
  if (!date) return undefined;
  if (typeof date !== "string") {
    return date.toDate().toISOString().split(".")[0];
  }
  return moment(date, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss");
};

export const toJalaliObject = (date?: string | DateObject) => {
  if (!date) return undefined;

  if (typeof date !== "string") {
    const jDate = date.format("YYYY/MM/DD"); // Jalali formatted string
    return moment(jDate, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss");
  }

  const normalized = toEnglishDigits(date);
  return moment(normalized, "jYYYY/jMM/jDD").format("YYYY-MM-DDTHH:mm:ss");
};

const toEnglishDigits = (str: string) =>
  str.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
