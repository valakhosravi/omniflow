import CustomButton from "@/ui/Button";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
} from "@/ui/NextUi";
import { Clock } from "iconsax-reactjs";
import { formatTodayAt } from "../utils/date";
import { useSnoozes } from "../hooks/useSnoozes";

const dropdownItems = [
  {
    key: "todayEvening",
    title: "امروز عصر",
    ...formatTodayAt(16),
  },
  {
    key: "tomorrowMorning",
    title: "فردا صبح",
    ...formatTodayAt(8, 0, 1),
  },
  {
    key: "weekday",
    title: "وسط هفته",
    ...formatTodayAt(8, 0, 2),
  },
  {
    key: "weekend",
    title: "آخر هفته",
    ...formatTodayAt(8, 0, 0, "fa-IR", 3),
  },
  {
    key: "nextWeek",
    title: "هفته آینده",
    ...formatTodayAt(8, 0, 0, "fa-IR", 6),
  },
];

interface SnoozeDropDownModel {
  requestId: number;
  snoozeId?: number | null;
  onOpenSnoozeModal: () => void;
}

export default function SnoozeDropDown({
  requestId,
  snoozeId,
  onOpenSnoozeModal,
}: SnoozeDropDownModel) {
  const {
    createSnooze,
    isCreating,
    deleteSnooze,
    isDeleting,
    editSnooze,
    isEditing,
  } = useSnoozes();
  const itemMap = Object.fromEntries(
    dropdownItems.map((item) => [item.key, item])
  );

  const handleCreateSnooze = (key: React.Key) => {
    const item = itemMap[key as string];
    if (!item?.date) return;
    const localDate = item?.date;
    const tzOffsetMs = localDate?.getTimezoneOffset() * 60 * 1000;
    const isoWithLocalHour = new Date(
      localDate?.getTime() - tzOffsetMs
    ).toISOString();

    if (item) {
      if (snoozeId === 0 || snoozeId === undefined) {
        createSnooze({
          RequestId: requestId,
          SnoozeDate: isoWithLocalHour,
        });
      } else {
        editSnooze({
          RequestId: requestId,
          SnoozeDate: item.date.toISOString(),
        });
      }
    }
  };

  const handleDeleteSnooze = (id: number) => {
    deleteSnooze(requestId).then((data) => {
      if (data.data?.ResponseCode === 100) {
      }
    });
  };

  return (
    <>
      <Dropdown placement="bottom-end" classNames={{ content: "p-0" }}>
        <DropdownTrigger>
          <Button
            isIconOnly
            variant="solid"
            className="!bg-transparent text-secondary-400 hover:bg-pagination-dropdown p-2"
          >
            <Clock size={16} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Snooze Menu"
          disabledKeys={["header"]}
          classNames={{ list: "space-y-[12px]", base: "p-[12px]" }}
          onAction={handleCreateSnooze}
        >
          {[
            <DropdownItem
              key="header"
              isReadOnly
              className="p-2 cursor-default"
              textValue="یادآوری مجدد برای"
            >
              <p className="font-semibold text-secondary-600">
                یادآوری مجدد برای...
              </p>
            </DropdownItem>,
            ...dropdownItems.map((item) => (
              <DropdownItem key={item.key} className="hover:bg-day-title p-2">
                <div className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <span>{item.formatted}</span>
                </div>
              </DropdownItem>
            )),
            <DropdownItem
              key="custom-time"
              className="p-0 mt-[16px] hover:!bg-transparent cursor-default"
            >
              <div className="flex flex-col !space-y-[16px]">
                <CustomButton
                  buttonVariant="outline"
                  className="w-full max-h-[32px] h-[32px] !rounded-[8px]"
                  onPress={() => onOpenSnoozeModal()}
                >
                  انتخاب زمان و تاریخ دلخواه
                </CustomButton>
                {snoozeId !== null && snoozeId !== undefined && (
                  <CustomButton
                    buttonVariant="outline"
                    className="w-full max-h-[32px] h-[32px] !rounded-[8px] !text-delete-snooze"
                    onPress={() => handleDeleteSnooze(snoozeId)}
                  >
                    لغو یادآوری مجدد
                  </CustomButton>
                )}
              </div>
            </DropdownItem>,
          ]}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
