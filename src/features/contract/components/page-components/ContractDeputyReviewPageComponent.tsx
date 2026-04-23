"use client";

import React, { useState } from "react";
import Loading from "@/ui/Loading";
import { useGetContractInfoByRequestIdQuery } from "../../contract.services";
import CustomButton from "@/ui/Button";
import { Document, Refresh, User } from "iconsax-reactjs";
import { Button, useDisclosure } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { useCamunda } from "@/packages/camunda/hooks/useCamunda";
import { useRouter, useSearchParams } from "next/navigation";
import { addToaster } from "@/ui/Toaster";
import LmcNonTypeForm from "../forms/LmcNonTypeForm";
import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";
import AppRequestDetail from "@/components/common/AppRequestDetails";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import type { FileType } from "@/components/common/AppFile/AppFile.types";
import {
  useGetLastRequestStatusQuery,
  useGetRequestTimelineQuery,
} from "@/services/commonApi/commonApi";
import { STATUS_STYLES } from "@/components/common/AppRequestDetails/AppRequestDetails.const";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";

function ContractDeputyReviewPageComponent() {
  const searchParams = useSearchParams();
  const requestId = Number(searchParams.get("requestId")) ?? 0;
  const taskId = searchParams.get("taskId") ?? "";

  const {
    data,
    isLoading,
    error,
    refetch: refetchContract,
  } = useGetContractInfoByRequestIdQuery(requestId, {
    skip: requestId === 0,
  });
  const { data: requestStatus, refetch } = useGetLastRequestStatusQuery(
    requestId,
    {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    },
  );
  const { completeTaskWithPayload } = useCamunda();
  const router = useRouter();

  const [deputyDescription, setDeputyDescription] = useState("");
  const [deputyDescriptionError, setDeputyDescriptionError] = useState(false);

  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const [isEditingRequest, setIsEditingRequest] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const { data: requestTimeline } = useGetRequestTimelineQuery(
    Number(requestId),
    {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    },
  );

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
      await completeTaskWithPayload(taskId.toString(), {
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
      await completeTaskWithPayload(taskId.toString(), {
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
      await completeTaskWithPayload(taskId.toString(), {
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
      <>
        <div className="h-[calc(100%-105px)]">
          <Loading />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="h-[calc(100%-105px)] flex items-center justify-center">
          <p className="text-red-500">خطا در بارگذاری اطلاعات قرارداد</p>
        </div>
      </>
    );
  }

  if (!data?.Data) {
    return (
      <>
        <div className="h-[calc(100%-105px)] flex items-center justify-center">
          <p>اطلاعات قرارداد یافت نشد</p>
        </div>
      </>
    );
  }

  const contractData = data.Data;

  const formData = [
    {
      title: "وضعیت درخواست",
      value: (
        <div
          className={`text-[14px] py-1 px-3 font-[600] rounded-[24px] ${
            STATUS_STYLES[requestStatus?.Data?.StatusCode || 0]
          }`}
        >
          {requestStatus?.Data?.StatusName || "در حال بررسی"}
        </div>
      ),
      icon: <Refresh size={16} />,
    },
    {
      title: "نام و نام خانوادگی",
      value: requestStatus?.Data?.FullName || "",
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
      key="edit-for-referral"
      buttonSize="sm"
      buttonVariant="outline"
      className="!rounded-[12px]"
      onPress={onEditForReferralClick}
      isLoading={isEditingRequest}
    >
      نیازمند اقدام درخواست‌دهنده
    </CustomButton>,
    <CustomButton
      key="reject-request"
      buttonSize="sm"
      buttonVariant="outline"
      className="!text-trash !rounded-[12px]"
      onPress={onRejectRequestClick}
      isLoading={isRejectingRequest}
    >
      رد درخواست
    </CustomButton>,
    <CustomButton
      key="approve-request"
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
    <>
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
              <AppRequestDetail
                formData={formData}
                CreatedDate={requestStatus?.Data?.CreatedDate}
                extention={
                  <div
                    className={`p-6 pb-0 rounded-[20px] mt-6 ${
                      files.length > 0 ? "border border-neutral-200" : ""
                    }`}
                  >
                    <AppFile
                      featureName={FeatureNamesEnum.CONTRACT}
                      files={files}
                      setFiles={setFiles}
                      enableUpload={false}
                      requestId={String(requestId)}
                    />
                  </div>
                }
              />
            </div>
          </div>
        ) : (
          <LmcNonTypeForm
            contractData={contractData}
            requestStatus={requestStatus?.Data}
            requestId={requestId.toString()}
            taskId={taskId.toString()}
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
      <AppRequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </>
  );
}

export default AppWithTaskInboxSidebar(ContractDeputyReviewPageComponent);
