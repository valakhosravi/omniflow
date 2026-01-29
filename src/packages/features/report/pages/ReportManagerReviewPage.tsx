"use client";
import {
  Refresh,
  User,
  DocumentText,
  Solana,
  Data,
  TimerStart,
  Coin,
  Calendar,
  Mobile,
  Truck,
  Setting2,
  Chart,
  Document,
} from "iconsax-reactjs";
import { useGetRequestByIdQuery } from "../../task-inbox/api/RequestApi";
import { STATUS_STYLES } from "../../task-inbox/constants/constant";
import { useRequestStatus } from "../../task-inbox/hooks/useRequestStatus";
import { useRequestTimeline } from "../../task-inbox/hooks/useRequestTimeline";
import TaskInboxLayout from "../../task-inbox/layouts";
import CustomButton from "@/ui/Button";
import { useDisclosure, Spinner, Button } from "@heroui/react";
import RequestFlowModal from "../../task-inbox/components/RequestFlowModal";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/ui/NextUi";
import RequestDetail from "../../development-ticket/components/v2/RequestDetail";
import { useGetReportByRequestIdQuery } from "../api/ReportApi";
import AppInfoRow from "@/components/common/AppInfoRow/AppInfoRow";

import { useForm } from "react-hook-form";
import { Textarea } from "@heroui/react";
import { useState, useEffect } from "react";
import { useCamunda } from "@/packages/camunda";
import { useRouter, useSearchParams } from "next/navigation";
import { addToaster } from "@/ui/Toaster";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import AppFile from "@/components/common/AppFile";

interface ReportManagerReviewFormData {
  title: string;
  requestType?: number;
  order?: number;
  purpose: string;
  description: string;
  requiredOutput?: number;
  dataRange?: number;
  kpis?: number;
  filter?: string;
  accessLevel?: number;
  deliveryTime: string;
  updatePeriod?: number;
  needToCompare: boolean;
  modelingRequest: boolean;
  modelPurpose?: number;
  targetVariable: string;
  modelLimitation?: number;
  requirement: string;
  managerDescription: string;
}

