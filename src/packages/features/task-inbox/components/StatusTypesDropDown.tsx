import { useTaskStore } from "@/store/tasksStore";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@/ui/NextUi";

const statuses = [
  { id: 1, title: "در حال بررسی" },
  { id: 2, title: "رد شده" },
  { id: 3, title: "تایید شده" },
];

export default function StatusTypesDropDown() {
  const { StateCode, setFilter } = useTaskStore();
  return (
    <div className="flex flex-col gap-y-1">
      <label>وضعیت</label>
      <Autocomplete
        placeholder=" وضعیت ها"
        variant="bordered"
        selectedKey={StateCode ? StateCode.toString() : null}
        onSelectionChange={(key) => {
          if (key === null || key === "") {
            setFilter("StateCode", undefined);
          } else {
            setFilter("StateCode", parseInt(key.toString()));
          }
        }}
        popoverProps={{
          offset: 10,
          classNames: {
            content: "shadow-none",
          },
        }}
        inputProps={{
          classNames: {
            input: `font-normal text-[12px]/[18px] text-secondary-400`,
            inputWrapper: `px-[8px] py-[6px] border-1 border-secondary-950/[.2] rounded-[8px] h-[32px] min-h-[32px] shadow-none`,
            innerWrapper: ``,
          },
        }}
        classNames={{
          base: `text-sm text-secondary-950 bg-white w-[213px]`,
          selectorButton: `text-secondary-400`,
          popoverContent: `border border-default-300`,
        }}
        listboxProps={{}}
      >
        <AutocompleteSection>
          {statuses.map((item) => (
            <AutocompleteItem
              key={item.id}
              className="data-[selected=true]:opacity-50"
            >
              {item.title}
            </AutocompleteItem>
          ))}
        </AutocompleteSection>
      </Autocomplete>
    </div>
  );
}
