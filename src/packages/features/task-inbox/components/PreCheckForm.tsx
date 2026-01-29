"use client";
import { LoanRequestDetails } from "@/models/advance-money/LoanRequestDetails";
import { formatNumberWithCommas, removeCommas } from "@/utils/formatNumber";
import { Button, Input, Textarea } from "@heroui/react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

type FormValues = {
  amount: string;
  ibanNumber: string;
  description: string;
};

interface PreCheckFormProps {
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
  completeTaskWithPayload: (taskId: string, payload: any) => Promise<void>;
  taskId: string | null;
}

export default function PreCheckForm({
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
  completeTaskWithPayload,
  taskId,
}: PreCheckFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
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

  // Debug logging
  useEffect(() => {
    console.log("Form values changed:", {
      formAmount,
      formIbanNumber,
      formDescription,
    });
  }, [formAmount, formIbanNumber, formDescription]);

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

    if (isDescriptionValid && taskId) {
      // Convert amount to number (remove commas) for API payload
      const numericAmount = formAmount
        ? parseInt(removeCommas(formAmount), 10)
        : 0;
      // Remove IR prefix from IBAN for API payload
      const cleanIbanNumber = formIbanNumber;

      setAmount(formAmount);
      setIbanNumber(formIbanNumber);
      setHrRejectDescription(formDescription);

      // Submit payload with PREApprove: false for rejection
      const payload = {
        PREApprove: false,
        PREDescription: formDescription,
        Amount: numericAmount,
        Destination: cleanIbanNumber,
      };

      await completeTaskWithPayload(taskId, payload);
      router.push("/task-inbox/completed-tasks");
    }
  };

  const handleAcceptOrComplete = async () => {
    clearErrors();

    const isValid = await trigger(["amount", "ibanNumber"]);

    console.log("isValid && taskId", isValid, taskId, isValid && taskId);
    if (isValid && taskId) {
      // Convert amount to number (remove commas) for API payload
      const numericAmount = formAmount
        ? parseInt(removeCommas(formAmount), 10)
        : 0;
      // Remove IR prefix from IBAN for API payload
      const cleanIbanNumber = formIbanNumber;

      setAmount(formAmount);
      setIbanNumber(formIbanNumber);
      setHrRejectDescription(formDescription);

      // Submit payload with PREApprove: true for acceptance
      const payload = {
        PREApprove: true,
        PREDescription: formDescription,
        Amount: numericAmount,
        Destination: cleanIbanNumber,
      };
      console.log(
        "formIbanNumber:",
        formIbanNumber,
        "cleanIbanNumber:",
        cleanIbanNumber
      );

      await completeTaskWithPayload(taskId, payload);
      router.push("/task-inbox/completed-tasks");
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
          {/* <div>
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
              placeholder="مبلغ مساعده را وارد کنید"
              fullWidth={true}
              type="text"
              variant="bordered"
              classNames={{
                inputWrapper: "border border-[#D8D9DF] rounded-[12px]",
                input: "text-right dir-rtl",
              }}
            />
            {errors.amount && (
              <span className="text-red-500 text-sm">
                {errors.amount.message}
              </span>
            )}
          </div> */}
          <div>
            <div className="text-[14px] mb-[10px]">شماره حساب</div>
            <div className="relative">
              <Controller
                name="ibanNumber"
                control={control}
                rules={{
                  required: "شماره حساب الزامی است",
                  validate: (value) =>
                    value?.replace("IR", "").length > 0 ||
                    "شماره حساب اجباری است.",
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    value={field.value.replace("IR", "")}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\s/g, "");
                      if (rawValue === "" || /^\d{0,24}$/.test(rawValue)) {
                        field.onChange("IR" + rawValue);
                      }
                    }}
                    isInvalid={!!fieldState.error}
                    placeholder=""
                    fullWidth={true}
                    type="text"
                    variant="bordered"
                    classNames={{
                      inputWrapper:
                        "border border-[#D8D9DF] rounded-[12px] pl-12",
                      input: "text-right dir-rtl",
                    }}
                  />
                )}
              />
            </div>
            {errors.ibanNumber && (
              <span className="text-red-500 text-sm">
                {errors.ibanNumber.message}
              </span>
            )}
          </div>
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
              تایید درخواست
            </Button>
          </>
        )}
      </div>
    </>
  );
}
