"use client";

import { useDispatch } from "react-redux";
import { useGetContractInfoByRequestIdQuery } from "../../contract.services";
import ContractHeader from "../shared/ContractHeader";
import CompletingContractEntriesNonTypeByRequestId from "../edit-review/CompletingContractEntriesNonTypeByRequestId";
import CompletingContractEntriesByRequestId from "../type/CompletingContractEntriesByRequestId";
import { setContractData } from "../../contract.slices";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";

function ContractEditReviewPageComponent() {
  const searchParams = useSearchParams();
  const requestId = Number(searchParams.get("requestId")) ?? 0;
  const taskId = searchParams.get("taskId") ?? "";

  const dispatch = useDispatch();

  const { data: contractInfo, isLoading } = useGetContractInfoByRequestIdQuery(
    requestId,
    { skip: requestId === 0 },
  );

  useEffect(() => {
    if (taskId !== undefined) {
      dispatch(setContractData(contractInfo?.Data));
    }
  }, [contractInfo, dispatch, taskId]);

  return (
    <>
      <ContractHeader title="ایجاد قرارداد جدید" requestId={requestId} />
      {contractInfo?.Data?.IsType ? (
        <div className="flex flex-col items-center justify-start gap-y-8 mb-5">
          {/* <Stepper state={2} /> */}
          <CompletingContractEntriesByRequestId
            contractInfo={contractInfo}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-start gap-y-8">
          {/* <Stepper state={2} /> */}
          <CompletingContractEntriesNonTypeByRequestId
            contractInfo={contractInfo?.Data}
            isLoading={isLoading}
            requestId={requestId.toString()}
          />
        </div>
      )}
    </>
  );
}

export default AppWithTaskInboxSidebar(ContractEditReviewPageComponent);