export default function ReportManagerReviewPage({
  formKey,
  requestId,
}: {
  formKey: string;
  requestId: string;
}) {
  const { requestTimeline, refetch: refetchRequestTimeline } =
    useRequestTimeline({ requestId: Number(requestId) });
  const { requestStatus, refetch } = useRequestStatus({
    requestId: Number(requestId),
  });
  const {
    data: reportData,
    isLoading: isReportDataLoading,
    error: reportDataError,
  } = useGetReportByRequestIdQuery(Number(requestId), {
    skip: !requestId,
  });
  const { data: requestData } = useGetRequestByIdQuery(Number(requestId));

  const [needToCompare, setNeedToCompare] = useState(false);
  const [modelingRequest, setModelingRequest] = useState(false);
  const [managerDescriptionError, setManagerDescriptionError] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState<FileType[] | []>([]);

  const [managerDescIsRequired, setManagerDescIsRequired] =
    useState<boolean>(false);

  const {
    isOpen: isApproveModalOpen,
    onOpen: onApproveModalOpen,
    onOpenChange: onApproveModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRejectModalOpen,
    onOpen: onRejectModalOpen,
    onOpenChange: onRejectModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange,
  } = useDisclosure();

  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
  } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ReportManagerReviewFormData>({
    defaultValues: {
      title: "",
      requestType: undefined,
      order: undefined,
      purpose: "",
      description: "",
      requiredOutput: undefined,
      dataRange: undefined,
      kpis: undefined,
      filter: "",
      accessLevel: undefined,
      deliveryTime: "",
      updatePeriod: undefined,
      needToCompare: false,
      modelingRequest: false,
      modelPurpose: undefined,
      targetVariable: "",
      modelLimitation: undefined,
      requirement: "",
      managerDescription: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (reportData?.Data) {
      reset({
        title: requestData?.Data?.Title || "",
        requestType: reportData.Data.CategoryId,
        order: reportData.Data.PriorityId,
        purpose: reportData.Data.Target || "",
        description: "",
        requiredOutput: reportData.Data.OutputFormatId,
        dataRange: reportData.Data.DataScopeId,
        kpis: reportData.Data.KpiId,
        filter: reportData.Data.Filters || "",
        accessLevel: reportData.Data.DataAccessId,
        deliveryTime: reportData.Data.DelivaryDate || "",
        updatePeriod: reportData.Data.ReportUpdateId,
        needToCompare: reportData.Data.NeedCompare || false,
        modelingRequest: reportData.Data.IsAiml || false,
        modelPurpose: reportData.Data.TargetModelId,
        targetVariable: reportData.Data.TargetVariable || "",
        modelLimitation: reportData.Data.ModelLimitationId,
        requirement: reportData.Data.Requirements || "",
      });
      setNeedToCompare(reportData.Data.NeedCompare || false);
      setModelingRequest(reportData.Data.IsAiml || false);
    }
  }, [reportData, requestData, reset]);

  const detailRows = [
    {
      title: "وضعیت درخواست",
      value: (
        <div
          className={`text-[14px] py-1 px-3 font-[600] rounded-[24px] ${
            STATUS_STYLES[
              requestData?.Data?.StatusCode || requestStatus?.StatusCode || 0
            ]
          }`}
        >
          {requestData?.Data?.StatusName || requestStatus?.StatusName || ""}
        </div>
      ),
      icon: <Refresh size={16} />,
    },
    {
      title: "نام و نام خانوادگی",
      value: requestData?.Data?.FullName || requestStatus?.FullName || "",
      icon: <User size={16} />,
    },
    {
      title: "توضیحات",
      value: requestData?.Data?.Description || "-",
      icon: <DocumentText size={16} />,
    },
    {
      title: "سمت",
      value: requestStatus?.JobPositionName || "",
      icon: <User size={16} />,
    },
  ];

  // Watch form values for display
  const watchedValues = watch();

  // Helper function to get display name from ID

  // Info rows for General Request Information section
  const generalInfoRows = [
    {
      icon: <DocumentText size={16} />,
      title: "عنوان درخواست",
      value: watchedValues.title || requestData?.Data?.Title || "-",
    },
    {
      icon: <Truck size={16} />,
      title: "نوع درخواست",
      value: reportData?.Data?.CategoryName,
    },
    {
      icon: <Solana size={16} />,
      title: "سطح اولویت",
      value: reportData?.Data?.PriorityName,
    },
    {
      icon: <Data size={16} />,
      title: "هدف تجاری",
      value: watchedValues.purpose || "-",
    },
    {
      icon: <TimerStart size={16} />,
      title: "نوع خروجی مورد نیاز",
      value: reportData?.Data?.OutputFormatName,
    },
    {
      icon: <Mobile size={16} />,
      title: "دامنه داده",
      value: reportData?.Data?.DataScopeName,
    },
    {
      icon: <Coin size={16} />,
      title: "شاخص های دقیق مورد نیاز",
      value: reportData?.Data?.KpiName,
    },
    {
      icon: <Setting2 size={16} />,
      title: "پارامترها و فیلترهای دقیق",
      value: watchedValues.filter || "-",
    },
    {
      icon: <User size={16} />,
      title: "سطح دسترسی",
      value: reportData?.Data?.DataAccessName,
    },
    {
      icon: <Calendar size={16} />,
      title: "زمان مورد نیاز جهت تحویل",
      value: watchedValues.deliveryTime || "-",
    },
    {
      icon: <TimerStart size={16} />,
      title: "دوره آپدیت",
      value: reportData?.Data?.ReportUpdateName,
    },
    {
      icon: <User size={16} />,
      title: "توضیحات درخواست کننده",
      value: reportData?.Data?.Description,
      isTextArea: true,
    },
    {
      icon: <Chart size={16} />,
      title: "نیازمند مقایسه با دوره های قبل",
      value: needToCompare ? "بله" : "خیر",
    },
    {
      icon: <User size={16} />,
      title: "نیازمند I / ML",
      value: modelingRequest ? "بله" : "خیر",
    },
    {
      icon: <Document size={16} />,
      title: "پیوست‌ها",
      value: (
        <div>
          <AppFile
            setFiles={setFiles}
            requestId={requestId}
            files={files}
            enableUpload={false}
            featureName={FeatureNamesEnum.REPORT}
          />
        </div>
      ),
    },
  ];

  const onSubmit = async (data: ReportManagerReviewFormData) => {};
  const managerDescription = watch("managerDescription");

  const handleApproveClick = () => {
    onApproveModalOpen();
  };

  const handleRejectClick = () => {
    if (!managerDescription) {
      setManagerDescIsRequired(true);
      addToaster({
        color: "danger",
        title: "توضیحات رد درخواست را وارد کنید",
      });
      setManagerDescriptionError(true);
      return;
    }
    setManagerDescriptionError(false);
    onRejectModalOpen();
  };

  const handleEditClick = () => {
    if (!managerDescription) {
      addToaster({
        color: "danger",
        title: "توضیحات ویرایش را وارد کنید",
      });
      setManagerDescriptionError(true);
      return;
    }
    setManagerDescriptionError(false);
    onEditModalOpen();
  };

  const confirmApprove = async () => {
    setIsApproving(true);
    if (!taskId) {
      addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
      setIsApproving(false);
      onApproveModalOpenChange();
      return;
    }
    try {
      await completeTaskWithPayload(taskId, {
        ManagerApprove: true,
        ManagerEdit: false,
        ManagerDescription: managerDescription,
      });
      refetch();
      onApproveModalOpenChange();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error?.data?.message || "خطا در تکمیل وظیفه",
      });
      setIsApproving(false);
    }
  };

  const confirmReject = async () => {
    setIsRejecting(true);
    if (!taskId) {
      addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
      setIsRejecting(false);
      onRejectModalOpenChange();
      return;
    }
    try {
      await completeTaskWithPayload(taskId, {
        ManagerApprove: false,
        ManagerEdit: false,
        ManagerDescription: managerDescription,
      });
      refetch();
      onRejectModalOpenChange();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error?.data?.message || "خطا در تکمیل وظیفه",
      });
      setIsRejecting(false);
    }
  };

  const confirmEdit = async () => {
    setIsEditing(true);
    if (!taskId) {
      addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
      setIsEditing(false);
      onEditModalOpenChange();
      return;
    }
    try {
      await completeTaskWithPayload(taskId, {
        ManagerApprove: false,
        ManagerEdit: true,
        ManagerDescription: managerDescription,
      });
      refetch();
      onEditModalOpenChange();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error?.data?.message || "خطا در تکمیل وظیفه",
      });
      setIsEditing(false);
    }
  };
  const buttons = [
    <div key={1}>
      <CustomButton
        buttonSize="sm"
        buttonVariant="outline"
        className="!rounded-[12px]"
        onPress={handleEditClick}
        isDisabled={isApproving || isRejecting || isEditing}
      >
        نیازمند اقدام درخواست‌دهنده
      </CustomButton>
    </div>,
    <div key={2}>
      <CustomButton
        buttonSize="sm"
        buttonVariant="outline"
        className="!text-trash !rounded-[12px]"
        onPress={handleRejectClick}
        isDisabled={isApproving || isRejecting || isEditing}
      >
        رد درخواست
      </CustomButton>
    </div>,
    <div key={3}>
      <CustomButton
        buttonSize="sm"
        buttonVariant="primary"
        className="!rounded-[12px]"
        onPress={handleApproveClick}
        isDisabled={isApproving || isRejecting || isEditing}
      >
        تایید درخواست
      </CustomButton>
    </div>,
  ];

  if (isReportDataLoading) {
    return (
      <TaskInboxLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </TaskInboxLayout>
    );
  }

  if (reportDataError) {
    return (
      <TaskInboxLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">خطا در بارگذاری اطلاعات</div>
        </div>
      </TaskInboxLayout>
    );
  }

  return (
    <TaskInboxLayout>
      <div className="px-4 py-6">
        <div className="flex items-center mb-4 justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="text-[#1C3A63] text-[16px] font-[500]">
              بررسی درخواست گزارش
            </span>
          </div>

          <CustomButton
            buttonVariant="outline"
            buttonSize="md"
            startContent={<Refresh size={20} />}
            onPress={onRequestFlowOpen}
          >
            مراحل گردش درخواست
          </CustomButton>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="border border-[#D8D9DF] p-4 rounded-[20px] space-y-4">
                <div className="text-[#1C3A63] pb-3 mb-4 border-b border-[#1C3A631A]">
                  شرح درخواست
                </div>

                {/* General Request Information */}
                <div className="rounded-[20px] border border-[#1C3A631A] bg-[#f8f9fa] p-4 mb-4">
                  <div className="text-[14px] text-[#1C3A63] font-[500] mb-4 pb-3 border-b border-[#1C3A631A]">
                    اطلاعات عمومی درخواست
                  </div>
                  <div className="flex flex-col gap-4">
                    {generalInfoRows.map((item, index) => (
                      <AppInfoRow
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        value={item.value}
                        isTextArea={item.isTextArea}
                      />
                    ))}
                  </div>
                </div>

                {/* Manager Actions Section */}
                <div className="rounded-[20px] border border-[#1C3A631A] bg-[#f8f9fa] p-4">
                  <div className="text-[14px] text-[#1C3A63] font-[500] mb-4 pb-3 border-b border-[#1C3A631A]">
                    اطلاعات تکمیلی گزارش{" "}
                  </div>
                  <Textarea
                    required={managerDescIsRequired}
                    isRequired={managerDescIsRequired}
                    name="managerDescription"
                    label="توضیحات "
                    labelPlacement="outside"
                    placeholder="در صورت نیاز توضیحات خود را وارد کنید"
                    fullWidth={true}
                    type="text"
                    variant="bordered"
                    isInvalid={managerDescriptionError}
                    errorMessage={
                      managerDescriptionError
                        ? "در صورت رد یا ویرایش درخواست باید توضیحات مربوطه وارد شود."
                        : undefined
                    }
                    classNames={{
                      inputWrapper:
                        "border border-secondary-950/[.2] rounded-[16px]",
                      input:
                        "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
                      label: `font-medium text-[14px]/[23px] text-secondary-950`,
                    }}
                    onChange={(e) => {
                      setValue("managerDescription", e.target.value);
                      if (managerDescriptionError) {
                        setManagerDescriptionError(false);
                      }
                    }}
                  />

                  {buttons && (
                    <div className="flex mt-4 items-center justify-end  gap-x-[12px]">
                      {buttons.map((button) => button)}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
          <RequestDetail
            formData={detailRows}
            CreatedDate={requestStatus?.CreatedDate}
          />
        </div>
      </div>
      <RequestFlowModal
        isOpen={isRequestFlowOpen}
        onOpenChange={onOpenChangeRequestFlow}
        requestTimeline={requestTimeline}
      />

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onOpenChange={onApproveModalOpenChange}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#1C3A63]">
                تایید درخواست
              </ModalHeader>
              <ModalBody>
                <p>آیا از تایید این درخواست مطمئن هستید؟</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  className="text-[#1C3A63] border-[#26272B33] border-1 rounded-[12px]"
                  onPress={onClose}
                >
                  انصراف
                </Button>
                <Button
                  variant="solid"
                  className="bg-[#1C3A63] text-white rounded-[12px]"
                  onPress={confirmApprove}
                  isLoading={isApproving || isCompletingTask}
                >
                  تایید
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onOpenChange={onRejectModalOpenChange}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#FF1751]">رد درخواست</ModalHeader>
              <ModalBody>
                <p>آیا از رد این درخواست مطمئن هستید؟</p>
                <p className="text-sm text-gray-600 mt-2">
                  این عمل قابل بازگشت نیست.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  className="text-[#1C3A63] border-[#26272B33] border-1 rounded-[12px]"
                  onPress={onClose}
                >
                  انصراف
                </Button>
                <Button
                  variant="solid"
                  className="bg-[#FF1751] text-white rounded-[12px]"
                  onPress={confirmReject}
                  isLoading={isRejecting || isCompletingTask}
                >
                  رد درخواست
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Confirmation Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={onEditModalOpenChange}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#1C3A63]">
                ویرایش درخواست
              </ModalHeader>
              <ModalBody>
                <p>آیا از ارجاع این درخواست برای ویرایش مطمئن هستید؟</p>
                <p className="text-sm text-gray-600 mt-2">
                  درخواست به درخواست‌دهنده ارجاع داده می‌شود.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  className="text-[#1C3A63] border-[#26272B33] border-1 rounded-[12px]"
                  onPress={onClose}
                >
                  انصراف
                </Button>
                <Button
                  variant="solid"
                  className="bg-[#1C3A63] text-white rounded-[12px]"
                  onPress={confirmEdit}
                  isLoading={isEditing || isCompletingTask}
                >
                  تایید
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </TaskInboxLayout>
  );
}
