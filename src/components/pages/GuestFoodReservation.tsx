"use client";
import { useBookmark } from "@/hooks/food/useBookmark";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";
import BookmarkIcon from "@/ui/BookmarkIcon";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import { Tab, Tabs } from "@heroui/react";
import { usePathname, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import jalali from "dayjs-jalali";
import "dayjs/locale/fa";
import { useEffect, useMemo } from "react";
import GuestReservationTable from "../food/guest-food-reservation/GuestReservationTable";
import { useGetPlanById } from "@/hooks/food/usePlanAction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetGuestOrderByPlanId } from "@/hooks/food/useGuestReservation";
import {
  MealRow,
  setRowsForDate,
  clearAll,
  setPlanId,
} from "@/store/guestReservationStore";

dayjs.extend(jalali);
dayjs.locale("fa");

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "رزرو غذای مهمان", Href: "/food/guest-reservation" },
];

export default function GuestFoodReservation() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const EditPlanId = searchParams.get("planId");

  const pathname = usePathname();
  const { isBookmarked, handleToggleBookmark, favoriteCount } =
    useBookmark(pathname);
  const { planId } = useSelector(
    (state: RootState) => state.GuestReservationData
  );
  const { planData, isGetting } = useGetPlanById(planId);
  const { OrdersByPlanId } = useGetGuestOrderByPlanId(Number(EditPlanId) ?? 0);

  const fromDate = planData?.Data?.FromDate;
  const toDate = planData?.Data?.ToDate;

  const startDate = dayjs(fromDate).isValid() ? dayjs(fromDate) : dayjs();
  const endDate = dayjs(toDate).isValid()
    ? dayjs(toDate)
    : startDate.add(5, "day");

  const weekTabs = useMemo(() => {
    const result: { key: string; title: string; date: string }[] = [];
    let currentDate = startDate;

    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      const jalaliDate = currentDate.format("D MMMM");
      result.push({
        key: currentDate.format("dddd"),
        title: `${currentDate.format("dddd")} ${jalaliDate}`,
        date: `${currentDate.year()}-${String(currentDate.month() + 1).padStart(
          2,
          "0"
        )}-${String(currentDate.date()).padStart(2, "0")}`,
      });

      currentDate = currentDate.add(1, "day");
    }

    return result;
  }, [startDate, endDate]);

  useEffect(() => {
    if (!EditPlanId) return;

    dispatch(clearAll());
    dispatch(setPlanId(Number(EditPlanId)));
  }, [EditPlanId]);

  useEffect(() => {
    if (!EditPlanId || !OrdersByPlanId?.Data) return;

    const mapped: Record<string, MealRow[]> = {};

    OrdersByPlanId.Data.forEach((order) => {
      if (!mapped[order.MealDate]) mapped[order.MealDate] = [];

      mapped[order.MealDate].push({
        food: String(order.DailyMealId),
        count: order.Count,
        self: String(order.SelfId),
        desc: order.Description || "",
      });
    });

    Object.entries(mapped).forEach(([date, rows]) => {
      dispatch(setRowsForDate({ date, rows }));
    });
  }, [EditPlanId, OrdersByPlanId]);

  return (
    <>
      <BreadcrumbsTop items={breadcrumbs} />
      <div>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-x-3 py-[18.5px]">
            {favoriteCount < 9 && (
              <BookmarkIcon
                isBookmarked={isBookmarked}
                onClick={handleToggleBookmark}
              />
            )}
            <h1 className="font-semibold text-xl/[28px] text-secondary-950">
              رزرو غذای مهمان
            </h1>
          </div>
        </div>
        <div>
          <Tabs
            fullWidth
            aria-label="days"
            variant="underlined"
            className="mb-[32px]"
            classNames={{
              tabList: `gap-x-0`,
              tab: `border-b border-secondary-200 !px-0 pb-[10px] pt-[2px] leading-none`,
              cursor: `w-full h-[2px] bg-secondary-950 shadow-none`,
              tabContent: `font-semibold text-[14px]/[20px] text-secondary-500 
                group-data-[selected=true]:text-secondary-950 group-data-[selected=true]:font-bold`,
            }}
          >
            {weekTabs.map((weekDay) => {
              const selectedDatePlanData = planData?.Data?.DailyMeals.filter(
                (data) => data.MealDate === weekDay.date
              );

              return (
                <Tab key={weekDay.date} title={weekDay.title}>
                  <GuestReservationTable
                    meals={selectedDatePlanData}
                    weekDay={weekDay}
                  />
                </Tab>
              );
            })}
          </Tabs>
        </div>
      </div>
    </>
  );
}
