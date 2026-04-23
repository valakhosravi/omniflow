import { Button } from "@heroui/react";
import { Add } from "iconsax-reactjs";
import { Library } from "../../../contract.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  addTerm,
  setActiveTerm,
  updateTermDescription,
} from "../../../contract.slices";
import { addToaster } from "@/ui/Toaster";

interface ReadyClauseItemModel {
  libraries: Library[];
}

export default function ReadyClauseItem({ libraries }: ReadyClauseItemModel) {
  const dispatch = useDispatch();
  const { activeClause, clauses } = useSelector(
    (state: RootState) => state.nonTypeContractData
  );
  const handleAddTerm = (description: string) => {
    if (!activeClause) {
      addToaster({
        title: "ماده مورد نظر را برای اضافه شدن این بند انتخاب کنید.",
        color: "warning",
      });
      return;
    }

    dispatch(addTerm({ clauseIndex: activeClause }));

    const clause = clauses.find((c) => c.clauseIndex === activeClause);
    if (!clause) return;

    const newTermNumber = `${clause.clauseIndex}.${clause.terms.length + 1}`;

    dispatch(setActiveTerm(newTermNumber));

    dispatch(
      updateTermDescription({
        clauseIndex: activeClause,
        termNumber: newTermNumber,
        description: description,
      })
    );
  };

  return (
    <div className="w-full space-y-8">
      {libraries.map((library, index) => (
        <div className="space-y-2" key={index}>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col font-medium">
              <h3 className="text-[20px]/[28px] text-primary-950">
                {library.Title}
              </h3>
            </div>
            <Button
              size="sm"
              variant="bordered"
              startContent={<Add className="size-[20px] text-primary-950" />}
              className="border border-[#26272B]/[.2] rounded-[12px] text-primary-950 font-semibold
              text-[14px]/[23px] px-[9px] py-[8.5px] gap-x-[8px]"
              onPress={() => handleAddTerm(library.Description)}
            >
              افزودن
            </Button>
          </div>
          <p className="font-medium text-[14px]/[23px] text-primary-950/[.5]">
            {library.Description}
          </p>
        </div>
      ))}
    </div>
  );
}
