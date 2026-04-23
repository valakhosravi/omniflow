"use client";

import React from "react";
import RequestDescriptionSection from "./EmploymentCertificateRequestDescriptionSection";
import InformationSelectionSection from "./EmploymentCertificateInformationSelectionSection";
import AppDeprecatedProcessAlert from "@/components/common/AppDeprecatedProcessAlert/AppDeprecatedProcessAlert";
import { useEmploymentCertificateStartWorkflow } from "../hooks/useEmploymentCertificateStartWorkflow";
import AppStartProcessHeader from "@/components/common/AppStartProcessHeader";
import { AppButton } from "@/components/common/AppButton";

export default function EmploymentCertificatePageComponent() {
  const {
    register,
    handleFormSubmit,
    errors,
    autoFilledData,
    switchStates,
    handleSwitchChange,
    isStartingProcess,
    isDeprecated,
    processDefinitionId,
    isSubmitDisabled,
  } = useEmploymentCertificateStartWorkflow();

  return (
    <>
      <AppStartProcessHeader title="درخواست اشتغال به کار" />
      {isDeprecated === false && (
        <form onSubmit={handleFormSubmit} className="w-[1024px] max-w-[1024px] md:w-[1095px] md:max-w-[1095px] mx-auto">
          <div className="flex justify-center pb-6 w-full">
            <div className="w-full">
              <RequestDescriptionSection
                register={register}
                errors={errors}
                autoFilledData={autoFilledData}
              />
              <InformationSelectionSection
                switchStates={switchStates}
                onSwitchChange={handleSwitchChange}
              />
              <div className="flex justify-end mt-3">
                <AppButton
                  type="submit"
                  label={isStartingProcess ? "در حال ثبت..." : "ثبت درخواست"}
                  size="large"
                  disabled={isSubmitDisabled}
                  loading={isStartingProcess}
                />
              </div>
            </div>
          </div>
        </form>
      )}
      {isDeprecated === true && (
        <AppDeprecatedProcessAlert processDefinitionId={processDefinitionId} />
      )}
    </>
  );
}
