import React, { useState } from "react";
import { Button, Textarea, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useCamunda } from "@/packages/camunda/hooks/useCamunda";
import { addToaster } from "@/ui/Toaster";
import CustomButton from "@/ui/Button";
import { GetContractInfo } from "../../contract.types";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import { Document, Refresh, User } from "iconsax-reactjs";
import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";
import AppRequestDetail from "@/components/common/AppRequestDetails";
import { useGetRequestTimelineQuery } from "@/services/commonApi/commonApi";
import { STATUS_STYLES } from "@/components/common/AppRequestDetails/AppRequestDetails.const";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import type { FileType } from "@/components/common/AppFile/AppFile.types";

interface LmcTypeFormProps {
  contractData: GetContractInfo;
  requestStatus: GetLastRequestStatus | undefined;
  taskId: string | null;
  onRefetch: () => void;
  requestId?: string;
}

export default function LmcTypeForm({
  contractData,
  requestStatus,
  taskId,
  onRefetch,
  requestId,
}: LmcTypeFormProps) {
  const { completeTaskWithPayload } = useCamunda();
  const router = useRouter();
  const [lmcDescription, setLmcDescription] = useState("");
  const [lmcDescriptionError, setLmcDescriptionError] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);

  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);

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
    if (lmcDescription.trim() === "") {
      setLmcDescriptionError(true);
      addToaster({ color: "danger", title: "توضیحات رد درخواست را وارد کنید" });
      return;
    }
    try {
      await completeTaskWithPayload(taskId, {
        LmcApprove: false,
        LmcDescirption: lmcDescription,
      });
      onRefetch();
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
    setLmcDescriptionError(false);
    try {
      await completeTaskWithPayload(taskId, {
        LmcApprove: true,
        LmcDescirption: lmcDescription,
      });
      onRefetch();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error?.data?.message || "خطا در تکمیل وظیفه",
      });
    }
    setIsAcceptingRequest(false);
  };

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

  return (
    <>
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
              startContent={<Refresh size={20} />}
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
                  name="lmcDescription"
                  value={lmcDescription}
                  onChange={(e) => setLmcDescription(e.target.value)}
                  placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
                  isInvalid={!!lmcDescriptionError}
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
            CreatedDate={requestStatus?.CreatedDate}
            extention={
              requestId ? (
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
                    requestId={requestId}
                  />
                </div>
              ) : null
            }
          />
        </div>
      </div>
      <AppRequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />
    </>
  );
}
