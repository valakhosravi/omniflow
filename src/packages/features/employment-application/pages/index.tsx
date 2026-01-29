"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import EmploymentApplicationLayout from "../layouts";
import EmploymentApplicationHeader from "../components/EmploymentApplicationHeader";
import RequestDescriptionSection from "../components/RequestDescriptionSection";
import InformationSelectionSection from "../components/InformationSelectionSection";
import { Button } from "@heroui/react";
import { useCamunda } from "@/packages/camunda/hooks/useCamunda";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import useGetProcessByNameAndVersion from "@/hooks/process/useGetProcessByNameAndVersion";
import { CloseCircle } from "iconsax-reactjs";

// Update the form interface to match the actual field names
interface EmploymentApplicationFormData {
  ReceiverOrganization: string;
  ForReason: string;
  Language: string;
  isNeedJobPosition: boolean;
  isNeedPhone: boolean;
  isNeedStartDate: boolean;
  isNeedSalary: boolean;
}

export default function EmploymentApplicationPageCmp() {
  const processName = "EmpolymentCertificate";
  const { startProcessWithPayload, isStartingProcess } = useCamunda();
  const { userDetail } = useAuth();
  const router = useRouter();
  const {
    data: processData,
    error,
    isLoading: isLoadingProcess,
  } = useGetProcessByNameAndVersion(processName);

  // Form state for switches - initialize to match form default values
  const [switchStates, setSwitchStates] = useState({
    isNeedJobPosition: true,
    isNeedPhone: true,
    isNeedStartDate: true,
    isNeedSalary: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm<EmploymentApplicationFormData>({
    defaultValues: {
      ReceiverOrganization: "",
      ForReason: "",
      Language: "fa",
      isNeedJobPosition: true,
      isNeedPhone: true,
      isNeedStartDate: true,
      isNeedSalary: false,
    },
  });

  const watchedValues = watch();
  const receiverOrganization = watch("ReceiverOrganization");

  const handleSwitchChange = (field: keyof typeof switchStates) => {
    const newValue = !switchStates[field];
    setSwitchStates((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    // Also update the form value
    setValue(field, newValue);
  };

  const onSubmit = async (data: EmploymentApplicationFormData) => {
    try {
      // Now data will include all form values including switches
      const payload = {
        ReceiverOrganization: data.ReceiverOrganization,
        PersonnelId: userDetail?.UserDetail?.PersonnelId || "",
        Title: "درخواست گواهی اشتغال به کار",
        JobPosition: data.isNeedJobPosition
          ? userDetail?.UserDetail?.Title || ""
          : "",
        FullName: userDetail?.UserDetail?.FullName || "",
        FatherName: userDetail?.UserDetail?.FatherName || "",
        NationalCode: userDetail?.UserDetail?.NationalCode || "",
        StartDate: data.isNeedStartDate
          ? userDetail?.UserDetail?.EmploymentDate
            ? new Date(userDetail?.UserDetail?.EmploymentDate)
                .toLocaleString("fa-IR")
                .split(", ")[0]
            : ""
          : "",
        EmployeeMobileNumber: data.isNeedPhone
          ? userDetail?.UserDetail?.Mobile || ""
          : "",
        ForReason: data.ForReason || "-",
        Language: data.Language,
        IsNeedSalary: data.isNeedSalary,
        IsNeedJobPosition: data.isNeedJobPosition,
        IsNeedPhone: data.isNeedPhone,
        IsNeedStartDate: data.isNeedStartDate,
      };

      // Start the Camunda process
      await startProcessWithPayload(
        processData?.Data?.DefinitionId || "",
        payload
      );

      // Redirect to task inbox or show success message
      router.push("/task-inbox/requests");
    } catch (error) {
      console.error("Error submitting employment application:", error);
    }
  };

  const handleHistoryClick = () => {
    // Navigate to employment application history page
    router.push("/employment-application/history");
  };

  return (
    <EmploymentApplicationLayout>
      <EmploymentApplicationHeader onButtonClick={handleHistoryClick} />
      {processData?.Data?.IsDeprecated === false && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[1024px] md:max-w-[1095px] w-[1024px] md:w-[1095px] mx-auto"
        >
          <div className="flex justify-center mb-[80px] w-full">
            <div className="w-full">
              <RequestDescriptionSection
                register={register}
                errors={errors}
                watchedValues={watchedValues}
                control={control}
              />
              <InformationSelectionSection
                switchStates={switchStates}
                onSwitchChange={handleSwitchChange}
              />
              <div className="flex justify-end mt-[12px]">
                <Button
                  isDisabled={isLoadingProcess || !receiverOrganization?.trim()}
                  type="submit"
                  className="btn-primary"
                  size="lg"
                  isLoading={isStartingProcess}
                  disabled={isStartingProcess || !receiverOrganization?.trim()}
                  data-cy="employment-certificate-submit-button"
                >
                  {isStartingProcess ? "در حال ثبت..." : "ثبت درخواست"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
      {processData?.Data?.IsDeprecated === true && (
        <div className="flex justify-center mb-[80px]">
          <div className="text-red-500 rounded-2xl p-4 border border-red-200 bg-red-100 flex gap-3 items-center">
            <div>
              <CloseCircle size={32} />
            </div>
            <div>
              <div className="mb-2">این فرایند منسوخ شده است</div>
              <div className="text-xs text-red-500">
                شناسه فرایند: {processData?.Data?.DefinitionId}
              </div>
            </div>
          </div>
          <div></div>
        </div>
      )}
    </EmploymentApplicationLayout>
  );
}
