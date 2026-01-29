"use client";
import { useState } from "react";
import DevelopmentTicketHeader from "../../development-ticket/components/v2/DevelopmentTicketHeader";
import ContractFilter from "../components/ContractFilter";
import SelectContract from "../components/SelectContract";
import Stepper from "../components/Stepper";
import ContractLayout from "../layouts/ContractLayout";
import { useDisclosure } from "@heroui/react";
import { useContractCategories } from "../hook/contractHook";

export default function ContractIndex() {
  const [selectedFilter, setSelectedFilter] = useState<number | "all" | "new">(
    "all"
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { categories, isLoading } = useContractCategories();

  return (
    <ContractLayout>
      <DevelopmentTicketHeader title="ایجاد قرارداد جدید" />
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
    </ContractLayout>
  );
}
