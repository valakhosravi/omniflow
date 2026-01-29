import GeneralResponse from "@/packages/core/types/api/general_response";
import { Dispatch, SetStateAction, useState } from "react";
import { getInvoiceByRequestId } from "../types/InvoiceModels";
import { Controller, useForm } from "react-hook-form";
import { Select, SelectItem, Textarea } from "@heroui/react";
import { useGetDeputyUsersQuery } from "../api/InvoiceApi";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import CustomButton from "@/ui/Button";
import { useCamunda } from "@/packages/camunda";
import { useRouter, useSearchParams } from "next/navigation";
import { addToaster } from "@/ui/Toaster";

interface DeputyAdditionalDescriptionProps {
  title: string;
  invoiceDetails: GeneralResponse<getInvoiceByRequestId> | undefined;
}

interface InvoiceReferralData {
  referral: number | null;
}

export default function DeputyAdditionalDescription({
  title,
  invoiceDetails,
}: DeputyAdditionalDescriptionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams?.get("taskId");
  const { userDetail } = useAuth();
  const { data: deputyUsers, isLoading: isGetting } = useGetDeputyUsersQuery(
    Number(userDetail?.UserDetail.PersonnelId)
  );
  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<InvoiceReferralData>({
    defaultValues: {
      referral: null,
    },
  });

  const usersOptions =
    (deputyUsers?.Data &&
      deputyUsers?.Data.map((user) => ({
        label: user.FullName,
        value: user.PersonnelId,
      }))) ??
    [];

  const onSubmit = async (data: InvoiceReferralData) => {
    if (!taskId) return;
    const assigneeUser =
      deputyUsers?.Data &&
      deputyUsers?.Data.find((user) => user.PersonnelId === data.referral);
    try {
      setIsAcceptingRequest(true);
      await completeTaskWithPayload(taskId, {
        DeputyApprove: true,
        DeputyDescription: managerDescription,
        Assign: assigneeUser ? true : false,
        AssigneePersonnelId: assigneeUser
          ? String(assigneeUser?.PersonnelId)
          : "0",
        AssigneeUserId: assigneeUser?.UserId ?? 0,
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

  const onRejectRequestClick = handleSubmit(
    async (data: InvoiceReferralData) => {
      if (!taskId) return;
      if (!managerDescription.trim()) {
        setManagerRejectDescriptionError(true);
        return;
      }

      const assigneeUser =
        deputyUsers?.Data &&
        deputyUsers?.Data.find((user) => user.PersonnelId === data.referral);

      try {
        setIsRejectingRequest(true);
        await completeTaskWithPayload(taskId, {
          DeputyApprove: false,
          DeputyDescription: managerDescription,
          Assign: false,
          AssigneePersonnelId: "0",
          AssigneeUserId: 0,
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
    }
  );

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
        <div className="w-full flex flex-col gap-y-3">
          <label className="font-bold text-[14px]/[20px]">ارجاع</label>
          <Controller
            control={control}
            name="referral"
            render={({ field }) => (
              <div className="w-full">
                <Select
                  key={errors.referral ? "error" : "no-error"}
                  aria-label="تایید‌کننده"
                  selectedKeys={
                    field.value !== null
                      ? new Set([String(field.value)])
                      : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys as Set<string>)[0];
                    field.onChange(key ? Number(key) : null);
                  }}
                  isInvalid={!!errors.referral}
                  className="w-full"
                  classNames={{
                    base: "w-full",
                    trigger:
                      "w-full border border-default-300 rounded-[12px] shadow-none min-h-[48px] h-[48px] bg-transparent",
                    value: `text-sm text-secondary-950`,
                    popoverContent: `border border-default-300`,
                  }}
                >
                  {usersOptions.map((option) => (
                    <SelectItem
                      key={String(option.value)}
                      textValue={option.label}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                {errors.referral && (
                  <p className="text-danger text-[12px] mt-1">
                    {errors.referral.message}
                  </p>
                )}
              </div>
            )}
          />

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
              input:
                "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
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
        </div>
        <div className="flex items-center self-end gap-x-[12px]">
          <CustomButton
            buttonSize="sm"
            buttonVariant="outline"
            className="!text-trash !rounded-[12px]"
            onPress={() => onRejectRequestClick()}
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
          >
            تایید درخواست
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
