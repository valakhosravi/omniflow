import { Link } from "@/ui/NextUi";
import SelfDropDown from "./SelfDropDown";
import SupplierDropDown from "./SupplierDropDown";
import { Icon } from "@/ui/Icon";

const mealTypeOptions = [
  { name: "همه", id: 0 },
  { name: "غذای اصلی", id: 1 },
  //   { name: "پیش غذا", id: 2 },
  { name: "دسر", id: 3 },
  { name: "نوشیدنی", id: 4 },
];

export default function MealFilters({
  selected,
  onSelect,
  selectedSupplier,
  onSelectSupplier,
}: {
  selected: number;
  onSelect: (id: number) => void;
  selectedSupplier: string | null;
  onSelectSupplier: (supplier: string | null) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between pt-3 mb-8">
      <div className="flex items-center gap-x-4">
        {mealTypeOptions.map((type) => (
          <Link
            key={type.id}
            className={`cursor-pointer font-medium text-[12px]/[18px] 
         py-[7px] px-[20px] border rounded-[8px] gap-x-1
         flex items-center justify-center 
         ${
           selected === type.id
             ? "text-primary-950 bg-day-title border-secondary-300"
             : "text-secondary-500 bg-transparent border-secondary-200"
         }`}
            onPress={() => onSelect(type.id)}
          >
            {selected === type.id && (
              <Icon name="Ellipse" className="fill-primary-950 size-[5px]" />
            )}
            {type.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-center gap-x-2">
        <SelfDropDown />
        <SupplierDropDown
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={onSelectSupplier}
        />
      </div>
    </div>
  );
}
