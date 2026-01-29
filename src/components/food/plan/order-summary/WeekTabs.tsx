import PlanSummary from "@/models/food/plan/PlanSummary";
import { Tab, Tabs } from "@/ui/NextUi";
import { formatPersianDate } from "@/utils/formatPersianDate";

export default function WeekTabs({
  planOrderSummary,
}: {
  planOrderSummary?: PlanSummary[];
}) {
  const groupedByDate = planOrderSummary?.reduce((acc, meal) => {
    if (!acc[meal.MealDate]) {
      acc[meal.MealDate] = [];
    }
    acc[meal.MealDate].push(meal);
    return acc;
  }, {} as Record<string, PlanSummary[]>);

  return (
    <Tabs
      fullWidth
      aria-label="Meal Plan Tabs"
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
      {Object.entries(groupedByDate ?? {}).map(([date, meals]) => (
        <Tab key={date} title={formatPersianDate(date)}>
          <ul className="p-4 grid grid-cols-4 gap-2">
            {meals.map((meal, idx) => (
              <li
                key={idx}
                className="border border-secondary-200 p-2 rounded-xl"
              >
                <p className="font-bold text-primary-950 mb-1">
                  {meal.MealName}
                </p>
                <p className="font-medium text-secondary-700 text-[14px]">
                  تامین‌کننده : {meal.SupplierName}
                </p>
                <p className="font-medium text-secondary-700 text-[14px]">
                  تعداد : {meal.TotalCount}
                </p>
              </li>
            ))}
          </ul>
        </Tab>
      ))}
    </Tabs>
  );
}
