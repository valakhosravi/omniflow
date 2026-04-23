"use client";
import { RadioGroup, Switch } from "@/ui/NextUi";
import AppTextArea from "@/components/common/AppTextArea";
import RadioItem from "./RadioItem";
import CustomButton from "@/ui/Button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AmountRatio, RuleError, UnterminatedProcess } from "../../salary-advance.types";
import WarningBadge from "@/ui/WarningBadge";
import { useState, useEffect } from "react";
import { useCamunda } from "@/packages/camunda/hooks/useCamunda";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { Alert } from "@heroui/react";
import useGetLastProcessByName from "@/hooks/process/useGetLastProcessByName";

interface AdvanceMoneyFormData {
  amount: string;
  description?: string;
}

export default function RequestDescription({
  amountRatio,
  errors,
  unterminatedProcess,
  onAmountRatioChange,
}: {
  amountRatio?: AmountRatio[];
  errors: RuleError[];
  unterminatedProcess?: UnterminatedProcess;
  onAmountRatioChange?: (amountRatioId: number) => void;
}) {
  const router = useRouter();
  const { userDetail } = useAuth();
  const { data: processByNameAndVersion } = useGetLastProcessByName(
    "SalaryAdvanceRequest"
  );
  const { handleSubmit, register, watch, setValue } =
    useForm<AdvanceMoneyFormData>();
  const [isSpecialConditions, setIsSpecialConditions] = useState(false);
  const { startProcessWithPayload, isStartingProcess } = useCamunda();

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedAmount = watch("amount");

  useEffect(() => {
    if (selectedAmount && amountRatio) {
      const [amountRatioValue, repaymentMonth] = selectedAmount.split("-");

      const selectedRatio = amountRatio.find(
        (ratio) =>
          ratio.Ratio.toString() === amountRatioValue &&
          ratio.RepaymentMonth.toString() === repaymentMonth
      );

      if (selectedRatio && onAmountRatioChange) {
        onAmountRatioChange(selectedRatio.AmountRatioId);
      }
    }
  }, [selectedAmount, amountRatio, onAmountRatioChange]);

  const onSubmit = async (data: AdvanceMoneyFormData) => {
    try {
      if (!userDetail?.UserDetail.PersonnelId) {
        return;
      }

      if (!selectedAmount) {
        return;
      }

      const [selectedAmountRatio, selectedRepaymentMonth] =
        selectedAmount.split("-");
      const amountRatioId = amountRatio?.find(
        (ratio) =>
          ratio.Ratio.toString() === selectedAmountRatio &&
          ratio.RepaymentMonth.toString() === selectedRepaymentMonth
      )?.AmountRatioId;

      if (!amountRatioId) {
        return;
      }

      const processData = {
        PersonnelId: userDetail.UserDetail.PersonnelId,
        Title: `درخواست مساعده - ${(
          parseFloat(selectedAmountRatio) * 100
        ).toString()}% حقوق پایه حکمی`,
        EmployeeMobileNumber: userDetail.UserDetail.Mobile,
        IsStandard: !isSpecialConditions,
        AmountRatioId: amountRatioId,
        Description: data.description || "",
      };

      await startProcessWithPayload(
        processByNameAndVersion?.Data?.DefinitionId || "",
        processData
      );

      router.push("/task-inbox/requests");
    } catch (error) {
      console.error("Error starting salary advance process:", error);
    }
  };

  return (
    <form
      className="flex flex-col space-y-[12px] mb-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      {unterminatedProcess && (
        <Alert
          color="danger"
          description={`شما یک درخواست مساعده در حال پردازش دارید.`}
          variant="faded"
        />
      )}
      <div className="p-[20px] border border-secondary-200 rounded-[20px] space-y-4">
        <div className="space-y-1">
          <h1 className="text-primary-950 font-medium text-[16px]">
            شرح درخواست
          </h1>
          <p className="text-secondary-400 font-medium text-[14px]/[27px]">
            لطفا مقداری که برای مساعده میخواهید دریافت کنید را انتخاب کنید.
          </p>
        </div>
        <RadioGroup
          classNames={{
            wrapper: `grid grid-cols-2 gap-[20px] items-center justify-center w-full`,
          }}
          className="mb-[24px]"
          value={selectedAmount}
          onValueChange={(value) => setValue("amount", value)}
        >
          {amountRatio?.map((radio, index) => (
            <RadioItem
              ratio={radio.Ratio}
              key={index}
              title={`(${(radio.Ratio * 100).toString()}%) حقوق پایه حکمی`}
              description={`● بازپرداخت در اقساط ${radio.RepaymentMonth} ماهه`}
              subDescription={`● امکان درخواست حداکثر ${radio.MaxLoansPerMonth} بار در سال`}
              value={`${radio.Ratio}-${radio.RepaymentMonth}`}
            />
          ))}
        </RadioGroup>

        {errors?.length > 0 && (
          <div className="bg-[#EEEEF0] rounded-[20px] p-[20px]">
            {!isSpecialConditions ? (
              <WarningBadge
                className="w-full text-[12px] !p-2 mb-3"
                message="واجد شرایط دریافت مساعده نیستید."
              />
            ) : (
              <WarningBadge
                className="w-full text-[12px] !p-2 mb-3"
                message="واجد شرایط دریافت مساعده با شرایط خاص هستید."
                variant="success"
              />
            )}
            {errors?.map((error, index) => (
              <div key={index} className="text-[12px] text-[#8F94A1] mb-4">
                {error.message}
              </div>
            ))}
            <div className="flex justify-between">
              <div className="text-[14px] text-[#1C3A63]">
                دارای شرایط خاص هستم.
              </div>
              <Switch
                isSelected={isSpecialConditions}
                onValueChange={() =>
                  setIsSpecialConditions(!isSpecialConditions)
                }
              />
            </div>
            <div className="text-[12px] text-[#8F94A1]">
              در صورت تایید مدیر سرمایه انسانی، امکان بررسی این درخواست وجود
              دارد.
            </div>
          </div>
        )}
        <AppTextArea
          {...register("description")}
          label="توضیحات (اختیاری)"
        />
      </div>
      {!unterminatedProcess && (
        <CustomButton
          buttonVariant="primary"
          buttonSize="md"
          className="font-semibold text-[14px]/[35px] self-end xl:w-[93px]"
          type="submit"
          disabled={
            (errors?.length > 0 && !isSpecialConditions) || isStartingProcess
          }
          isLoading={isStartingProcess}
        >
          ارسال
        </CustomButton>
      )}
    </form>
  );
}
