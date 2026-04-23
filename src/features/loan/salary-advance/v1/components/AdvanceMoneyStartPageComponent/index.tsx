"use client";

import React from "react";
import AdvanceMoneyHeader from "./AdvanceMoneyHeader";
import AdditionalInformationApplicant from "./AdditionalInformationApplicant";
import RequestDescription from "./RequestDescription";
import Loading from "@/ui/Loading";
import { CloseCircle } from "iconsax-reactjs";
import { useAdvanceMoneyStartPage } from "../../hooks/useAdvanceMoneyStartPage";

export default function AdvanceMoneyStartPageComponent() {
  const {
    validationResult,
    loanCapacity,
    unterminatedProcess,
    amountRatio,
    setSelectedAmountRatioId,
    capacityRule,
    durationRule,
    isLoading,
    errorMessage,
  } = useAdvanceMoneyStartPage();

  if (isLoading) {
    return <Loading />;
  }

  if (errorMessage) {
    return (
      <div className="flex justify-center">
        <div className="text-red-500 rounded-2xl p-4 border border-red-200 bg-red-100 flex gap-3 items-center">
          <CloseCircle size={32} />
          <div>{errorMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdvanceMoneyHeader />
      {loanCapacity?.Data === true ? (
        <div className="flex gap-x-4 items-start justify-center">
          <div className="w-[1093px] flex gap-x-4 items-start justify-center">
            <RequestDescription
              unterminatedProcess={unterminatedProcess?.Data}
              errors={validationResult?.errors || []}
              amountRatio={amountRatio?.Data}
              onAmountRatioChange={setSelectedAmountRatioId}
            />
            <div>
              {capacityRule?.Value && (
                <AdditionalInformationApplicant
                  employmentDurationThreshold={durationRule?.Value || 0}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="text-red-500 rounded-2xl p-4 border border-red-200 bg-red-100 flex gap-3 items-center">
            <CloseCircle size={32} />
            <div>ظرفیت درخواست مساعده در این ماه به پایان رسیده است.</div>
          </div>
        </div>
      )}
    </>
  );
}
