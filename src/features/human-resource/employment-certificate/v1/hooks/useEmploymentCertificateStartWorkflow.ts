"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useCamunda } from "@/packages/camunda/hooks/useCamunda";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import type {
  EmploymentCertificateFormData,
  SwitchField,
  AutoFilledData,
  SwitchStates,
} from "../employment-certificate.types";
import { useGetLastProcessByNameQuery } from "@/services/commonApi/commonApi";
import {
  PROCESS_NAME,
  DEFAULT_FORM_VALUES,
  buildStartPayload,
} from "../utils/start-helpers";
import { toPersianDateOnly } from "@/utils/dateFormatter";
import { addToaster } from "@/ui/Toaster";

export function useEmploymentCertificateStartWorkflow() {
  const { startProcessWithPayload, isStartingProcess } = useCamunda();
  const { userDetail } = useAuth();
  const router = useRouter();
  const { data: processData, isLoading: isLoadingProcess } =
    useGetLastProcessByNameQuery(PROCESS_NAME);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
    getValues,
  } = useForm<EmploymentCertificateFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedValues = watch();

  const autoFilledData: AutoFilledData = useMemo(() => {
    const user = userDetail?.UserDetail;
    return {
      fullName: user?.FullName || "",
      fatherName: user?.FatherName || "",
      nationalCode: user?.NationalCode || "",
      jobPosition: user?.Title || "",
      mobile: user?.Mobile || "",
      startDate: toPersianDateOnly(user?.EmploymentDate),
    };
  }, [userDetail]);

  const switchStates: SwitchStates = useMemo(
    () => ({
      isNeedJobPosition: watchedValues.isNeedJobPosition,
      isNeedPhone: watchedValues.isNeedPhone,
      isNeedStartDate: watchedValues.isNeedStartDate,
      isNeedSalary: watchedValues.isNeedSalary,
    }),
    [
      watchedValues.isNeedJobPosition,
      watchedValues.isNeedPhone,
      watchedValues.isNeedStartDate,
      watchedValues.isNeedSalary,
    ],
  );

  const handleSwitchChange = useCallback(
    (field: SwitchField) => {
      setValue(field, !getValues(field));
    },
    [setValue, getValues],
  );

  const onSubmit = useCallback(
    async (data: EmploymentCertificateFormData) => {
      try {
        const payload = buildStartPayload(data, userDetail);

        await startProcessWithPayload(
          processData?.Data?.DefinitionId || "",
          payload,
          PROCESS_NAME,
        );

        router.push("/task-inbox/requests");
      } catch (error) {
        console.error(
          "Error submitting employment certificate request:",
          error,
        );
        addToaster({
          title: "خطا در ثبت درخواست. لطفا دوباره تلاش کنید.",
          color: "danger",
        });
      }
    },
    [
      userDetail,
      startProcessWithPayload,
      processData?.Data?.DefinitionId,
      router,
    ],
  );

  const isDeprecated = processData?.Data?.IsDeprecated;
  const processDefinitionId = processData?.Data?.DefinitionId;
  const isSubmitDisabled = isLoadingProcess || isStartingProcess;

  return {
    register,
    handleFormSubmit: handleSubmit(onSubmit),
    errors,
    control,
    watchedValues,
    autoFilledData,
    switchStates,
    handleSwitchChange,
    isStartingProcess,
    isDeprecated,
    processDefinitionId,
    isSubmitDisabled,
  };
}
