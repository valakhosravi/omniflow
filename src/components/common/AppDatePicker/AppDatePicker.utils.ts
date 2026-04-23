import type { DateObject } from "react-multi-date-picker";

export function getStringValue(
  value: DateObject | DateObject[] | string | null,
  format: string,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0]?.format(format) ?? "";
  return value.format(format);
}
