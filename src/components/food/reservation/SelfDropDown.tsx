import { useSelfList } from "@/hooks/food/useSelfAction";
import { useBasketStore } from "@/store/basketStore";
import { useReservationStore } from "@/store/reservationStore";
import { Icon } from "@/ui/Icon";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/ui/NextUi";

export default function SelfDropDown() {
  const { selfData, isGetting } = useSelfList(1, 10);
  const setSelfId = useBasketStore((state) => state.setSelfId);
  const selfId = useBasketStore((state) => state.selfId);
  const setHasAttemptedNext = useReservationStore(
    (state) => state.setHasAttemptedNext
  );
  const hasAttemptedNext = useReservationStore(
    (state) => state.hasAttemptedNext
  );

  const selectedSelf = selfData?.Data?.Items.find(
    (item) => item.SelfId === selfId
  );

  const handleSelfSelect = (self: any) => {
    if (self.SelfId && self.SelfId !== 0) {
      setSelfId(self.SelfId);
    }
    setHasAttemptedNext(false);
  };
  const showError = hasAttemptedNext;

  return (
    <div className="flex flex-col">
      <Dropdown
        className={`shadow-none border rounded-[12px] relative
         min-w-[280px] w-[280px] border-secondary-950/[.2]`}
        classNames={{
          trigger: `${showError && "border border-red-500 bg-red-100"}`,
        }}
      >
        <DropdownTrigger className="px-2">
          <Button
            className={`cursor-pointer bg-transparent rounded-[8px] w-[280px] h-[32px] text-primary-950
             font-medium text-[12px]/[18px] border flex items-center justify-between
             `}
            isDisabled={isGetting}
          >
            <div className="flex items-center gap-x-[2px]">
              <span>سلف</span>
              {selectedSelf && <span>({selectedSelf.Name})</span>}
            </div>
            <Icon name="arrowDown" className="text-secondary-950" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="selfs"
          items={selfData?.Data?.Items}
          className="space-y-[20px] p-3"
        >
          {(self) => (
            <DropdownItem
              key={self.SelfId}
              className="font-semibold text-[12px]/[18px] text-secondary-900 hover:!bg-primary-950/[3%] p-2"
              onPress={() => handleSelfSelect(self)}
            >
              {self.Name}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
      {showError && (
        <span className="text-red-500 text-xs absolute mt-9 mr-1">
          لطفاً یک سلف انتخاب کنید
        </span>
      )}
    </div>
  );
}
