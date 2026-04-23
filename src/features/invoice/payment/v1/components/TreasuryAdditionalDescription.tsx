import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCamunda } from "@/packages/camunda";
import CustomButton from "@/ui/Button";
import { Controller, useForm } from "react-hook-form";
import { Checkbox, Input, Textarea } from "@heroui/react";
import { addToaster } from "@/ui/Toaster";
import { getInvoiceByRequestId } from "../invoice.type";

interface TreasuryAdditionalDescriptionProps {
  title: string;
  invoiceDetails: GeneralResponse<getInvoiceByRequestId> | undefined;
}

interface TreasuryData {
  ReferenceCode: number | null;
  IsPaid: boolean;
}

export default function TreasuryAdditionalDescription({
  title,
}: TreasuryAdditionalDescriptionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams?.get("taskId");
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const { completeTaskWithPayload } = useCamunda();
  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    watch,
  } = useForm<TreasuryData>({
    defaultValues: {
      ReferenceCode: null,
      IsPaid: false,
    },
  });
  const IsPaid = watch("IsPaid");

  const onSubmit = async (data: TreasuryData) => {
    if (!taskId) return;

    try {
      setIsAcceptingRequest(true);
      await completeTaskWithPayload(taskId, {
        TEDescription: managerDescription,
        ReferenceCode: data.ReferenceCode,
        IsPaid: data.IsPaid,
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
        <div>
          <Controller
            name="IsPaid"
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
                  فاکتور فیزیکی دریافت شده است.
                </div>
              </Checkbox>
            )}
          />

          {errors.IsPaid && (
            <p className="text-trash text-[12px]">{errors.IsPaid.message}</p>
          )}
        </div>
        <div className="w-full flex flex-col gap-y-3">
          <label className="font-bold text-[14px]/[20px]">
            کد رهگیری <span className="text-accent-500">*</span>
          </label>
          <Input
            {...register("ReferenceCode", {
              required: "کد رهگیری الزامی است",
            })}
            isRequired
            variant="bordered"
            classNames={{
              base: "w-full",
              inputWrapper: `w-full border border-default-300 rounded-[12px] shadow-none h-[48px] min-h-[48px]`,
              input: `text-sm text-secondary-950 placeholder:text-secondary-400 text-left`,
            }}
            errorMessage={errors.ReferenceCode?.message}
            isInvalid={!!errors.ReferenceCode}
            isDisabled={!IsPaid}
            {...{ dir: "ltr" }}
          />
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
        <div className="flex items-center self-end gap-x-[12px] mt-4">
          <CustomButton
            key="approve-button"
            buttonSize="sm"
            buttonVariant="primary"
            className="!rounded-[12px]"
            type="submit"
            isLoading={isAcceptingRequest}
          >
            پرداخت
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
