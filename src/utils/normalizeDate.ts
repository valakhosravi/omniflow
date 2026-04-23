export function normalizeDate(dateString?: string) {
  if (!dateString) return "";
  return dateString.split("T")[0]; // Or your actual logic
}
