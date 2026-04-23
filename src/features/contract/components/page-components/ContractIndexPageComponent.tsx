"use client";
import { useState } from "react";
import ContractFilter from "../shared/ContractFilter";
import SelectContract from "../shared/SelectContract";
import { useDisclosure } from "@heroui/react";
import { useContractCategories } from "../../hook/contractHook";
import StartProcessHeader from "@/components/common/AppStartProcessHeader";

export default function ContractIndexPageComponent() {
  const [selectedFilter, setSelectedFilter] = useState<number | "all" | "new">(
    "all",
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { categories, isLoading } = useContractCategories();

  return (
    <>
      <StartProcessHeader title="ایجاد قرارداد جدید" />
      <div className="flex flex-col items-center justify-start gap-y-8">
        {/* <Stepper state={1} /> */}
        <ContractFilter
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          onOpen={onOpen}
          categories={categories}
          isLoading={isLoading}
        />
        <SelectContract
          selectedFilter={selectedFilter}
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          categories={categories}
        />
      </div>
    </>
  );
}
