"use client";
import { RadioGroup, Switch, Textarea } from "@/ui/NextUi";
import RadioItem from "./RadioItem";
import CustomButton from "@/ui/Button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AmountRatio } from "@/models/advance-money/AmountRatio";
import WarningBadge from "@/ui/WarningBadge";
import { useState, useEffect } from "react";
import { RuleError } from "../util/ruleEngine";
import { useCamunda } from "@/packages/camunda/hooks/useCamunda";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { UnterminatedProcess } from "@/models/advance-money/UnterminatedProcess";
import useGetProcessByNameAndVersion from "@/hooks/process/useGetProcessByNameAndVersion";
import { Alert } from "@heroui/react";

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
  const { data: processByNameAndVersion } = useGetProcessByNameAndVersion(
    "SalaryAdvanceRequest"
  );
  const { handleSubmit, register, watch, setValue } =
    useForm<AdvanceMoneyFormData>();
  const [isSpecialConditions, setIsSpecialConditions] = useState(false);
  const { startProcessWithPayload, isStartingProcess } = useCamunda();

  const selectedAmount = watch("amount");

  // Notify parent component when amount ratio changes
  useEffect(() => {
    if (selectedAmount && amountRatio) {
      // Parse the selectedAmount to extract AmountRatio and RepaymentMonth
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
          <h1 className="text-primary-950 font-medium text-[20px]/[28px]">
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
              title={`(${(
                radio.Ratio * 100
              ).toString()}%) حقوق پایه حکمی`}
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
              در صورت تایید مدیر سرمایه انسانی، امکان بررسی این درخواست وجود دارد.
            </div>
          </div>
        )}
        <div className="mb-[10px] mt-[24px]">
          <span className="text-primary-950 font-medium text-[14px]/[27px]">
            توضیحات
          </span>
          <span className="text-[#8F94A1] font-normal text-[14px]/[20px] ms-1">
            (اختیاری)
          </span>
        </div>
        <Textarea
          {...register("description")}
          placeholder="لطفا توضیحات مبنی بر درخواست مساعده ارائه دهید."
          fullWidth={true}
          type="text"
          variant="bordered"
          classNames={{
            inputWrapper: "border border-secondary-950/[.2] rounded-[16px]",
            input: "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
          }}
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
