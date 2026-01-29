import { Dispatch, SetStateAction } from "react";
import ContractorDetails from "./ContractorDetails";
import ProjectsTable from "./ProjectsTable";
import { useGetContractorInfoQuery } from "../api/contractorApi";
import { useSearchParams } from "next/navigation";

export default function ContractorProjectsPage({
  searchTerm,
  onOpen,
  setEditId,
}: {
  searchTerm: string;
  onOpen: () => void;
  setEditId: Dispatch<SetStateAction<number | null>>;
}) {
  const searchParams = useSearchParams();
  const contractorId = searchParams.get("contractorId");
  const { data: contractorInfoData, isLoading: isGettingInfo } =
    useGetContractorInfoQuery(Number(contractorId)!, {
      skip: !contractorId || Number(contractorId) === 0,
    });

  return (
    <div className="space-y-[20px]">
      <ContractorDetails contractorInfoData={contractorInfoData} />
      <ProjectsTable
        searchTerm={searchTerm}
        onOpen={onOpen}
        setEditId={setEditId}
        contractorName={contractorInfoData?.Data?.Name}
      />
    </div>
  );
}
