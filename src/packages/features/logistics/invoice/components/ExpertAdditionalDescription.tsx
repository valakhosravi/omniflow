import GeneralResponse from "@/packages/core/types/api/general_response";
import { Dispatch, SetStateAction, useState } from "react";
import { getInvoiceByRequestId } from "../types/InvoiceModels";
import { useRouter, useSearchParams } from "next/navigation";
import { useCamunda } from "@/packages/camunda";
import { Checkbox, Textarea } from "@heroui/react";
import CustomButton from "@/ui/Button";
import { Controller, useForm } from "react-hook-form";
import { addToaster } from "@/ui/Toaster";

interface ExpertAdditionalDescriptionProps {
  title: string;
  invoiceDetails: GeneralResponse<getInvoiceByRequestId> | undefined;
}

interface InvoiceAgreementData {
  agreement: boolean;
}

export default function ExpertAdditionalDescription({
  title,
  invoiceDetails,
}: ExpertAdditionalDescriptionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams?.get("taskId");
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<InvoiceAgreementData>({
    defaultValues: {
      agreement: false,
    },
  });

  const agreement = watch("agreement");

  const onSubmit = async (data: InvoiceAgreementData) => {
    if (!taskId) return;
    try {
      setIsAcceptingRequest(true);
      await completeTaskWithPayload(taskId, {
        ExpertApprove: true,
        ExpertDescription: managerDescription,
      }).then(() => {
        router.replace("/task-inbox/completed-tasks");
      });
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsAcceptingRequest(false);
    }
  };

  const onRejectRequestClick = async () => {
    if (!taskId) return;
    if (!managerDescription.trim()) {
      setManagerRejectDescriptionError(true);
      return;
    }

    try {
      setIsRejectingRequest(true);
      await completeTaskWithPayload(taskId, {
        ExpertApprove: false,
        ExpertDescription: managerDescription,
      }).then(() => {
        router.replace("/task-inbox/completed-tasks");
      });
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
        <Controller
          name="agreement"
          control={control}
          rules={{ required: "پذیرش الزامی است." }}
          render={({ field }) => (
            <Checkbox
              isSelected={field.value}
              onChange={(checked) => field.onChange(checked)}
              classNames={{
                wrapper: "relative after:bg-primary-950",
              }}
            >
              <div className="font-medium text-[16px]/[30px] text-[#26272B]">
                با انتخاب گزینه تایید نهایی، ارجاع درخواست را می‌پذیرم و مجوز
                انجام پرداخت را صادر می‌کنم.
              </div>
            </Checkbox>
          )}
        />

        {errors.agreement && (
          <p className="text-trash text-[12px]">{errors.agreement.message}</p>
        )}

        <div className="flex items-center self-end gap-x-[12px] mt-4">
          <CustomButton
            buttonSize="sm"
            buttonVariant="outline"
            className="!text-trash !rounded-[12px]"
            onPress={onRejectRequestClick}
            isLoading={isRejectingRequest}
          >
            رد درخواست
          </CustomButton>

          <CustomButton
            key="approve-button"
            buttonSize="sm"
            buttonVariant="primary"
            className="!rounded-[12px]"
            type="submit"
            isLoading={isAcceptingRequest}
            isDisabled={!agreement}
          >
            تایید درخواست
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
