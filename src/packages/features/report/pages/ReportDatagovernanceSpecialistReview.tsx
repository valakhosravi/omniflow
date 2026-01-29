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
} from "iconsax-reactjs";
import { useGetRequestByIdQuery } from "../../task-inbox/api/RequestApi";
import { STATUS_STYLES } from "../../task-inbox/constants/constant";
import { useRequestStatus } from "../../task-inbox/hooks/useRequestStatus";
import { useRequestTimeline } from "../../task-inbox/hooks/useRequestTimeline";
import TaskInboxLayout from "../../task-inbox/layouts";
import CustomButton from "@/ui/Button";
import { useDisclosure, Spinner, Button } from "@heroui/react";
import RequestFlowModal from "../../task-inbox/components/RequestFlowModal";
import RequestDetail from "../../development-ticket/components/v2/RequestDetail";
import { useGetReportByRequestIdQuery } from "../api/ReportApi";
import AppInfoRow from "@/components/common/AppInfoRow/AppInfoRow";
import { Textarea, Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import { useState, useEffect } from "react";
import { useCamunda } from "@/packages/camunda";
import { useRouter, useSearchParams } from "next/navigation";
import { addToaster } from "@/ui/Toaster";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@/ui/NextUi";
import { Icon } from "@/ui/Icon";
import {
  useGetGroupUserByPropertyQuery,
  useGetStackHolderDirectorsQuery,
  useGetStackHoldersQuery,
} from "@/services/commonApi/commonApi";
import { GroupUsersPropertyEnum } from "@/services/commonApi/commonApi.type";

export default function ReportDataGovernanceSpecialistReview({
  requestId,
}: {
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
  const [managerDescription, setManagerDescription] = useState("");
  const [managerDescriptionError, setManagerDescriptionError] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReferring, setIsReferring] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [selectedStackHolder, setSelectedStackHolder] = useState<string>("");
  const [selectedTaskFollower, setSelectedTaskFollower] = useState<string>("");
  const [selectedReportRecipient, setSelectedReportRecipient] =
    useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [jiraSummaryError, setJiraSummaryErrorError] = useState(false);

  const [jiraDescription, setJiraDescription] = useState<string>("");
  const [jiraDescriptionError, setJiraDescriptionError] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const { data: groupUsers, isLoading: isLoadingExperts } =
    useGetGroupUserByPropertyQuery(GroupUsersPropertyEnum.REPORT);
  const { data: stackHolders, isLoading: isLoadingStackHolders } =
    useGetStackHoldersQuery();
  const {
    data: stackHolderDirectors,
    isLoading: isLoadingStackHolderDirectors,
  } = useGetStackHolderDirectorsQuery();

  const {
    isOpen: isRequestFlowOpen,
    onOpen: onRequestFlowOpen,
    onOpenChange: onOpenChangeRequestFlow,
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
  const {
    isOpen: isReferModalOpen,
    onOpen: onReferModalOpen,
    onOpenChange: onReferModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isApproveJiraModalOpen,
    onOpen: onApproveJiraModalOpen,
    onOpenChange: onApproveJiraModalOpenChange,
  } = useDisclosure();

  useEffect(() => {
    if (reportData?.Data) {
      setNeedToCompare(reportData.Data.NeedCompare || false);
      setModelingRequest(reportData.Data.IsAiml || false);
    }
  }, [reportData]);

  const detailRows = [
    {
      title: "وضعیت درخواست",
      value: (
        <div
          className={`text-[14px] py-1 px-3 font-[600] rounded-[24px] ${
            STATUS_STYLES[requestStatus?.StatusCode || 0]
          }`}
        >
          {requestStatus?.StatusName || ""}
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
      title: "سمت",
      value: requestStatus?.JobPositionName || "",
      icon: <User size={16} />,
    },
  ];

  const generalInfoRows = [
    {
      icon: <DocumentText size={16} />,
      title: "عنوان درخواست",
      value: requestData?.Data?.Title || "-",
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
      value: reportData?.Data?.Target || "-",
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
      value: reportData?.Data?.Filters || "-",
    },
    {
      icon: <User size={16} />,
      title: "سطح دسترسی",
      value: reportData?.Data?.DataAccessName,
    },
    {
      icon: <Calendar size={16} />,
      title: "زمان مورد نیاز جهت تحویل",
      value: reportData?.Data?.DelivaryDate || "-",
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
  ];

  const handleApproveClick = () => {
    onApproveJiraModalOpen();
  };

  const handleApproveJiraModalChange = (open: boolean) => {
    if (!open) {
      setSelectedStackHolder("");
      setSelectedTaskFollower("");
      setSelectedReportRecipient("");
      setSummary("");
      setJiraDescription("");
    }
    if (open) {
      onApproveJiraModalOpen();
    } else {
      onApproveJiraModalOpenChange();
    }
  };

  const handleConfirmApproveWithJira = async () => {
    if (!selectedStackHolder) {
      addToaster({
        color: "danger",
        title: "لطفا ذینفع را انتخاب کنید",
      });
      return;
    }
    if (!selectedTaskFollower) {
      addToaster({
        color: "danger",
        title: "لطفا پیگیری کننده تسک را وارد کنید",
      });
      return;
    }
    if (!selectedReportRecipient) {
      addToaster({
        color: "danger",
        title: "لطفا شخص گیرنده گزارش را انتخاب کنید",
      });
      return;
    }
    if (!summary) {
      addToaster({
        color: "danger",
        title: "خلاصه را وارد کنید",
      });
      setJiraDescriptionError(true);
      return;
    }
    if (!jiraDescription) {
      addToaster({
        color: "danger",
        title: "توضیحات را وارد کنید",
      });
      setJiraDescriptionError(true);
      return;
    }
    setIsApproving(true);
    if (!taskId) {
      addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
      setIsApproving(false);
      onApproveJiraModalOpenChange();
      return;
    }
    try {
      await completeTaskWithPayload(taskId, {
        DeApprove: true,
        DeEdit: false,
        DeDescription: managerDescription,
        Summary: summary,
        JiraDescription: jiraDescription,
        StackHolder: selectedStackHolder,
        StackHolderContactPoint: selectedTaskFollower,
        StackHolderContactDirector: selectedReportRecipient,
      });
      refetch();
      setSelectedStackHolder("");
      setSelectedTaskFollower("");
      setSelectedReportRecipient("");
      setSummary("");
      setJiraDescription("");
      onApproveJiraModalOpenChange();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error?.data?.message || "خطا در تکمیل وظیفه",
      });
      setIsApproving(false);
    }
  };

  const handleRejectClick = () => {
    if (managerDescription.trim() === "") {
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
    if (managerDescription.trim() === "") {
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

  const handleReferClick = () => {
    onReferModalOpen();
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
        DeApprove: false,
        DeEdit: false,
        DeDescription: managerDescription,
        HasExpertAssignee: false,
        ExpertAssigneePersonnelId: "",
        Summary: "",
        JiraDescription: "",
        StackHolder: "",
        StackHolderContactPoint: "",
        StackHolderContactDirector: "",
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
        DeApprove: false,
        DeEdit: true,
        DeDescription: managerDescription,
        HasExpertAssignee: false,
        ExpertAssigneePersonnelId: "",
        Summary: "",
        JiraDescription: "",
        StackHolder: "",
        StackHolderContactPoint: "",
        StackHolderContactDirector: "",
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

  const handleReferModalChange = (open: boolean) => {
    if (!open) {
      setSelectedExpert(null);
    }
    if (open) {
      onReferModalOpen();
    } else {
      onReferModalOpenChange();
    }
  };

  const confirmRefer = async () => {
    if (!selectedExpert) {
      addToaster({
        color: "danger",
        title: "لطفا کارشناس را انتخاب کنید",
      });
      return;
    }
    setIsReferring(true);
    if (!taskId) {
      addToaster({ color: "danger", title: "شناسه وظیفه یافت نشد" });
      setIsReferring(false);
      onReferModalOpenChange();
      return;
    }

    try {
      await completeTaskWithPayload(taskId, {
        DeApprove: false,
        DeEdit: false,
        DeDescription: managerDescription,
        HasExpertAssignee: true,
        ExpertAssigneePersonnelId: String(selectedExpert.PersonnelId),
        Summary: "",
        JiraDescription: "",
        StackHolder: "",
        StackHolderContactPoint: "",
        StackHolderContactDirector: "",
      });
      refetch();
      setSelectedExpert(null);
      onReferModalOpenChange();
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error?.data?.message || "خطا در تکمیل وظیفه",
      });
      setIsReferring(false);
    }
  };

  const buttons = [
    <div key={1}>
      <CustomButton
        buttonSize="sm"
        buttonVariant="outline"
        className="!rounded-[12px]"
        onPress={handleEditClick}
        isDisabled={isApproving || isRejecting || isEditing || isReferring}
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
        isDisabled={isApproving || isRejecting || isEditing || isReferring}
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
        isDisabled={isApproving || isRejecting || isEditing || isReferring}
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
              بررسی مدیر حاکمیتی داده و مبارزه با پولشویی
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
                    />
                  ))}
                </div>
              </div>

              {/* Manager Actions Section */}
              <div className="rounded-[20px] border border-[#1C3A631A] bg-[#f8f9fa] p-4">
                <div className="text-[14px] text-[#1C3A63] font-[500] mb-4 pb-3 border-b border-[#1C3A631A]">
                  اطلاعات تکمیلی
                </div>
                <Textarea
                  label="توضیحات :"
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
                  value={managerDescription}
                  onChange={(e) => {
                    setManagerDescription(e.target.value);
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

      {/* Refer Confirmation Modal - انتخاب کارشناس */}
      <Modal
        isOpen={isReferModalOpen}
        onOpenChange={handleReferModalChange}
        hideCloseButton
      >
        <ModalContent className="!w-[746px] max-w-[746px] max-h-[613px]">
          <ModalHeader className="flex justify-between items-center pt-[20px] px-[24px]">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              انتخاب کارشناس
            </h1>
            <Icon
              name="closeCircle"
              className="text-secondary-300 cursor-pointer"
              onClick={() => handleReferModalChange(false)}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[24px] bg-background-devider h-[1px]" />
          <ModalBody className="px-[24px] py-0 space-y-4">
            <p className="font-medium text-[16px]/[30px] text-primary-950/[.5]">
              ارجاع به کارشناس
            </p>
            <div className="border border-primary-950/[.1] rounded-[20px] px-5 py-4 h-[150px] min-h-[150px]">
              <Autocomplete
                className="w-full"
                variant="bordered"
                label="کارشناس را انتخاب کنید :"
                labelPlacement="outside"
                isRequired
                placeholder="کارشناسان"
                selectedKey={selectedExpert?.Key}
                onSelectionChange={(key) => {
                  const user = groupUsers?.Data?.Values.find(
                    (u) => u.Key === key
                  );
                  setSelectedExpert(user || null);
                }}
                errorMessage="انتخاب کارشناس ضروری است."
                popoverProps={{
                  offset: 10,
                  classNames: {
                    content: "shadow-none",
                  },
                }}
                inputProps={{
                  classNames: {
                    input: `font-normal text-[14px]/[20px] text-secondary-400`,
                    inputWrapper: `px-[8px] py-[6px] border-1 border-primary-950/[.7] rounded-[12px] h-[48px] min-h-[48px] shadow-none`,
                    innerWrapper: ``,
                  },
                }}
                classNames={{
                  base: `text-sm text-secondary-950 bg-white w-full`,
                  selectorButton: `text-secondary-400`,
                  popoverContent: `border border-default-300`,
                }}
              >
                {(groupUsers?.Data?.Values ?? []).map((user) => (
                  <AutocompleteItem
                    className="data-[selected=true]:opacity-60"
                    key={user.Key}
                  >
                    {user.DisplayName}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </ModalBody>
          <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[150px] pb-[20px] px-[24px]">
            <CustomButton
              buttonSize="sm"
              buttonVariant="outline"
              className="flex items-center justify-center min-w-[102px] min-h-[40px] rounded-[12px] cursor-pointer font-semibold text-[14px]/[20px]"
              onPress={() => handleReferModalChange(false)}
            >
              انصراف
            </CustomButton>
            <CustomButton
              buttonSize="sm"
              buttonVariant="primary"
              className="flex items-center justify-center min-w-[118px] min-h-[40px] rounded-[12px] text-secondary-0 cursor-pointer font-semibold text-[14px]/[20px]"
              onPress={confirmRefer}
              isLoading={isReferring || isCompletingTask}
            >
              تایید
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Approve Jira Modal - تایید گزارش */}
      <Modal
        isOpen={isApproveJiraModalOpen}
        onOpenChange={handleApproveJiraModalChange}
        hideCloseButton
      >
        <ModalContent className="!w-[746px] max-w-[746px] max-h-[90vh] flex flex-col">
          <ModalHeader className="flex justify-between items-center pt-[20px] px-[24px] flex-shrink-0">
            <h1 className="font-semibold text-[16px]/[30px] text-secondary-950">
              تایید گزارش
            </h1>
            <Icon
              name="closeCircle"
              className="text-secondary-300 cursor-pointer"
              onClick={() => handleApproveJiraModalChange(false)}
            />
          </ModalHeader>
          <div className="mt-[8px] mb-[14px] mx-[24px] bg-background-devider h-[1px] flex-shrink-0" />
          <ModalBody className="px-[24px] py-0 space-y-4 overflow-y-auto flex-1">
            {/* <p className="font-medium text-[16px]/[30px] text-primary-950/[.5]">
              ثبت تسک در جیرا
            </p> */}
            <div className="space-y-4 mb-4">
              {/* ذینفع (Beneficiary) */}
              <div className="flex flex-col space-y-[10px]">
                <label className="text-[14px]/[27px] font-medium text-secondary-900">
                  <span>ذینفع</span>
                  <span className="text-accent-500">*</span>
                </label>
                <Select
                  selectedKeys={
                    selectedStackHolder ? [selectedStackHolder] : []
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setSelectedStackHolder(value || "");
                  }}
                  placeholder="ذینفع را انتخاب کنید"
                  className="w-full"
                  classNames={{
                    trigger:
                      "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                    value: "text-right",
                    popoverContent: "border border-[#D8D9DF]",
                  }}
                  isLoading={isLoadingStackHolders}
                >
                  {(stackHolders?.Data ?? []).map((stackHolder) => (
                    <SelectItem key={stackHolder.Description}>
                      {stackHolder.Description}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* پیگیری کننده تسک (Task Follower) */}
              <div className="flex flex-col space-y-[10px]">
                <label className="text-[14px]/[27px] font-medium text-secondary-900">
                  <span>پیگیری کننده تسک :</span>
                  <span className="text-accent-500">*</span>
                </label>
                <Input
                  value={selectedTaskFollower}
                  onValueChange={setSelectedTaskFollower}
                  placeholder="پیگیری کننده تسک را وارد کنید"
                  className="w-full"
                  classNames={{
                    input: "text-right dir-rtl",
                    inputWrapper:
                      "border border-[#D8D9DF] rounded-[12px] bg-white",
                  }}
                />
              </div>

              {/* شخص گیرنده گزارش (Report Recipient) */}
              <div className="flex flex-col space-y-[10px]">
                <label className="text-[14px]/[27px] font-medium text-secondary-900">
                  <span>شخص گیرنده گزارش :</span>
                  <span className="text-accent-500">*</span>
                </label>
                <Select
                  selectedKeys={
                    selectedReportRecipient ? [selectedReportRecipient] : []
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setSelectedReportRecipient(value || "");
                  }}
                  placeholder="شخص گیرنده گزارش را انتخاب کنید"
                  className="w-full"
                  classNames={{
                    trigger:
                      "border border-[#D8D9DF] rounded-[12px] bg-white text-right dir-rtl",
                    value: "text-right",
                    popoverContent: "border border-[#D8D9DF]",
                  }}
                  isLoading={isLoadingStackHolderDirectors}
                >
                  {(stackHolderDirectors?.Data ?? []).map((director) => (
                    <SelectItem key={director.Description || ""}>
                      {director.Description || ""}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* خلاصه  */}
              <div className="flex flex-col space-y-[10px]">
                <Input
                  label="خلاصه"
                  labelPlacement="outside"
                  value={summary}
                  onChange={(e) => {
                    setSummary(e.target.value);
                    if (jiraSummaryError) {
                      setJiraSummaryErrorError(false);
                    }
                  }}
                  errorMessage={jiraSummaryError ? "خلاصه الزامیست" : undefined}
                  required
                  isRequired
                  placeholder="خلاصه را وارد کنید"
                  className="w-full"
                  classNames={{
                    input: "text-right dir-rtl",
                    inputWrapper:
                      "border border-[#D8D9DF] rounded-[12px] bg-white",
                  }}
                />
              </div>

              {/* توضیحات جیرا  */}
              <div className="flex flex-col space-y-[10px]">
                <Textarea
                  label="توضیحات جیرا"
                  labelPlacement="outside"
                  type="text"
                  required
                  isRequired
                  // isInvalid={jiraDescriptionError}

                  value={jiraDescription}
                  onChange={(e) => {
                    setJiraDescription(e.target.value);
                    if (jiraDescriptionError) {
                      setJiraDescriptionError(false);
                    }
                  }}
                  errorMessage={
                    jiraDescriptionError ? "توضیحات الزامیست" : undefined
                  }
                  placeholder="توضیحات جیرا را وارد کنید"
                  className="w-full"
                  classNames={{
                    inputWrapper:
                      "border bg-[#f8f9fa] [data-hover=true]:bg-transparent border-secondary-950/[.2] rounded-[16px]",
                    input:
                      "text-right [data-hover=true]:bg-transparent dir-rtl font-normal text-[12px]/[18px] p-[16px]",
                    label: `[data-hover=true]:bg-transparent font-medium text-[14px]/[23px] text-secondary-950`,
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex items-center justify-end gap-x-[16px] pt-[12px] pb-[20px] px-[24px] flex-shrink-0">
            <CustomButton
              buttonSize="sm"
              buttonVariant="outline"
              className="flex items-center justify-center min-w-[102px] min-h-[40px] rounded-[12px] cursor-pointer font-semibold text-[14px]/[20px]"
              onPress={() => handleApproveJiraModalChange(false)}
            >
              انصراف
            </CustomButton>
            <CustomButton
              buttonSize="sm"
              buttonVariant="primary"
              className="flex items-center justify-center min-w-[118px] min-h-[40px] rounded-[12px] text-secondary-0 cursor-pointer font-semibold text-[14px]/[20px]"
              onPress={handleConfirmApproveWithJira}
              isLoading={isApproving || isCompletingTask}
            >
              تایید
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </TaskInboxLayout>
  );
}
