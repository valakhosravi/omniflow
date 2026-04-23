"use client";
import OrderReservationModel from "@/models/food/order/OrderReservation";
import { useState, useMemo } from "react";
import ReservationCell from "./ReservationCell";

const WEEK_DAYS = [
  { label: "شنبه", value: 0 },
  { label: "یکشنبه", value: 1 },
  { label: "دوشنبه", value: 2 },
  { label: "سه‌شنبه", value: 3 },
  { label: "چهارشنبه", value: 4 },
  { label: "پنجشنبه", value: 5 },
];

interface TimelineRow {
  plan: OrderReservationModel | null;
  from: Date | null;
  to: Date | null;
  isGap: boolean;
  isReservable: boolean;
}

export default function ReservationTable({
  reservationData,
}: {
  reservationData: OrderReservationModel[];
}) {
  const [openCell, setOpenCell] = useState<{ row: number; col: number } | null>(
    null,
  );
  const [openReservationModal, setOpenReservationModal] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCloseReservationModal = () => {
    setOpenReservationModal(null);
  };

  // Generate timeline with gaps filled
  const timelineRows = useMemo(() => {
    if (reservationData.length === 0) return [];

    const sortedPlans = [...reservationData].sort(
      (a, b) => new Date(a.FromDate).getTime() - new Date(b.FromDate).getTime(),
    );

    const rows: TimelineRow[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // Find the earliest and latest dates
    const earliestDate = new Date(sortedPlans[0].FromDate);
    const latestDate = new Date(sortedPlans[sortedPlans.length - 1].ToDate);

    // Generate rows for each week starting from the earliest date
    let currentDate = new Date(earliestDate);

    while (currentDate <= latestDate) {
      // Find if there's a plan that covers this week
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6); // End of week (Friday)

      const matchingPlan = sortedPlans.find((plan) => {
        const planStart = new Date(plan.FromDate);
        const planEnd = new Date(plan.ToDate);

        // Check if this week overlaps with the plan
        return weekStart <= planEnd && weekEnd >= planStart;
      });

      if (matchingPlan) {
        // Add the plan row
        rows.push({
          plan: matchingPlan,
          from: new Date(matchingPlan.FromDate),
          to: new Date(matchingPlan.ToDate),
          isGap: false,
          isReservable: matchingPlan.IsReservable,
        });
      } else {
        // Add a gap row
        rows.push({
          plan: null,
          from: weekStart,
          to: weekEnd,
          isGap: true,
          isReservable: false,
        });
      }

      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return rows;
  }, [reservationData]);

  return (
    <table className="w-full border-separate border-spacing-0 rounded-[12px]">
      <thead>
        <tr className="bg-header-table">
          {WEEK_DAYS.map((day, index) => (
            <th
              key={day.value}
              className={`
                text-center font-medium text-[12px]/[18px] text-secondary-700
                px-6 py-[13px] text-nowrap
                bg-header-table
                border-y border-secondary-200
                ${index === 0 && "border-x rounded-tr-[12px]"}
                ${
                  index === WEEK_DAYS.length - 1 && "border-l rounded-tl-[12px]"
                }
                ${index > 0 && index < WEEK_DAYS.length - 1 && "border-l"}
              `}
            >
              {day.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timelineRows.map((row, rowIndex) => {
          const { plan, from, to, isReservable } = row;
          const isLastRow = rowIndex === timelineRows.length - 1;
          const today = new Date();

          const handleOpenReservationModal = (row: number, col: number) => {
            setOpenReservationModal({ row, col });
          };

          const isTodayInPlanRange =
            from && to ? today >= from && today <= to : false;

          return (
            <tr
              key={`timeline-${rowIndex}`}
              className={plan ? "bg-white" : "bg-gray-100"}
            >
              {WEEK_DAYS.map((day, colIndex) => (
                <ReservationCell
                  key={day.value}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  day={day}
                  plan={plan}
                  from={from}
                  to={to}
                  isReservable={isReservable}
                  openCell={openCell}
                  setOpenCell={setOpenCell}
                  openReservationModal={openReservationModal}
                  handleOpenReservationModal={handleOpenReservationModal}
                  handleCloseReservationModal={handleCloseReservationModal}
                  isLastRow={isLastRow}
                  isTodayInPlanRange={isTodayInPlanRange}
                />
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
