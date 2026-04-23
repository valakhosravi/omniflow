"use client";

import React, { useState } from "react";
import Loading from "@/ui/Loading";
import { useGetContractInfoByRequestIdQuery } from "../../contract.services";
import CustomButton from "@/ui/Button";
import { Document, Refresh, User } from "iconsax-reactjs";
import { Button, useDisclosure } from "@heroui/react";
import { Textarea } from "@heroui/react";
import { useSendMessageMutation } from "@/packages/camunda";
import { useRouter, useSearchParams } from "next/navigation";
import { addToaster } from "@/ui/Toaster";
import DeleteConfirmModal from "@/ui/DeleteConfirmModal";
import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";
import FollowUpNonType from "../non-type/FollowUpNonType";
import AppRequestDetail from "@/components/common/AppRequestDetails";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import type { FileType } from "@/components/common/AppFile/AppFile.types";
import {
  useGetLastRequestStatusQuery,
  useGetRequestByIdQuery,
  useGetRequestTimelineQuery,
} from "@/services/commonApi/commonApi";
import { STATUS_STYLES } from "@/components/common/AppRequestDetails/AppRequestDetails.const";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";

function ContractFollowUpReviewPageComponent() {
  const searchParams = useSearchParams();
  const requestId = Number(searchParams.get("requestId")) ?? 0;

  const { data, isLoading, error } = useGetContractInfoByRequestIdQuery(
    Number(requestId),
    {
      skip: Number(requestId) === 0,
    },
  );
  const { data: requestStatus } = useGetLastRequestStatusQuery(
    Number(requestId),
    {
      skip: !requestId,
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: requestData } = useGetRequestByIdQuery(Number(requestId));
  const router = useRouter();
  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  const [deputyDescription, setDeputyDescription] = useState("");
  const [deputyDescriptionError] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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

  const onSendMessageClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirmCancel = (instanceId: string | number) => {
    sendMessage({
      body: {
        messageName: "Contract-Terminate-Request-Message",
        processInstanceId: instanceId || "",
      },
    })
      .unwrap()
      .then(() => {
        addToaster({
          color: "success",
          title: "درخواست با موفقیت لغو شد",
        });
        setIsConfirmModalOpen(false);
        router.push("/task-inbox/requests");
      })
      .catch((error: any) => {
        addToaster({
          color: "danger",
          title: error?.message || "خطا در لغو درخواست",
        });
      });
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

  // Update the formData array to use requestStatus
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

  return (
    <>
      <div className="h-[calc(100%-105px)]">
        {contractData.IsType ? (
          <div className="px-4 py-6">
            <div className="flex items-center mb-4 justify-between">
              <div className="inline-flex items-center gap-2">
                <span className="text-[#1C3A63] text-[16px] font-[500]">
                  پیگیری قرارداد
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
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      پیش‌نمایش قرارداد
                    </h3>
                    <div className="text-center text-gray-500 py-8 border border-gray-200 rounded-lg">
                      <p>پیش‌نمایش قرارداد در دسترس نیست</p>
                    </div>
                  </div>
                  {requestStatus?.Data?.CanBeCanceled && (
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
                          inputWrapper:
                            "border border-[#D8D9DF] rounded-[12px]",
                          input: "text-right dir-rtl",
                        }}
                      />
                    </div>
                  )}
                  <div className="flex justify-end items-center gap-3">
                    {requestStatus?.Data?.CanBeCanceled && (
                      <Button
                        variant="bordered"
                        className="text-[#FF1751] border-[#26272B33] border-1 rounded-[12px]"
                        size="md"
                        onPress={onSendMessageClick}
                      >
                        لغو
                      </Button>
                    )}
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
          <FollowUpNonType
            formData={formData}
            onRequestFlowOpen={onRequestFlowOpen}
            contractData={contractData}
            requestStatus={requestStatus?.Data}
            onSendMessageClick={onSendMessageClick}
            requestId={requestId.toString()}
          />
        )}
        <DeleteConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCancelModal}
          onConfirm={handleConfirmCancel}
          itemId={requestData?.Data?.InstanceId || ""}
          isLoading={isSendingMessage}
        />
      </div>
      <AppRequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </>
  );
}

export default AppWithTaskInboxSidebar(ContractFollowUpReviewPageComponent);
