import React, { useEffect } from "react";
import TaskInboxLayout from "../../task-inbox/layouts";
import Loading from "@/ui/Loading";
import { useGetContractInfoByRequestIdQuery } from "../api/contractApi";
import { useRequestStatus } from "../../task-inbox/hooks/useRequestStatus";
import { useSearchParams } from "next/navigation";
import LmcNonTypeForm from "./LmcNonTypeForm";
import LmcTypeForm from "./LmcTypeForm";
import { useDispatch } from "react-redux";
import { setRequestId } from "../slice/LmcDataSlice";

export default function ContractLmcReviewPage({
  formKey,
  requestId,
}: {
  formKey: string;
  requestId: string;
}) {
  const dispatch = useDispatch();
  const {
    data,
    isLoading,
    error,
    refetch: refetchContract,
  } = useGetContractInfoByRequestIdQuery(Number(requestId), {
    skip: Number(requestId) === 0,
  });
  const { requestStatus, refetch } = useRequestStatus({
    requestId: Number(requestId),
  });
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  useEffect(() => {
    if (requestId) {
      dispatch(setRequestId(requestId));
    }
  }, [dispatch, requestId]);

  if (isLoading) {
    return (
      <TaskInboxLayout>
        <div className="h-[calc(100%-105px)]">
          <Loading />
        </div>
      </TaskInboxLayout>
    );
  }

  if (error) {
    return (
      <TaskInboxLayout>
        <div className="h-[calc(100%-105px)] flex items-center justify-center">
          <p className="text-red-500">خطا در بارگذاری اطلاعات قرارداد</p>
        </div>
      </TaskInboxLayout>
    );
  }

  if (!data?.Data) {
    return (
      <TaskInboxLayout>
        <div className="h-[calc(100%-105px)] flex items-center justify-center">
          <p>اطلاعات قرارداد یافت نشد</p>
        </div>
      </TaskInboxLayout>
    );
  }

  const contractData = data.Data;
  const isType = contractData.IsType === true;

  return (
    <TaskInboxLayout>
      <div className="h-[calc(100%-105px)]">
        {isType ? (
          <LmcTypeForm
            contractData={contractData}
            requestStatus={requestStatus}
            taskId={taskId}
            onRefetch={refetch}
            requestId={requestId}
          />
        ) : (
          <LmcNonTypeForm
            contractData={contractData}
            requestStatus={requestStatus}
            onRefetch={refetchContract}
            requestId={requestId}
          />
        )}
      </div>
    </TaskInboxLayout>
  );
}
