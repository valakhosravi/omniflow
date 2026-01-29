import React, { useMemo, useState } from "react";
import TaskInboxLayout from "../../task-inbox/layouts";
import Loading from "@/ui/Loading";
import {
  useGetContractAssigneeWithContractIdQuery,
  useGetContractInfoByRequestIdQuery,
} from "../api/contractApi";
import TypeContractPreviewIndex from "./TypeContractPreviewIndex";
import DefaultContractPreview from "./DefaultContractPreview";
import CustomButton from "@/ui/Button";
import { Document, Refresh, User } from "iconsax-reactjs";
import { useRequestStatus } from "../../task-inbox/hooks/useRequestStatus";
import { STATUS_STYLES } from "../../task-inbox/constants/constant";
import { Button, useDisclosure } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { useCamunda } from "@/packages/camunda/hooks/useCamunda";
import { useRouter, useSearchParams } from "next/navigation";
import { addToaster } from "@/ui/Toaster";
import LmcNonTypeForm from "./LmcNonTypeForm";
import RequestFlowModal from "../../task-inbox/components/RequestFlowModal";
import { useRequestTimeline } from "../../task-inbox/hooks/useRequestTimeline";
import ContractAttachments from "../components/non-type/ContractAttachments";
import RequestDetail from "../../development-ticket/components/v2/RequestDetail";

