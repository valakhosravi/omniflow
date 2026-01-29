"use client";
import PlanCreateTable from "@/components/food/plan/create/PlanCreateTable";
import BreadcrumbsTop from "@/ui/BreadcrumbTop";
import { Tab, Tabs } from "@/ui/NextUi";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import jalali from "dayjs-jalali";
import "dayjs/locale/fa";
import { Suspense, useEffect, useRef } from "react";
import { useWeeklyData } from "@/context/WeeklyDataContext";
import addDays from "@/utils/addDay";
import { usePlanContext } from "@/context/EditPlanDataContext";
import { Meal } from "@/models/food/plan/PlanEdit";
import CustomButton from "@/ui/Button";
import Loading from "@/ui/Loading";
import { usePlanStore } from "@/store/planStore";
import { BreadcrumbsItem } from "@/models/ui/breadcrumbs";

dayjs.extend(jalali);
dayjs.locale("fa");

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "لیست برنامه های غذایی", Href: "/food/plan" },
  { Name: "اضافه کردن برنامه غذایی", Href: "/food/plan/create" },
];

export default function Page() {
  const searchParams = useSearchParams();
  const fromDate = searchParams?.get("from");
  const toDate = searchParams?.get("to");
  const name = searchParams?.get("name");
  const baseDate = fromDate;
  const router = useRouter();
  const { planData, editIdData } = usePlanContext();
  const {
    setWeeklyData: setContextWeeklyData,
    setWeekTabs,
    setMeta,
  } = useWeeklyData();

  const {
    weeklyData,
    selectedIndex,
    setWeeklyData,
    updateDayData,
    setDateRange,
    setSelectedIndex,
    setWeekTabs: setStoreWeekTabs,
    isDataValid,
  } = usePlanStore();

  const startDate = dayjs(baseDate).isValid() ? dayjs(baseDate) : dayjs();
  const endDate = dayjs(toDate).isValid()
    ? dayjs(toDate)
    : startDate.add(5, "day");

  const weekTabs: { key: string; title: string; date: string }[] = [];
  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
    const jalaliDate = currentDate.format("D MMMM");
    weekTabs.push({
      key: currentDate.format("dddd"),
      title: `${currentDate.format("dddd")} ${jalaliDate}`,
      date: `${currentDate.year()}-${String(currentDate.month() + 1).padStart(
        2,
        "0"
      )}-${String(currentDate.date()).padStart(2, "0")}`,
    });
    currentDate = currentDate.add(1, "day");
  }

  const generateInitialWeeklyData = () => {
    return weekTabs.map((_, index) => {
      const mealDate = addDays(fromDate ?? dayjs().format("YYYY-MM-DD"), index);

      const planStartDate = planData?.FromDate;

      if (!planData?.DailyMeals?.length || !planStartDate) {
        return {
          rows: [
            {
              id: Date.now() + index,
              selections: { food: [], appetizer: [], dessert: [], drink: [] },
              mealDate: mealDate,
            },
          ],
        };
      }
      const allMeals = planData.DailyMeals;
      let mealsByDay: { [key: string]: Meal[] } = {};
      const sampleMeal = allMeals[0];
      const sampleMealAny = sampleMeal as any;
      const possibleDateProps = Object.keys(sampleMeal).filter(
        (key) =>
          typeof sampleMealAny[key] === "string" &&
          (key.toLowerCase().includes("date") ||
            (sampleMealAny[key].includes("-") &&
              sampleMealAny[key].length >= 8))
      );

      if (
        "DailyIndex" in sampleMeal ||
        "OrderInWeek" in sampleMeal ||
        "DayIndex" in sampleMeal
      ) {
        const indexProp =
          "DailyIndex" in sampleMeal
            ? "DailyIndex"
            : "OrderInWeek" in sampleMeal
            ? "OrderInWeek"
            : "DayIndex";

        allMeals.forEach((meal) => {
          const mealAny = meal as any;
          const dayIndex = mealAny[indexProp];
          if (!mealsByDay[dayIndex]) mealsByDay[dayIndex] = [];
          mealsByDay[dayIndex].push(meal);
        });
      } else if (possibleDateProps.length > 0) {
        const dateProp = possibleDateProps[0];

        allMeals.forEach((meal) => {
          const mealAny = meal as any;
          const mealDateStr = mealAny[dateProp].split("T")[0];
          if (!mealsByDay[mealDateStr]) mealsByDay[mealDateStr] = [];
          mealsByDay[mealDateStr].push(meal);
        });

        const dateKeys = Object.keys(mealsByDay).sort();
        const newMealsByDay: { [key: number]: Meal[] } = {};

        dateKeys.forEach((dateKey, idx) => {
          newMealsByDay[idx] = mealsByDay[dateKey];
        });

        mealsByDay = newMealsByDay;
      } else {
        const mealsPerDay = Math.ceil(allMeals.length / weekTabs.length);

        for (let i = 0; i < allMeals.length; i++) {
          const dayIndex = Math.floor(i / mealsPerDay);
          if (dayIndex >= weekTabs.length) break;

          if (!mealsByDay[dayIndex]) mealsByDay[dayIndex] = [];
          mealsByDay[dayIndex].push(allMeals[i]);
        }
      }

      const mealsForDay = mealsByDay[index] || [];

      return {
        rows: [
          {
            id: Date.now() + index,
            selections: {
              food: mealsForDay
                .filter((meal) => meal.MealType === 1)
                .map((meal) => meal.MealId),
              appetizer: mealsForDay
                .filter((meal) => meal.MealType === 2)
                .map((meal) => meal.MealId),
              dessert: mealsForDay
                .filter((meal) => meal.MealType === 3)
                .map((meal) => meal.MealId),
              drink: mealsForDay
                .filter((meal) => meal.MealType === 4)
                .map((meal) => meal.MealId),
            },
            mealDate: mealDate,
          },
        ],
      };
    });
  };

  const hasInitialized = useRef(false);

  // Initialize data on mount
  useEffect(() => {
    if (!fromDate || !toDate || hasInitialized.current) return;

    // Check if stored data is valid for current date range
    const storedDataValid = isDataValid(fromDate, toDate);

    if (!storedDataValid || weeklyData.length !== weekTabs.length) {
      // Initialize with fresh data
      const initialData = generateInitialWeeklyData();
      setWeeklyData(initialData);
      setDateRange(fromDate, toDate, name || "");
    }

    hasInitialized.current = true;
  }, [fromDate, toDate, name]);

  useEffect(() => {
    if (!fromDate || !toDate) return;

    setMeta({
      name: name || "",
      fromDate: fromDate,
      toDate: toDate,
    });
  }, [fromDate, name, setMeta, toDate]);

  const handleNextTab = () => {
    if (selectedIndex < weekTabs.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      setContextWeeklyData(weeklyData);
      setWeekTabs(weekTabs);
      setStoreWeekTabs(weekTabs);

      const query = new URLSearchParams({
        name: name || "",
        from: fromDate || "",
        to: toDate || "",
      }).toString();
      router.push(`/food/plan/create/preview?${query}`);
    }
  };

  const handlePrevTab = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <>
        <BreadcrumbsTop items={breadcrumbs} />
        <h1 className="font-semibold text-xl/[28px] text-secondary-950 mb-[38px] mt-[22px]">
          {editIdData
            ? `ویرایش برنامه غذایی ${name}`
            : `ایجاد برنامه غذایی ${name}`}
        </h1>
        <Tabs
          fullWidth
          variant="underlined"
          aria-label="days"
          selectedKey={weekTabs[selectedIndex]?.key}
          onSelectionChange={(key) => {
            const index = weekTabs.findIndex((tab) => tab.key === key);
            setSelectedIndex(index);
          }}
          className="mb-[32px]"
          classNames={{
            tabList: `gap-x-0`,
            tab: `border-b border-secondary-200 !px-0 pb-[10px] pt-[2px] leading-none`,
            cursor: `w-full h-[2px] bg-secondary-950 shadow-none`,
            tabContent: `font-semibold text-[14px]/[20px] text-secondary-500 
            group-data-[selected=true]:text-secondary-950 group-data-[selected=true]:font-bold`,
          }}
        >
          {weekTabs.map((tab, index) => (
            <Tab key={tab.key} title={tab.title}>
              {weeklyData[index] && (
                <PlanCreateTable
                  data={weeklyData[index]}
                  onChange={(updatedDayData) => {
                    updateDayData(index, updatedDayData);
                  }}
                  date={tab.date}
                />
              )}
            </Tab>
          ))}
        </Tabs>

        <div className="w-full flex justify-end mt-10 gap-x-4">
          <CustomButton
            buttonVariant="primary"
            buttonSize="sm"
            className="font-semibold text-[14px]/[20px] flex items-center justify-center
             gap-x-[8px]"
            onPress={handlePrevTab}
          >
            روز قبلی
          </CustomButton>
          <CustomButton
            buttonVariant="primary"
            buttonSize="sm"
            className="font-semibold text-[14px]/[20px] flex items-center justify-center
             gap-x-[8px]"
            onPress={handleNextTab}
          >
            {selectedIndex < weekTabs.length - 1 ? "روز بعدی" : "پیش نمایش"}
          </CustomButton>
        </div>
      </>
    </Suspense>
  );
}
