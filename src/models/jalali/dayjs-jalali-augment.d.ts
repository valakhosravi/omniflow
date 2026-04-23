import "dayjs";

declare module "dayjs" {
  interface FormatObject {
    jalali?: boolean;
  }

  interface Dayjs {
    calendar(calendarSystem: "jalali" | "gregory"): Dayjs;
  }
}
