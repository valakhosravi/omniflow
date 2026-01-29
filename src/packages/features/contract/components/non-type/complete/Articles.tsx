"use client";
import CustomButton from "@/ui/Button";
import { Add } from "iconsax-reactjs";
import MaterialItem from "./MaterialItem";
import { useDisclosure } from "@heroui/react";
import ClauseTitle from "./ClauseTitleModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { normalizeContractClause } from "../../../utils/normalizeContractClause ";
import { useEffect } from "react";
import { setClauses } from "../../../slice/NonTypeContractDataSlice";
import { useSearchParams } from "next/navigation";

export default function Articles() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { clauses, contractData } = useSelector(
    (state: RootState) => state.nonTypeContractData
  );

  useEffect(() => {
    if (taskId && contractData?.ContractClauses) {
      if (clauses.length === 0) {
        const normalized = contractData.ContractClauses.map((c, idx) => ({
          ...normalizeContractClause(c, idx + 1),
          clauseIndex: idx + 1,
        }));
        dispatch(setClauses(normalized));
      }
    }

    if (!taskId) {
      if (clauses.length === 0) {
        dispatch(setClauses([]));
      }
    }
  }, [contractData, taskId, clauses.length, dispatch]);

  return (
    <>
      <div className="w-[364px] border border-primary-950/[.1] rounded-[20px] p-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[20px]/[28px] text-primary-950">
            ماده‌ها
          </h1>
          <CustomButton
            buttonSize="sm"
            buttonVariant="outline"
            startContent={<Add className="size-5 text-primary-950" />}
            className="font-semibold"
            onPress={onOpen}
          >
            افزودن ماده
          </CustomButton>
        </div>
        <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-[24px]" />
        <div className="flex flex-col justify-center items-center space-y-4">
          {clauses.map((clause) => (
            <MaterialItem
              clause={clause}
              key={`clause-${clause.clauseIndex}`}
            />
          ))}
        </div>
      </div>
      <ClauseTitle isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
