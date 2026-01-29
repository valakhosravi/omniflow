import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@/ui/NextUi";
import { GetProcessTypesModel } from "../types/GetProcessTypesModel";
import { useTaskStore } from "@/store/tasksStore";

interface FilterDropDownProps {
  items: GetProcessTypesModel[];
}

export default function ProcessTypeDropDown({ items }: FilterDropDownProps) {
  const { processTypeId, setFilter } = useTaskStore();

  return (
    <div className="flex flex-col gap-y-1">
      <label>نوع درخواست</label>
      <Autocomplete
        placeholder="همه درخواست ها"
        variant="bordered"
        selectedKey={processTypeId ? processTypeId.toString() : null}
        onSelectionChange={(key) => {
          if (key === null || key === "") {
            setFilter("processTypeId", undefined);
          } else {
            setFilter("processTypeId", parseInt(key.toString(), 10));
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
          {items.map((item) => (
            <AutocompleteItem
              key={String(item.Id)}
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
