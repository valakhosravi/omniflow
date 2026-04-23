"use client";

import React, { useEffect } from "react";
import Loading from "@/ui/Loading";
import { useGetContractInfoByRequestIdQuery } from "../../contract.services";
import { useGetLastRequestStatusQuery } from "@/services/commonApi/commonApi";
import { useSearchParams } from "next/navigation";
import LmcNonTypeFormReadOnly from "../forms/LmcNonTypeFormReadOnly";
import LmcTypeForm from "../forms/LmcTypeForm";
import { useDispatch } from "react-redux";
import { setRequestId } from "../../contract.slices";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";

function ContractDeputyReviewAssignPageComponent() {
  const searchParams = useSearchParams();
  const requestId = Number(searchParams.get("requestId")) ?? 0;
  const taskId = searchParams.get("taskId") ?? "";

  const dispatch = useDispatch();
  const {
    data,
    isLoading,
    error,
    refetch: refetchContract,
  } = useGetContractInfoByRequestIdQuery(requestId);
  const { data: requestStatus, refetch } = useGetLastRequestStatusQuery(
    requestId,
    {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    if (requestId !== 0) {
      dispatch(setRequestId(requestId.toString()));
    }
  }, [dispatch, requestId]);

  if (isLoading) {
    return (
      <>
        <div className="h-[calc(100%-105px)]">
          <Loading />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="h-[calc(100%-105px)] flex items-center justify-center">
          <p className="text-red-500">خطا در بارگذاری اطلاعات قرارداد</p>
        </div>
      </>
    );
  }

  if (!data?.Data) {
    return (
      <>
        <div className="h-[calc(100%-105px)] flex items-center justify-center">
          <p>اطلاعات قرارداد یافت نشد</p>
        </div>
      </>
    );
  }

  const contractData = data.Data;
  const isType = contractData.IsType === true;

  return (
    <>
      <div className="h-[calc(100%-105px)]">
        {isType ? (
          <LmcTypeForm
            contractData={contractData}
            requestStatus={requestStatus?.Data}
            taskId={taskId.toString()}
            onRefetch={refetch}
          />
        ) : (
          <LmcNonTypeFormReadOnly
            contractData={contractData}
            requestStatus={requestStatus?.Data}
            onRefetch={refetchContract}
            requestId={requestId.toString()}
            taskId={taskId.toString()}
          />
        )}
      </div>
    </>
  );
}

export default AppWithTaskInboxSidebar(ContractDeputyReviewAssignPageComponent);
