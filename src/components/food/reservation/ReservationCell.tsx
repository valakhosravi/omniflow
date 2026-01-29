import MealDetail from "./MealDetail";
import MealReservation from "./MealReservation";
import FoodBadge from "./FoodBadge";
import { Chip } from "@/ui/NextUi";
import { formatDate, formatPersianDay } from "@/utils/formatPersianDate";
import { planModel } from "@/models/food/order/OrderReservation";
import { useBasketStore } from "@/store/basketStore";
import dayjs from "dayjs";
import jalali from "dayjs-jalali";
import "dayjs/locale/fa";

dayjs.extend(jalali);
dayjs.locale("fa");

const variants: Record<number, "Green" | "Orange" | "Purple"> = {
  1: "Green",
  3: "Orange",
  4: "Purple",
};

interface PlanDay {
  Day: string;
  IsHoliday: boolean;
  HolidayDescription?: string;
  ReservationsDetails?: any[];
  SelfName?: string;
}

interface ReservationCellProps {
  rowIndex: number;
  colIndex: number;
  day: { label: string; value: number };
  plan: any;
  from: Date | null;
  to: Date | null;
  openCell: { row: number; col: number } | null;
  setOpenCell: React.Dispatch<
    React.SetStateAction<{ row: number; col: number } | null>
  >;
  openReservationModal: { row: number; col: number } | null;
  handleOpenReservationModal: (row: number, col: number) => void;
  handleCloseReservationModal: () => void;
  isLastRow: boolean;
  isTodayInPlanRange: boolean;
  isReservable: boolean;
}

