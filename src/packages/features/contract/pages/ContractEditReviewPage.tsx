import { useDispatch } from "react-redux";
import { useGetContractInfoByRequestIdQuery } from "../api/contractApi";
import ContractHeader from "../components/ContractHeader";
import CompletingContractEntriesNonTypeByRequestId from "../components/edit-review/CompletingContractEntriesNonTypeByRequestId";
import Stepper from "../components/Stepper";
import CompletingContractEntriesByRequestId from "../components/type/CompletingContractEntriesByRequestId";
import ContractLayout from "../layouts/ContractLayout";
import { setContractData } from "../slice/NonTypeContractDataSlice";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ContractEditReviewPage({
  formKey,
  requestId,
}: {
  formKey: string;
  requestId: string;
}) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const { data: contractInfo, isLoading } = useGetContractInfoByRequestIdQuery(
    Number(requestId),
    { skip: Number(requestId) === 0 }
  );

  useEffect(() => {
    if (taskId) {
      dispatch(setContractData(contractInfo?.Data));
    }
  }, [contractInfo, dispatch, taskId]);

  return (
    <ContractLayout>
      <ContractHeader
        title="ایجاد قرارداد جدید"
        requestId={Number(requestId)}
      />
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
            requestId={requestId}
          />
        </div>
      )}
    </ContractLayout>
  );
}
