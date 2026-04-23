"use client";

import React, { useEffect } from "react";
import Loading from "@/ui/Loading";
import { useGetContractInfoByRequestIdQuery } from "../../contract.services";
import { useGetLastRequestStatusQuery } from "@/services/commonApi/commonApi";
import { useSearchParams } from "next/navigation";
import LmcNonTypeForm from "../forms/LmcNonTypeForm";
import LmcTypeForm from "../forms/LmcTypeForm";
import { useDispatch } from "react-redux";
import { setRequestId } from "../../contract.slices";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";

function ContractLmcReviewPageComponent() {
  const searchParams = useSearchParams();
  const requestId = Number(searchParams.get("requestId")) ?? 0;
  const taskId = searchParams.get("taskId") ?? "";

  const dispatch = useDispatch();
  const {
    data,
    isLoading,
    error,
    refetch: refetchContract,
  } = useGetContractInfoByRequestIdQuery(requestId, {
    skip: Number(requestId) === 0,
  });
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
            requestId={requestId.toString()}
          />
        ) : (
          <LmcNonTypeForm
            contractData={contractData}
            requestStatus={requestStatus?.Data}
            onRefetch={refetchContract}
            taskId={taskId.toString()}
            requestId={requestId.toString()}
          />
        )}
      </div>
    </>
  );
}

export default AppWithTaskInboxSidebar(ContractLmcReviewPageComponent);