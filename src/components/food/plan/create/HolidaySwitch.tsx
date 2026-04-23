import { useEffect } from "react";
import { useSwitch, VisuallyHidden } from "@heroui/react";
import {
  useCreateHoliday,
  useDeleteHoliday,
} from "@/hooks/food/useHolidayAction";
import { useReservationStore } from "@/store/reservationStore";

type holidaySwitchProps = {
  date: string;
  holiday: boolean;
  onDataClear?: () => void;
};

const ThemeSwitch = ({
  onChange,
}: {
  onChange: (selected: boolean) => void;
}) => {
  const isHolidayPlan = useReservationStore((store) => store.isHolidayPlan);
  const { Component, slots, getBaseProps, getInputProps, getWrapperProps } =
    useSwitch({
      isSelected: isHolidayPlan,
      onChange: () => onChange(!isHolidayPlan), // toggle manually
    });

  return (
    <div className="flex items-center gap-x-4 mb-4">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              "w-6 h-6 flex items-center justify-center rounded-lg",
              isHolidayPlan
                ? "!bg-primary-950 hover:!bg-primary-900"
                : "bg-secondary-300 hover:bg-secondary-400",
            ],
          })}
        ></div>
      </Component>
      <p className="text-default-500 select-none">
        تعطیل : {isHolidayPlan ? "است" : "نیست"}
      </p>
    </div>
  );
};

export default function HolidaySwitch({
  date,
  holiday,
  onDataClear,
}: holidaySwitchProps) {
  const { createHoliday } = useCreateHoliday();
  const { deleteHoliday } = useDeleteHoliday();

  const setIsHolidayPlan = useReservationStore(
    (state) => state.setIsHolidayPlan,
  );

  useEffect(() => {
    setIsHolidayPlan(!!holiday);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holiday, date]);

  const handleChange = async (newVal: boolean) => {
    setIsHolidayPlan(newVal);
    if (newVal) {
      if (onDataClear) {
        onDataClear();
      }
      await createHoliday({ HolidayDate: date });
    } else {
      await deleteHoliday(date);
    }
  };

  return <ThemeSwitch onChange={handleChange} />;
}
