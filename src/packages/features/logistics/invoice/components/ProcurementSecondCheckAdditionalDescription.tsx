import GeneralResponse from "@/packages/core/types/api/general_response";
import { Dispatch, SetStateAction, useState } from "react";
import { getInvoiceByRequestId } from "../types/InvoiceModels";
import { Textarea } from "@heroui/react";
import CustomButton from "@/ui/Button";
import { useCamunda } from "@/packages/camunda";
import { useRouter, useSearchParams } from "next/navigation";
import { addToaster } from "@/ui/Toaster";

interface ProcurementSecondCheckAdditionalDescriptionProps {
  title: string;
  invoiceDetails: GeneralResponse<getInvoiceByRequestId> | undefined;
}

export default function ProcurementSecondCheckAdditionalDescription({
  title,
  invoiceDetails,
}: ProcurementSecondCheckAdditionalDescriptionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams?.get("taskId");
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const [isReferralRequest, setIsReferralRequest] = useState(false);
  const [isEditRequest, setIsEditRequest] = useState(false);
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);

  const handleApproveRequest = async () => {
    if (!taskId) return;
    try {
      setIsAcceptingRequest(true);
      await completeTaskWithPayload(taskId, {
        CPOSecondApprove: true,
        CPOSecondDescription: managerDescription,
        Edit: false,
        DeputyAssign: false,
      }).then(() => {
        router.replace("/task-inbox/completed-tasks");
      });
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data?.message || "خطا در تایید درخواست",
      });
    } finally {
      setIsAcceptingRequest(false);
    }
  };

  const handleReferralRequest = async () => {
    if (!taskId) return;
    if (!managerDescription.trim()) {
      setManagerRejectDescriptionError(true);
      return;
    }
    try {
      setIsReferralRequest(true);
      await completeTaskWithPayload(taskId, {
        CPOSecondApprove: false,
        CPOSecondDescription: managerDescription,
        Edit: false,
        DeputyAssign: true,
      }).then(() => {
        router.replace("/task-inbox/completed-tasks");
      });
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data?.message || "خطا در رد درخواست",
      });
    } finally {
      setIsReferralRequest(false);
    }
  };

  const handleEditRequest = async () => {
    if (!taskId) return;
    if (!managerDescription.trim()) {
      setManagerRejectDescriptionError(true);
      return;
    }
    try {
      setIsEditRequest(true);
      await completeTaskWithPayload(taskId, {
        CPOSecondApprove: false,
        CPOSecondDescription: managerDescription,
        Edit: true,
        DeputyAssign: false,
      }).then(() => {
        router.replace("/task-inbox/completed-tasks");
      });
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data?.message || "خطا در رد درخواست",
      });
    } finally {
      setIsEditRequest(false);
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
        CPOSecondApprove: false,
        CPOSecondDescription: managerDescription,
        Edit: false,
        DeputyAssign: false,
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
      <div className="flex flex-col space-y-[30px]">
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
            key="reject-btn"
            buttonSize="sm"
            buttonVariant="outline"
            className="!text-trash !rounded-[12px]"
            onPress={onRejectRequestClick}
            isLoading={isRejectingRequest}
          >
            رد درخواست
          </CustomButton>
          {/* <CustomButton
            key="edit-btn"
            buttonSize="sm"
            buttonVariant="outline"
            className="!rounded-[12px]"
            onPress={handleEditRequest}
            isLoading={isEditRequest}
          >
            ارجاع به پیمانکار جهت ویرایش
          </CustomButton> */}
          <CustomButton
            key="referral-btn"
            buttonSize="sm"
            buttonVariant="outline"
            className="!rounded-[12px]"
            onPress={handleReferralRequest}
            isLoading={isReferralRequest}
          >
            ارجاع به ناظر
          </CustomButton>
          <CustomButton
            key="approve-button"
            buttonSize="sm"
            buttonVariant="primary"
            className="!rounded-[12px]"
            onPress={handleApproveRequest}
            isLoading={isAcceptingRequest}
          >
            تایید درخواست
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
