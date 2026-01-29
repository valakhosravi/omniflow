import { normalizeDate } from "@/utils/normalizeDate";

export default function propagateSingleSelfSelectionAcrossPlan(
  planFromDate: Date | null,
  planToDate: Date | null,
  dailySelfSelections: Record<string, number>
): Record<string, number> {
  if (!planFromDate || !planToDate) return dailySelfSelections;

  // Generate all days between planFromDate and planToDate inclusive
  const allPlanDays: string[] = [];
  for (
    let d = new Date(planFromDate);
    d <= planToDate;
    d.setDate(d.getDate() + 1)
  ) {
    allPlanDays.push(normalizeDate(d.toISOString()));
  }

  // Find all days in plan range with a selfId > 0 selected
  const selectedDays = allPlanDays.filter(
    (day) => dailySelfSelections[day] && dailySelfSelections[day] > 0
  );

  if (selectedDays.length === 1) {
    // Exactly one day selected -> propagate to all days
    const selectedSelfId = dailySelfSelections[selectedDays[0]];
    const newSelections = { ...dailySelfSelections };
    allPlanDays.forEach((day) => {
      newSelections[day] = selectedSelfId;
    });
    return newSelections;
  }

  if (selectedDays.length === 0) {
    // None selected yet -> wait until first day selection happens,
    // So here just return dailySelfSelections as is
    // (Assigning on first selection can be handled by your setSelfId logic elsewhere)
    return dailySelfSelections;
  }

  // Multiple days selected already - do nothing
  return dailySelfSelections;
}
