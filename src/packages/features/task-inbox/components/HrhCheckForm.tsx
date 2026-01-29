"use client";
import { LoanRequestDetails } from "@/models/advance-money/LoanRequestDetails";
import { formatNumberWithCommas, removeCommas } from "@/utils/formatNumber";
import { Button, Input, Textarea } from "@heroui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  amount: string;
  ibanNumber: string;
  description: string;
};

interface HrhCheckFormProps {
  isTaskAlreadyClaimed: boolean;
  isTaskClaimed: boolean;
  handleClaimTask: () => Promise<void>;
  onRejectRequestClick: () => Promise<void>;
  isRejectingRequest: boolean;
  isAcceptingRequest: boolean;
  isCompletingTask: boolean;
  onCompleteRequestClick: () => Promise<void>;
  onSendToHRMRequestClick: () => Promise<void>;
  loanRequestDetails: LoanRequestDetails | undefined;
  claimError: string | null;
  isClaimingTask: boolean;
  hrRejectDescriptionError: boolean;
  amount: string;
  setAmount: (val: string) => void;
  ibanNumber: string;
  setIbanNumber: (val: string) => void;
  hrRejectDescription: string;
  setHrRejectDescription: (val: string) => void;
}

export default function HrhCheckForm({
  isTaskAlreadyClaimed,
  isTaskClaimed,
  handleClaimTask,
  onRejectRequestClick,
  isRejectingRequest,
  isAcceptingRequest,
  isCompletingTask,
  onCompleteRequestClick,
  onSendToHRMRequestClick,
  loanRequestDetails,
  isClaimingTask,
  claimError,
  hrRejectDescriptionError,
  amount,
  hrRejectDescription,
  ibanNumber,
  setAmount,
  setHrRejectDescription,
  setIbanNumber,
}: HrhCheckFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    clearErrors,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      amount: amount || "",
      ibanNumber: ibanNumber || "",
      description: hrRejectDescription || "",
    },
  });

  const formAmount = watch("amount");
  const formIbanNumber = watch("ibanNumber");
  const formDescription = watch("description");

  useEffect(() => {
    setAmount(formAmount);
  }, [formAmount, setAmount]);

  useEffect(() => {
    setIbanNumber(formIbanNumber);
  }, [formIbanNumber, setIbanNumber]);

  useEffect(() => {
    setHrRejectDescription(formDescription);
  }, [formDescription, setHrRejectDescription]);

  useEffect(() => {
    if (loanRequestDetails) {
      reset({
        amount: loanRequestDetails.Amount
          ? formatNumberWithCommas(String(loanRequestDetails.Amount))
          : "",
        ibanNumber: loanRequestDetails.Destination ?? "",
        description: hrRejectDescription ?? "",
      });

      setAmount(
        loanRequestDetails.Amount
          ? formatNumberWithCommas(String(loanRequestDetails.Amount))
          : ""
      );
      setIbanNumber(loanRequestDetails.Destination ?? "");
    }
  }, [
    loanRequestDetails,
    reset,
    setAmount,
    setIbanNumber,
    hrRejectDescription,
  ]);

  const handleReject = async () => {
    clearErrors();

    const isDescriptionValid = await trigger("description");

    if (isDescriptionValid) {
      setAmount(formAmount);
      setIbanNumber(formIbanNumber);
      setHrRejectDescription(formDescription);

      await onRejectRequestClick();
    }
  };

  const handleAcceptOrComplete = async () => {
    clearErrors();

    const isValid = await trigger(["amount", "ibanNumber"]);

    setAmount(formAmount);
    setIbanNumber(formIbanNumber);
    setHrRejectDescription(formDescription);

    if (isValid) {
      if (loanRequestDetails?.IsStandard) {
        await onCompleteRequestClick();
      } else {
        await onSendToHRMRequestClick();
      }
    }
  };

  if (!isTaskAlreadyClaimed && !isTaskClaimed) {
    return (
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="solid"
          className="bg-[#1C3A63] text-white rounded-[12px]"
          size="md"
          onPress={handleClaimTask}
          isLoading={isClaimingTask}
          disabled={isClaimingTask}
        >
          {isClaimingTask ? "در حال دریافت وظیفه..." : "دریافت وظیفه"}
        </Button>
        {claimError && (
          <span className="text-red-500 text-sm">{claimError}</span>
        )}
      </div>
    );
  }
  return (
    <>
      <div className="border border-[#D8D9DF] p-4 rounded-[20px] mb-4 mt-4">
        <div className="mb-4">
          <div className="text-[14px] mb-[10px]">مبلغ (ریال)</div>
          <Input
            {...register("amount", {
              required: "مبلغ الزامی است",
              validate: (value) =>
                /^\d+$/.test(value.replace(/,/g, "")) || "فقط عدد مجاز است",
            })}
            value={formAmount}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              if (rawValue === "" || /^\d+$/.test(rawValue)) {
                setValue("amount", formatNumberWithCommas(rawValue));
              }
            }}
            isInvalid={!!errors.amount}
            placeholder="مبلغ درخواستی را وارد کنید"
            fullWidth={true}
            type="text"
            variant="bordered"
            classNames={{
              inputWrapper:
                "border border-[#D8D9DF] rounded-[12px] shadow-none w-full",
              input: "text-right dir-rtl",
            }}
          />
          {errors.amount && (
            <span className="text-red-500 text-sm">
              {errors.amount.message}
            </span>
          )}
        </div>

        <div className="text-[14px] mb-[10px]">توضیحات</div>

        <Textarea
          {...register("description", {
            required: "توضیحات الزامی است",
          })}
          placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
          fullWidth={true}
          type="text"
          variant="bordered"
          classNames={{
            inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
            input: "text-right dir-rtl",
          }}
        />
      </div>

      <div className="flex justify-end items-center gap-3">
        {loanRequestDetails?.IsStandard ? (
          <>
            <Button
              variant="bordered"
              className="text-[#FF1751] border-[#26272B33] border-1 rounded-[12px]"
              size="md"
              onPress={handleReject}
              isLoading={isRejectingRequest}
              disabled={
                isRejectingRequest || isAcceptingRequest || isCompletingTask
              }
            >
              رد درخواست
            </Button>
            <Button
              variant="solid"
              className="bg-[#1C3A63] text-white rounded-[12px]"
              size="md"
              onPress={handleAcceptOrComplete}
              isLoading={isAcceptingRequest}
              disabled={
                isRejectingRequest || isAcceptingRequest || isCompletingTask
              }
            >
              تایید درخواست
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="bordered"
              className="text-[#FF1751] border-[#26272B33] border-1 rounded-[12px]"
              size="md"
              onPress={handleReject}
              isLoading={isRejectingRequest}
              disabled={
                isRejectingRequest || isAcceptingRequest || isCompletingTask
              }
            >
              رد درخواست
            </Button>
            <Button
              variant="solid"
              className="bg-[#1C3A63] text-white rounded-[12px]"
              size="md"
              onPress={handleAcceptOrComplete}
              isLoading={isAcceptingRequest}
              disabled={
                isRejectingRequest || isAcceptingRequest || isCompletingTask
              }
            >
              ارسال به مدیر منابع انسانی
            </Button>
          </>
        )}
      </div>
    </>
  );
}