export default function ContractDeputyReviewPage({
  formKey,
  requestId,
}: {
  formKey: string;
  requestId: string;
}) {
  const {
    data,
    isLoading,
    error,
    refetch: refetchContract,
  } = useGetContractInfoByRequestIdQuery(Number(requestId), {
    skip: Number(requestId) === 0,
  });
  const { requestStatus, refetch } = useRequestStatus({
    requestId: Number(requestId),
  });
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const [deputyDescription, setDeputyDescription] = useState("");
  const [deputyDescriptionError, setDeputyDescriptionError] = useState(false);

  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const [isEditingRequest, setIsEditingRequest] = useState(false);

  const { requestTimeline, refetch: refetchRequestTimeline } =
    useRequestTimeline({ requestId: Number(requestId) });

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();


  const onRejectRequestClick = async () => {
    setIsRejectingRequest(true);
    if (!taskId) {
      addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
      return;
    }
    if (deputyDescription.trim() === "") {
      addToaster({ color: "danger", title: "توضیحات رد درخواست را وارد کنید" });
      setDeputyDescriptionError(true);
      setIsRejectingRequest(false);
      return;
    }
    try {
      await completeTaskWithPayload(taskId, {
        DeputyApprove: false,
        DeputyDescription: deputyDescription,
        DeputyEdit: false,
      });
      refetch();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error?.data?.message || "خطا در تکمیل وظیفه",
      });
    }
    setIsRejectingRequest(false);
  };

  const onApproveRequestClick = async () => {
    setIsAcceptingRequest(true);
    if (!taskId) {
      addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
      return;
    }
    setDeputyDescriptionError(false);
    try {
      await completeTaskWithPayload(taskId, {
        DeputyApprove: true,
        DeputyDescription: deputyDescription,
        DeputyEdit: false,
      });
      refetch();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error?.data?.message || "خطا در تکمیل وظیفه",
      });
    }
    setIsAcceptingRequest(false);
  };

  const onEditForReferralClick = async () => {
    setIsEditingRequest(true);
    if (!taskId) {
      addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
      return;
    }
    if (deputyDescription.trim() === "") {
      addToaster({ color: "danger", title: "توضیحات ویرایش را وارد کنید" });
      setDeputyDescriptionError(true);
      setIsEditingRequest(false);
      return;
    }
    setDeputyDescriptionError(false);
    try {
      await completeTaskWithPayload(taskId, {
        DeputyApprove: false,
        DeputyDescription: deputyDescription,
        DeputyEdit: true,
      });
      refetch();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error?.data?.message || "خطا در تکمیل وظیفه",
      });
    }
    setIsEditingRequest(false);
  };

  if (isLoading) {
    return (
      <TaskInboxLayout>
        <div className="h-[calc(100%-105px)]">
          <Loading />
        </div>
      </TaskInboxLayout>
    );
  }

  if (error) {
    return (
      <TaskInboxLayout>
        <div className="h-[calc(100%-105px)] flex items-center justify-center">
          <p className="text-red-500">خطا در بارگذاری اطلاعات قرارداد</p>
        </div>
      </TaskInboxLayout>
    );
  }

  if (!data?.Data) {
    return (
      <TaskInboxLayout>
        <div className="h-[calc(100%-105px)] flex items-center justify-center">
          <p>اطلاعات قرارداد یافت نشد</p>
        </div>
      </TaskInboxLayout>
    );
  }

  const contractData = data.Data;

  const formData = [
    {
      title: "وضعیت درخواست",
      value: (
        <div
          className={`text-[14px] py-1 px-3 font-[600] rounded-[24px] ${
            STATUS_STYLES[requestStatus?.StatusCode || 0]
          }`}
        >
          {requestStatus?.StatusName || "در حال بررسی"}
        </div>
      ),
      icon: <Refresh size={16} />,
    },
    {
      title: "نام و نام خانوادگی",
      value: requestStatus?.FullName || "",
      icon: <User size={16} />,
    },
    {
      title: "عنوان قرارداد",
      value: contractData.ContractTitle || "",
      icon: <Document size={16} />,
    },
    {
      title: "نوع قرارداد",
      value: contractData.IsType ? "تیپ" : "غیرتیپ",
      icon: <Document size={16} />,
    },
  ];

  const buttons = [
    <CustomButton
      buttonSize="sm"
      buttonVariant="outline"
      className="!rounded-[12px]"
      onPress={onEditForReferralClick}
      isLoading={isEditingRequest}
    >
      نیازمند اقدام درخواست‌دهنده
    </CustomButton>,
    <CustomButton
      buttonSize="sm"
      buttonVariant="outline"
      className="!text-trash !rounded-[12px]"
      onPress={onRejectRequestClick}
      isLoading={isRejectingRequest}
    >
      رد درخواست
    </CustomButton>,
    <CustomButton
      buttonSize="sm"
      buttonVariant="primary"
      className="!rounded-[12px]"
      onPress={onApproveRequestClick}
      isLoading={isAcceptingRequest}
    >
      تایید درخواست
    </CustomButton>,
  ];

  return (
    <TaskInboxLayout>
      <div className="h-[calc(100%-105px)]">
        {contractData.IsType ? (
          <div className="px-4 py-6">
            <div className="flex items-center mb-4 justify-between">
              <div className="inline-flex items-center gap-2">
                <span className="text-[#1C3A63] text-[16px] font-[500]">
                  ایجاد قرارداد جدید
                </span>
              </div>
              <div>
                <CustomButton
                  buttonVariant="outline"
                  className="font-semibold text-[14px]/[35px] text-primary-950 border-[#26272B33] border-1 rounded-[12px]"
                  buttonSize="md"
                  onPress={onRequestFlowOpen}
                >
                  مراحل گردش درخواست
                </CustomButton>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <ContractAttachments
                  attachments={contractData.Attachments || []}
                />
                <div className="border border-[#D8D9DF] p-4 rounded-[20px]">
                  {/* Contract Preview */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      پیش‌نمایش قرارداد
                    </h3>
                    <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg">
                      <p>پیش‌نمایش قرارداد در دسترس نیست</p>
                    </div>
                  </div>
                  <div className="border border-[#D8D9DF] p-4 rounded-[20px] mb-4">
                    <div className="text-[14px] mb-[10px]">توضیحات</div>
                    <Textarea
                      name="description"
                      value={deputyDescription}
                      onChange={(e) => setDeputyDescription(e.target.value)}
                      placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
                      isInvalid={!!deputyDescriptionError}
                      errorMessage="در صورت رد درخواست باید توضیحات مربوطه وارد شود."
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
                    <Button
                      variant="bordered"
                      className="text-[#FF1751] border-[#26272B33] border-1 rounded-[12px]"
                      size="md"
                      onPress={onRejectRequestClick}
                      isLoading={isRejectingRequest}
                    >
                      رد درخواست
                    </Button>
                    <Button
                      variant="bordered"
                      className="text-[#F59E0B] border-[#26272B33] border-1 rounded-[12px]"
                      size="md"
                      onPress={onEditForReferralClick}
                      isLoading={isEditingRequest}
                    >
                      ویرایش جهت ارجاع
                    </Button>
                    <Button
                      variant="solid"
                      className="bg-[#1C3A63] text-white rounded-[12px]"
                      size="md"
                      onPress={onApproveRequestClick}
                      isLoading={isAcceptingRequest}
                    >
                      تایید درخواست
                    </Button>
                  </div>
                </div>
              </div>
              <RequestDetail
                formData={formData}
                CreatedDate={requestStatus?.CreatedDate}
              />
            </div>
          </div>
        ) : (
          <LmcNonTypeForm
            contractData={contractData}
            requestStatus={requestStatus}
            requestId={requestId}
            onRefetch={refetchContract}
            deputyButtons={buttons}
            showTermHistory={false}
            hasAccessToEdit={false}
            setDeputyDescription={setDeputyDescription}
            deputyDescription={deputyDescription}
            deputyDescriptionError={deputyDescriptionError}
          />
        )}
      </div>
      <RequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </TaskInboxLayout>
  );
}
