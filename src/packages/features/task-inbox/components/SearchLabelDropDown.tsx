import { LabelType } from "@/packages/features/task-inbox/types/labelType";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "../../../../ui/NextUi";
import { useTaskStore } from "@/store/tasksStore";

interface FilterDropDownProps {
  items: LabelType[];
}

export default function SearchLabelDropDown({ items }: FilterDropDownProps) {
  const { labelId, setFilter } = useTaskStore();
  return (
    <div className="flex flex-col gap-y-1">
      <label>برچسب</label>
      <Autocomplete
        placeholder="همه برچسب ها"
        variant="bordered"
        selectedKey={labelId ? labelId.toString() : null}
        onSelectionChange={(key) => {
          if (key === null || key === "") {
            setFilter("labelId", undefined);
          } else {
            setFilter("labelId", parseInt(key.toString()));
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
          {items.map((item: LabelType) => (
            <AutocompleteItem
              key={item.LabelId}
              className="data-[selected=true]:opacity-50"
            >
              {item.Name}
            </AutocompleteItem>
          ))}
        </AutocompleteSection>
      </Autocomplete>
    </div>
  );
}
