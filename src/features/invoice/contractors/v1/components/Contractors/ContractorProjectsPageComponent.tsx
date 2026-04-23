"use client";

import ContractorDetails from "../ContractorDetails";
import ProjectsTable from "../ProjectsTable";
import { useGetContractorInfoQuery } from "../../contractor.services";
import { useSearchParams } from "next/navigation";
import AddContractorProjectModal from "./AddContractorProjectModal";
import { AppButton } from "@/components/common/AppButton";
import { useState } from "react";

export default function ContractorProjectsPageComponent() {
  const searchParams = useSearchParams();
  const contractorId = searchParams.get("contractorId");
  const { data: contractorInfoData } = useGetContractorInfoQuery(
    Number(contractorId)!,
    {
      skip: !contractorId || Number(contractorId) === 0,
    },
  );

  const [open, setOpen] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string>("");

  const handleAdd = () => {
    setProjectId("");
    setOpen(true);
  };

  return (
    <div className=" container mx-auto mt-6 space-y-[20px]">
      <ContractorDetails contractorInfoData={contractorInfoData} />
      {contractorInfoData?.Data && (
        <ProjectsTable
          contractorName={contractorInfoData?.Data?.Name}
          openEdit={(id: string) => {
            setProjectId(id);
            setOpen(true);
          }}
        />
      )}
      <AppButton
        label="افزودن پروژه"
        key="add-contractor"
        icon={"Add"}
        iconPos="left"
        onClick={() => handleAdd()}
      />

      {open && (
        <AddContractorProjectModal
          isOpen={open}
          editId={projectId}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
