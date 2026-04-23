import CustomButton from "@/ui/Button";
import { Icon } from "@/ui/Icon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/ui/NextUi";
import RHFInput from "@/ui/RHFInput";
import SnoozeCalendar from "@/ui/SnoozeCalender";
import { useState } from "react";
import useAddSnoozeValidation from "../validation/addSnoozeValidation";
import { toPersianDateWithMonthName } from "@/utils/dateFormatter";
import { Clock, Calendar } from "iconsax-reactjs";
import { useSnoozes } from "../hooks/useSnoozes";
import { addSnooze } from "../types/AddSnoozeModal";
import { TimeInput, TimeInputValue } from "@heroui/react";

interface SnoozeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  requestId?: number | null;
}

export default function SnoozeModal({
  isOpen,
  onOpenChange,
  requestId,
}: SnoozeModalProps) {
  const [calendarISOValue, setCalendarISOValue] = useState<string>("");
  const [timeValue, setTimeValue] = useState<TimeInputValue | null>(null);
  const { createSnooze } = useSnoozes();

  const handleModalChange = (open: boolean) => {
    if (!open) {
      setCalendarISOValue("");
      setTimeValue(null);
      reset({
        Date: "",
        Hour: "",
      });
    }
    if (open) {
      onOpenChange(false);
    }
    onOpenChange(false);
  };
  const [portalContainer] = useState<HTMLElement | null>(() =>
    document.getElementById("modal-root"),
  );

  // useEffect(() => {
  //   const modalRoot = document.getElementById("modal-root");
  //   if (modalRoot) {
  //     setPortalContainer(modalRoot);
  //   }
  // }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useAddSnoozeValidation();

  const onSubmit = (data: addSnooze) => {
    if (!calendarISOValue || !data.Hour) return;

    const [hourStr, minuteStr] = data.Hour.split(":");

    const datePart = calendarISOValue.split("T")[0];

    const exactDateTime = `${datePart}T${hourStr.padStart(
      2,
      "0",
    )}:${minuteStr.padStart(2, "0")}:00.000Z`;

    if (requestId) {
      createSnooze({ RequestId: requestId, SnoozeDate: exactDateTime }).then(
        (data) => {
          if (data.data?.ResponseCode === 100) {
            onOpenChange(false);
          }
        },
      );
    }
  };

  return (
    <>
      {portalContainer && (
        <Modal
          hideCloseButton
          isOpen={isOpen}
          onOpenChange={handleModalChange}
          className={`w-[360px] min-w-[360px] transition-all duration-200`}
          portalContainer={portalContainer}
        >
          <ModalContent>
            <ModalHeader
              className="flex items-center justify-between font-semibold 
        text-[16px]/[24px] pt-[20px] px-[20px] pb-[8px]"
            >
              <span className="text-secodary-950">
                انتخاب زمان و تاریخ دلخواه
              </span>
              <span
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <Icon name="close" className="text-secondary-300" />
              </span>
            </ModalHeader>
            <div className="relative h-[1px] bg-secondary-100 w-[312px] mx-auto mb-[15px]" />
            <form
              className="flex flex-col gap-[20px] px-[20px]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <ModalBody className={`p-0 overflow-hidden space-y-[16px]`}>
                <SnoozeCalendar
                  width={312}
                  cellWidth={36}
                  cellHeight={36}
                  value={calendarISOValue}
                  onChange={(dateStr) => {
                    setCalendarISOValue(dateStr);
                    const persianDate = toPersianDateWithMonthName(dateStr);
                    setValue("Date", persianDate, { shouldValidate: true });
                  }}
                />
                <div className="flex gap-x-[17px] mb-[40px]">
                  <RHFInput
                    startContent={
                      <Calendar size={21} className="text-secondary-500" />
                    }
                    control={control}
                    name="Date"
                    label="انتخاب روز"
                    width={147}
                    height={48}
                    required
                    register={register("Date")}
                    error={errors.Date?.message}
                    textAlignment="text-right"
                    inputDirection="rtl"
                    readOnly
                  />
                  {/* <RHFInput
                startContent={
                  <Clock size={20} className="text-secondary-500" />
                }
                control={control}
                name="Hour"
                label="انتخاب ساعت"
                width={147}
                height={48}
                required
                register={register("Hour")}
                error={errors.Hour?.message}
                textAlignment="text-right"
                inputDirection="rtl"
              /> */}
                  <TimeInput
                    isRequired
                    label="انتخاب ساعت"
                    labelPlacement="outside"
                    startContent={
                      <Clock size={20} className="text-secondary-500" />
                    }
                    variant="bordered"
                    classNames={{
                      base: `w-[147px]`,
                      inputWrapper: `!h-[48px] !min-h-[48px] shadow-none rounded-[12px] border border-default-300`,
                      label: `font-bold text-[14px]/[20px] mb-[6.5px]`,
                      input: "flex flex-row-reverse justify-end gap-1",
                    }}
                    dir="rtl"
                    hourCycle={24}
                    value={timeValue}
                    onChange={(value) => {
                      setTimeValue(value);
                      const timeString = value
                        ? `${value.hour.toString().padStart(2, "0")}:${value.minute
                            .toString()
                            .padStart(2, "0")}`
                        : "";
                      setValue("Hour", timeString, { shouldValidate: true });
                    }}
                  />
                </div>
              </ModalBody>

              <ModalFooter className="px-0">
                <CustomButton
                  buttonVariant="primary"
                  buttonSize="md"
                  className="w-full"
                  type="submit"
                >
                  ذخیره تغییرات
                </CustomButton>
                <CustomButton
                  buttonVariant="outline"
                  buttonSize="md"
                  onPress={() => handleModalChange(false)}
                >
                  انصراف
                </CustomButton>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
