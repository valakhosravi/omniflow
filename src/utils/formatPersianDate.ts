import dayjs from "dayjs";
import jalali from "dayjs-jalali";
import "dayjs/locale/fa";

dayjs.extend(jalali);
dayjs.locale("fa");

export const formatPersianDate = (isoDate: string) => {
  return dayjs(isoDate).locale("fa").format("dddd - D MMMM YYYY");
};

export const formatPersianDate2 = (isoDate: string) => {
  return dayjs(isoDate).locale("fa").format("dddd D MMMM");
};

export const formatPersianDay = (isoDate: string) => {
  return dayjs(isoDate).locale("fa").format("D");
};

export const formatDate = (date: Date) => date.toLocaleDateString("sv-SE");
