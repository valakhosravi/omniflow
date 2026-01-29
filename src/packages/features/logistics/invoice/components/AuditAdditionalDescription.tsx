import GeneralResponse from "@/packages/core/types/api/general_response";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getInvoiceByRequestId } from "../types/InvoiceModels";
import { useRouter, useSearchParams } from "next/navigation";
import { useCamunda } from "@/packages/camunda";
import { Controller, useForm } from "react-hook-form";
import {
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import CustomButton from "@/ui/Button";
import { useGetRejectionReasonsQuery } from "../api/InvoiceApi";
import ReferralModalAudit from "./ReferralModalAudit";
import { addToaster } from "@/ui/Toaster";

interface AuditAdditionalDescriptionProps {
  title: string;
  invoiceDetails: GeneralResponse<getInvoiceByRequestId> | undefined;
}

type FormValues = {
  paymentMethod: number | null;
  paymentAmount: number | null;
  rejectReason: number | null;
};

export default function AuditAdditionalDescription({
  title,
  invoiceDetails,
}: AuditAdditionalDescriptionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams?.get("taskId");
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const { data: rejectionReasons } = useGetRejectionReasonsQuery();
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    clearErrors,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      paymentMethod: 1,
      paymentAmount: null,
      rejectReason: null,
    },
  });

  const { onOpen, onOpenChange, isOpen } = useDisclosure();
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (paymentMethod !== 2) {
      setValue("paymentAmount", null);
      clearErrors("paymentAmount");
    }
  }, [paymentMethod, setValue, clearErrors]);

  const onSubmit = async (data: FormValues) => {
    if (!taskId) return;
    if (!managerDescription.trim()) {
      setManagerRejectDescriptionError(true);
      return;
    }
    try {
      setIsAcceptingRequest(true);
      await completeTaskWithPayload(taskId, {
        AuditApprove: false,
        AuditDescription: managerDescription,
        SecondAuditorPersonnelId: "",
        SecondAuditorUserId: 0,
        NewInvoiceAmount: data.paymentAmount,
        NewAmount: data.paymentAmount ? true : false,
        RejectionReasonId: data.rejectReason,
        RejectionDescription: data.rejectReason,
        InvoiceId: invoiceDetails?.Data?.InvoiceId,
      }).then(() => {
        router.replace("/task-inbox/completed-tasks");
      });
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    }
    setIsAcceptingRequest(false);
  };

  const onRejectRequestClick = () => {
    if (!taskId) return;
    if (!managerDescription.trim()) {
      setManagerRejectDescriptionError(true);
      return;
    }
    try {
      setIsRejectingRequest(true);
      completeTaskWithPayload(taskId, {
        AuditApprove: false,
        AuditDescription: managerDescription,
        SecondAuditorPersonnelId: "",
        SecondAuditorUserId: 0,
        NewInvoiceAmount: 1,
        NewAmount: false,
        RejectionReasonId: 0,
        RejectionDescription: 0,
        InvoiceId: invoiceDetails?.Data?.InvoiceId,
      });
      router.replace("/task-inbox/completed-tasks");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data?.message || "خطا در رد درخواست",
      });
    } finally {
      setIsRejectingRequest(false);
    }
  };

  return (
    <div className="border border-primary-950/[.1] rounded-[20px] px-[20px] py-[16px]">
      <h3 className="font-medium text-[14px]/[23px] text-primary-950">
        {title}
      </h3>
      <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-4" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-[30px]"
      >
        <div className="grid grid-cols-2 gap-x-4">
          <div className="col-span-1">
            <div className="text-[14px] mb-[10px]">
              مبلغ قابل پرداخت <span className="text-accent-500">*</span>
            </div>
            <Controller
              name="paymentMethod"
              control={control}
              rules={{ required: "مبلغ قابل پرداخت الزامی است" }}
              render={({ field }) => (
                <Select
                  selectedKeys={field.value ? [String(field.value)] : []}
                  onSelectionChange={(keys) => {
                    const arr = Array.from(keys);
                    if (arr.length === 0) return;
                    const value = Number(arr[0]);
                    field.onChange(value);
                  }}
                  placeholder="انتخاب مبلغ قابل پرداخت"
                  isInvalid={!!errors.paymentMethod}
                  className="w-full"
                  classNames={{
                    trigger:
                      "border border-default-300 rounded-[12px]  h-[48px] min-h-[48px] bg-white text-right dir-rtl",
                    value: "text-right",
                    popoverContent: "border border-default-300",
                  }}
                >
                  <SelectItem key={1}>کل مبلغ</SelectItem>
                  <SelectItem key={2}>بخشی از مبلغ</SelectItem>
                  <SelectItem key={3}>بدون مبلغ</SelectItem>
                </Select>
              )}
            />

            {errors.paymentMethod && (
              <span className="text-red-500 text-sm">
                {errors.paymentMethod.message}
              </span>
            )}
          </div>
          {paymentMethod === 2 && (
            <div className="col-span-1 flex flex-col space-y-[10px]">
              <label className="font-bold text-[14px]/[20px] mb-[10px]">
                مبلغ
                <span className="text-accent-500">*</span>
              </label>

              <Controller
                name="paymentAmount"
                control={control}
                rules={{
                  required: paymentMethod === 2 ? "مبلغ الزامی است" : false,
                }}
                render={({ field }) => {
                  const formattedValue =
                    field.value !== null && field.value !== undefined
                      ? field.value.toLocaleString("en-US")
                      : "";

                  return (
                    <Input
                      value={formattedValue}
                      onChange={(e) => {
                        const numericValue = Number(
                          e.target.value.replace(/,/g, "")
                        );
                        field.onChange(
                          isNaN(numericValue) ? null : numericValue
                        );
                      }}
                      isRequired
                      variant="bordered"
                      classNames={{
                        base: "w-full",
                        inputWrapper:
                          "w-full border border-default-300 rounded-[12px] shadow-none h-[48px] min-h-[48px]",
                        input:
                          "text-sm text-secondary-950 placeholder:text-secondary-400 text-right",
                      }}
                      errorMessage={errors.paymentAmount?.message}
                      isInvalid={!!errors.paymentAmount}
                      type="text"
                    />
                  );
                }}
              />
            </div>
          )}

          {paymentMethod === 3 && (
            <div className="col-span-1">
              <div className="text-[14px] mb-[10px]">
                دلایل رد پرداخت <span className="text-accent-500">*</span>
              </div>
              <Controller
                name="rejectReason"
                control={control}
                rules={{ required: "دلایل رد پرداخت الزامی است" }}
                render={({ field }) => (
                  <Select
                    selectedKeys={
                      field.value !== null ? [String(field.value)] : []
                    }
                    onSelectionChange={(keys) => {
                      const value = Number(Array.from(keys)[0]);
                      field.onChange(value);
                    }}
                    placeholder="انتخاب دلایل رد پرداخت"
                    isInvalid={!!errors.rejectReason}
                    className="w-full"
                    classNames={{
                      trigger:
                        "border border-default-300 rounded-[12px] h-[48px] min-h-[48px] bg-white text-right dir-rtl",
                      value: "text-right",
                      popoverContent: "border border-default-300",
                    }}
                  >
                    {(rejectionReasons?.Data ?? []).map((reason) => (
                      <SelectItem key={String(reason.RejectionReasonId)}>
                        {reason.Name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              {errors.rejectReason && (
                <span className="text-red-500 text-sm">
                  {errors.rejectReason.message}
                </span>
              )}
            </div>
          )}
        </div>
        <Textarea
          label="توضیحات"
          labelPlacement="outside"
          name="description"
          placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
          fullWidth={true}
          type="text"
          variant="bordered"
          isInvalid={!!managerRejectDescriptionError}
          errorMessage="در صورت رد یا ارجاع درخواست باید توضیحات مربوطه وارد شود."
          classNames={{
            inputWrapper: "border border-secondary-950/[.2] rounded-[16px]",
            input: "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
            label: `font-medium text-[14px]/[23px] text-secondary-950`,
          }}
          value={managerDescription}
          onChange={(e) => {
            setManagerDescription(e.target.value);

            if (managerRejectDescriptionError) {
              setManagerRejectDescriptionError(false);
            }
          }}
        />
        <div className="flex items-center self-end gap-x-[12px]">
          <CustomButton
            buttonSize="sm"
            buttonVariant="outline"
            className="!text-trash !rounded-[12px]"
            onPress={onRejectRequestClick}
            isLoading={isRejectingRequest}
          >
            ارجاع به تدارکات
          </CustomButton>

          {paymentMethod !== 3 && (
            <CustomButton
              key="approve-button"
              buttonSize="sm"
              buttonVariant="primary"
              className="!rounded-[12px]"
              onPress={() => {
                handleSubmit((data) => {
                  setSubmittedData(data);
                  if (paymentMethod === 2 && !managerDescription.trim()) {
                    setManagerRejectDescriptionError(true);
                    return;
                  } else {
                    onOpen();
                  }
                })();
              }}
            >
              ارجاع جهت ممیزی
            </CustomButton>
          )}

          {paymentMethod === 3 && (
            <CustomButton
              key="approve-button3"
              buttonSize="sm"
              buttonVariant="primary"
              className="!rounded-[12px]"
              type="submit"
            >
              تایید و پایان
            </CustomButton>
          )}
        </div>
      </form>
      <ReferralModalAudit
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        managerDescription={managerDescription}
        formData={submittedData}
        invoiceId={invoiceDetails?.Data?.InvoiceId}
        paymentMethod={paymentMethod}
      />
    </div>
  );
}
