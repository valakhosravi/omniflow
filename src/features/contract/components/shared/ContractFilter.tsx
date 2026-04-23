import { Skeleton } from "@/ui/NextUi";
import { Dispatch, SetStateAction } from "react";
import { Category } from "../../contract.types";

interface ContractFilterProps {
  setSelectedFilter: Dispatch<SetStateAction<number | "all" | "new">>;
  selectedFilter: number | "all" | "new";
  onOpen: () => void;
  categories: Category[];
  isLoading: boolean;
}

export default function ContractFilter({
  selectedFilter,
  setSelectedFilter,
  categories,
  isLoading,
}: ContractFilterProps) {
  return (
    <>
      {isLoading ? (
        <div className="flex flex-wrap gap-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[42px] w-[100px] rounded-[20px]" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-3 py-[8.5px] border rounded-[20px] font-semibold text-[14px]/[23px] cursor-pointer
              ${
                selectedFilter === "all"
                  ? "bg-back-list text-primary-950 border-primary-950/[.2]"
                  : "bg-transparent text-primary-950/[.6] border-primary-950/[.1]"
              }`}
            onClick={() => setSelectedFilter("all")}
          >
            همه
          </button>
          {categories.map((category) => (
            <button
              key={category.CategoryId}
              className={`px-3 py-[8.5px] border rounded-[20px] font-semibold text-[14px]/[23px] cursor-pointer
              ${
                selectedFilter === category.CategoryId
                  ? "bg-back-list text-primary-950 border-primary-950/[.2]"
                  : "bg-transparent text-primary-950/[.6] border-primary-950/[.1]"
              }`}
              onClick={() => setSelectedFilter(category.CategoryId)}
            >
              {category.Name}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