export default function ReservationCell({
  rowIndex,
  colIndex,
  day,
  plan,
  from,
  to,
  openCell,
  setOpenCell,
  openReservationModal,
  handleOpenReservationModal,
  handleCloseReservationModal,
  isLastRow,
  isTodayInPlanRange,
  isReservable,
}: ReservationCellProps) {
  let matchedDate: Date | null = null;

  if (plan && from && to) {
    for (
      let d = new Date(from);
      d <= to;
      d = new Date(d.getTime() + 86400000)
    ) {
      const gregorianDay = d.getDay();
      const persianDay = (gregorianDay + 1) % 7;
      if (persianDay === day.value) {
        matchedDate = new Date(d);
        break;
      }
    }
  } else if (from && to) {
    // For gap rows, find the date within the gap range
    for (
      let d = new Date(from);
      d <= to;
      d = new Date(d.getTime() + 86400000)
    ) {
      const gregorianDay = d.getDay();
      const persianDay = (gregorianDay + 1) % 7;
      if (persianDay === day.value) {
        matchedDate = new Date(d);
        break;
      }
    }
  }

  const isToday =
    matchedDate && new Date().toDateString() === matchedDate.toDateString();

  const isBottomLeft = isLastRow && colIndex === 5; // WEEK_DAYS.length - 1 = 5
  const isBottomRight = isLastRow && colIndex === 0;

  const mealsForThisCell: PlanDay | undefined = plan?.PlanDays.find(
    (d: PlanDay) => {
      const date = new Date(d.Day);
      const persianDay = (date.getDay() + 1) % 7;
      return persianDay === day.value;
    }
  );

  const isHoverable = !!plan && !mealsForThisCell?.IsHoliday;

  const isOpenCell = openCell?.row === rowIndex && openCell?.col === colIndex;
  const setSelectedDay = useBasketStore((state) => state.setSelectedDay);

  const sortedDetails =
    mealsForThisCell?.ReservationsDetails?.sort(
      (a, b) => Number(a.MealType) - Number(b.MealType)
    ) ?? [];

  const supplierName = sortedDetails[0]?.SupplierName ?? null;
  const items = useBasketStore((state) => state.items);
  const setPlanId = useBasketStore((state) => state.setPlanId);

  const getLastValidReservationDay = (
    fromDateStr: string,
    toDateStr: string,
    planDays: PlanDay[]
  ): Date | null => {
    if (!planDays) return null;
    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);

    const holidayDates = planDays
      .filter((d) => d.IsHoliday)
      .map((d) => new Date(d.Day).toDateString());

    for (let d = new Date(toDate); d >= fromDate; d.setDate(d.getDate() - 1)) {
      const dStr = d.toDateString();
      if (!holidayDates.includes(dStr)) {
        return new Date(d);
      }
    }

    return null;
  };

  const hasValidReservation =
    mealsForThisCell?.ReservationsDetails?.some(
      (reservation) => Number(reservation.DailyMealId) !== 0
    ) ?? false;

  return (
    <td
      className={`text-center relative ${
        plan ? "bg-white" : "bg-gray-100 text-gray-400"
      } ${
        mealsForThisCell?.IsHoliday && "!bg-accent-400"
      } border-l border-b border-secondary-200 ${
        colIndex === 0 ? "border-r" : ""
      } w-[234.67px] h-[160px] ${isBottomLeft ? "rounded-bl-[12px]" : ""} ${
        isBottomRight ? "rounded-br-[12px]" : ""
      } group`}
    >
      <div
        className={`absolute inset-0 bg-backdrop/20 backdrop-blur-[2px] transition-opacity duration-200 flex items-center justify-center pointer-events-none z-10 ${
          isOpenCell
            ? "opacity-100 pointer-events-auto"
            : isHoverable
            ? "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto z-10"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {(plan?.PlanDays ?? []) && hasValidReservation ? (
          <MealDetail
            OrderId={plan?.OrderId}
            isPlanOpen={plan?.IsOpen ?? false}
            isHoliday={mealsForThisCell?.IsHoliday}
            meals={mealsForThisCell?.ReservationsDetails ?? []}
            matchedDate={matchedDate}
            selfName={mealsForThisCell?.SelfName}
            isOpen={isOpenCell}
            setIsOpen={(open) =>
              setOpenCell(open ? { row: rowIndex, col: colIndex } : null)
            }
            onOpenReservationModal={() => {
              setPlanId(plan.PlanId);
              handleOpenReservationModal(rowIndex, colIndex);
            }}
            isLastRow={isLastRow}
            isTodayInPlanRange={isTodayInPlanRange}
          />
        ) : matchedDate &&
          new Date(matchedDate) >= new Date() &&
          !isTodayInPlanRange &&
          isReservable ? (
          <button
            className="cursor-pointer bg-primary-950 border border-primary-950/[25%] text-secondary-0 w-[137px] h-[32px] rounded-[8px] font-semibold text-[12px]/[18px]"
            onClick={() => {
              handleOpenReservationModal(rowIndex, colIndex);
              if (matchedDate) {
                const dayString = formatDate(matchedDate);
                setSelectedDay(dayString);
                setPlanId(plan.PlanId);
              }
            }}
          >
            رزرو
          </button>
        ) : (
          <MealDetail
            OrderId={plan?.OrderId}
            isPlanOpen={plan?.IsOpen ?? false}
            isHoliday={mealsForThisCell?.IsHoliday}
            meals={mealsForThisCell?.ReservationsDetails ?? []}
            matchedDate={matchedDate}
            selfName={mealsForThisCell?.SelfName}
            isOpen={isOpenCell}
            setIsOpen={(open) =>
              setOpenCell(open ? { row: rowIndex, col: colIndex } : null)
            }
            onOpenReservationModal={() => {
              if (matchedDate) {
                const hasOrder = items.findIndex(
                  (i) => i.MealDate === formatDate(matchedDate)
                );
                setPlanId(plan.PlanId);
              }
              handleOpenReservationModal(rowIndex, colIndex);
            }}
            isLastRow={isLastRow}
            isTodayInPlanRange={isTodayInPlanRange}
          />
        )}

        <MealReservation
          day={matchedDate}
          OrderId={plan?.OrderId}
          planId={plan?.PlanId}
          lastDayNotHoliday={getLastValidReservationDay(
            plan?.FromDate,
            plan?.ToDate,
            plan?.PlanDays
          )}
          holidays={plan?.PlanDays.filter((h: planModel) => h.IsHoliday).map(
            (p: planModel) => p.Day
          )}
          toDatePlan={to}
          isOpen={
            openReservationModal?.row === rowIndex &&
            openReservationModal?.col === colIndex
          }
          onOpenChange={(open) => {
            if (matchedDate) {
              const dayString = formatDate(matchedDate);
              setSelectedDay(dayString);
            }
            if (!open) {
              handleCloseReservationModal();
            }
          }}
          hasValidReservation={hasValidReservation}
          planDays={plan?.PlanDays}
        />
      </div>

      <div className="absolute left-3 top-3">
        {mealsForThisCell?.ReservationsDetails && supplierName !== null && (
          <Chip
            className="!font-medium text-[10px]/[16px] !text-primary-950 bg-chip-purple !py-[0.5px] !px-[7.5px] h-[21px]"
            classNames={{ content: `px-0` }}
          >
            <span>{supplierName}</span>
          </Chip>
        )}
      </div>

      <div className="flex flex-col h-full pt-1">
        <div
          className={`flex items-center justify-center self-center size-[24] rounded-full ${
            isToday ? "text-primary-800" : ""
          }`}
        >
          {matchedDate ? (
            <div className="flex flex-col items-center text-center">
              <span className={`${isToday && "underline"}`}>
                {formatPersianDay(matchedDate.toISOString())}
              </span>
              <span className="text-[8px] leading-tight">
                {dayjs(matchedDate.toISOString()).locale("fa").format("MMMM")}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] text-gray-500">تعریف نشده</span>
            </div>
          )}
        </div>

        {mealsForThisCell?.IsHoliday ? (
          <div className="flex flex-col justify-center items-center h-full w-full !-mt-4 font-medium space-y-2">
            <span className="text-[14px]/[20px] text-secondary-950">تعطیل</span>
            {mealsForThisCell.HolidayDescription && (
              <span className="text-[12px]/[18px] text-secondary-500">
                ({mealsForThisCell.HolidayDescription})
              </span>
            )}
          </div>
        ) : !plan ? (
          // For gap rows (no plan), show date and "تعریف نشده" label
          <div className="flex flex-col justify-center items-center h-full w-full !-mt-4 font-medium space-y-2">
            <span className="text-[14px]/[20px] text-secondary-950/[50%]">
              تعریف نشده
            </span>
          </div>
        ) : (
          <div>
            {matchedDate &&
              plan?.PlanDays &&
              (() => {
                const meals = (
                  mealsForThisCell?.ReservationsDetails ?? []
                ).filter(
                  (res) =>
                    new Date(res.MealDate).toDateString() ===
                    matchedDate?.toDateString()
                );
                const sortedMeals = meals.sort(
                  (a, b) => Number(a.MealType) - Number(b.MealType)
                );
                const topThreeMeals = sortedMeals.slice(0, 3);

                return (
                  <div className="flex flex-col gap-y-3 text-[12px] text-secondary-700 mt-[12px] pr-[15px]">
                    {topThreeMeals.map((res, index) => (
                      <div
                        key={`${res.MealDate}-${res.MealType}-${index}`}
                        className="flex items-center gap-x-1"
                      >
                        <FoodBadge
                          MealName={res.MealName}
                          varient={variants[Number(res.MealType)]}
                        />
                        {res.OrderCount > 1 && (
                          <span className="text-secondary-400 font-normal text-[12px]/[18px]">
                            {res.OrderCount} عدد
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
          </div>
        )}
      </div>
    </td>
  );
}
