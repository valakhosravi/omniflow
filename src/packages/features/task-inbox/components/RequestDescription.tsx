import { addToaster } from "@/ui/Toaster";
import { FORM_KEYS } from "../constants/constant";
import { renderFormByKey } from "./renderFormByKey";
import SummaryOfRequest from "./SummaryOfRequest";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCamunda, useGetTaskByIdQuery } from "@/packages/camunda";
import { useGetSalaryAdvancedPaidRequestPerYearQuery } from "../../advance-money/api/advanceMoneyApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetRequestByIdProcess } from "@/hooks/process/useHumanResource";
import { useLazyGetEmployeeInfoByPersonnelIdQuery } from "../api/employmentCertificateApi";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import { LoanRequestDetails } from "@/models/advance-money/LoanRequestDetails";
import { useAuth } from "@/packages/auth/hooks/useAuth";

interface RequestDescriptionProps {
  formKey: string;
  requestId: string;
  requestStatus: GetLastRequestStatus | undefined;
  loanRequestDetails: LoanRequestDetails | undefined;
  refetch: () => void;
}

export default function RequestDescription({
  formKey,
  requestId,
  requestStatus,
  loanRequestDetails,
  refetch,
}: RequestDescriptionProps) {
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");
  const router = useRouter();
  const [paymentId, setPaymentId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [hrRejectDescription, setHrRejectDescription] = useState("");
  const [hrRejectDescriptionError, setHrRejectDescriptionError] =
    useState(false);

  const [amount, setAmount] = useState("");
  const [ibanNumber, setIbanNumber] = useState("");

  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isEditingRequest, setIsEditingRequest] = useState(false);

  const [isTaskClaimed, setIsTaskClaimed] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const {
    completeTaskWithPayload,
    claimTaskWithPayload,
    isClaimingTask,
    isCompletingTask,
  } = useCamunda();

  const {
    data: salaryAdvancedPaidRequest,
    isLoading: isSalaryAdvancedPaidRequestLoading,
  } = useGetSalaryAdvancedPaidRequestPerYearQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: taskData,
    isLoading: isTaskLoading,
    error: taskError,
  } = useGetTaskByIdQuery(taskId || "", {
    skip: !taskId,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const { requestData } = useGetRequestByIdProcess(Number(requestId));
  const [
    getEmployeeInfoByPersonnelId,
    { data: userData, isLoading: isLoadingUser, isError: isErrorUser },
  ] = useLazyGetEmployeeInfoByPersonnelIdQuery();
  const { user, userDetail } = useAuth();

  useEffect(() => {
    if (taskData?.assignee) {
      setIsTaskClaimed(true);
    }
  }, [taskData?.assignee]);

  useEffect(() => {
    if (requestData?.Data?.PersonnelId) {
      getEmployeeInfoByPersonnelId(requestData.Data.PersonnelId);
    }
  }, [requestData]);

  const handleClaimTask = useCallback(async () => {
    if (!taskId) {
      addToaster({
        color: "danger",
        title: "شناسه وظیفه یافت نشد",
      });
      return;
    }

    try {
      setClaimError(null);
      await claimTaskWithPayload(
        taskId,
        {
          userId: String(Number(userData?.Data?.PersonnelId)),
        },
        {
          requestId: Number(requestId),
        }
      );

      refetch();
      setIsTaskClaimed(true);
    } catch (error: any) {
      const errorMessage = error.data.message || "خطا در دریافت وظیفه";
      // setClaimError(errorMessage);
      addToaster({
        color: "danger",
        title: errorMessage,
      });
    }
  }, [taskId, claimTaskWithPayload, userData?.Data?.PersonnelId]);

  // Separate reject function (no longer includes claim)
  const onRejectRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    if (hrRejectDescription.trim() === "") {
      addToaster({
        color: "danger",
        title: "توضیحات رد درخواست را وارد کنید",
      });
      setHrRejectDescriptionError(true);
      return;
    }

    setIsRejectingRequest(true);
    try {
      await completeTaskWithPayload(taskId, {
        HRHApprove: false,
        HRHDescription: hrRejectDescription,
        HRHEdit: false,
        Amount: Number(amount.replace(/,/g, "")),
        Destination: ibanNumber,
        Assign: false,
        SalaryAdvanceId: Number(loanRequestDetails?.RequestId),
      });
      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsRejectingRequest(false);
    }
  }, [
    taskId,
    completeTaskWithPayload,
    isTaskClaimed,
    hrRejectDescription,
    amount,
    ibanNumber,
    refetch,
    router,
  ]);

  // Separate approve function (no longer includes claim)
  const onCompleteRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    setHrRejectDescriptionError(false);
    setIsAcceptingRequest(true);

    try {
      await completeTaskWithPayload(taskId, {
        HRHApprove: true,
        HRHDescription: hrRejectDescription,
        HRHEdit: false,
        Amount: Number(amount.replace(/,/g, "")),
        Destination: ibanNumber,
        Assign: false,
        HRHPersonnelId: Number(user?.PersonnelId || "0"),
        HRHUserId: Number(userDetail?.UserDetail?.UserId || "0"),
        SalaryAdvanceId: Number(loanRequestDetails?.RequestId),
      });

      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsAcceptingRequest(false);
    }
  }, [
    taskId,
    completeTaskWithPayload,
    isTaskClaimed,
    hrRejectDescription,
    amount,
    ibanNumber,
    refetch,
    router,
    user,
    userDetail,
  ]);

  const onSendToHRMRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    setHrRejectDescriptionError(false);
    setIsAcceptingRequest(true);

    try {
      await completeTaskWithPayload(taskId, {
        HRHApprove: false,
        HRHDescription: hrRejectDescription,
        HRHEdit: false,
        Amount: Number(amount.replace(/,/g, "")),
        Destination: ibanNumber,
        Assign: true,
        HRHPersonnelId: Number(user?.PersonnelId || "0"),
        HRHUserId: Number(userDetail?.UserDetail?.UserId || "0"),
        SalaryAdvanceId: Number(loanRequestDetails?.RequestId),
      });

      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsAcceptingRequest(false);
    }
  }, [
    taskId,
    completeTaskWithPayload,
    isTaskClaimed,
    hrRejectDescription,
    amount,
    ibanNumber,
    refetch,
    router,
    user,
    userDetail,
  ]);

  // Separate FM reject function (no longer includes claim)
  const onFMRejectRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    if (hrRejectDescription.trim() === "") {
      addToaster({
        color: "danger",
        title: "توضیحات رد درخواست را وارد کنید",
      });
      setHrRejectDescriptionError(true);
      return;
    }

    setIsRejectingRequest(true);
    try {
      await completeTaskWithPayload(taskId, {
        FMApprove: false,
        FMDescription: hrRejectDescription,
      });

      addToaster({
        color: "success",
        title: "درخواست با موفقیت رد شد",
      });
      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsRejectingRequest(false);
    }
  }, [
    taskId,
    completeTaskWithPayload,
    isTaskClaimed,
    hrRejectDescription,
    refetch,
    router,
  ]);

  // Separate FM approve function (no longer includes claim)
  const onFMCompleteRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    setHrRejectDescriptionError(false);
    setIsAcceptingRequest(true);

    try {
      await completeTaskWithPayload(taskId, {
        FMApprove: true,
        FMDescription: hrRejectDescription,
      });
      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsAcceptingRequest(false);
    }
  }, [
    taskId,
    completeTaskWithPayload,
    isTaskClaimed,
    hrRejectDescription,
    refetch,
    router,
  ]);

  // Separate TE approve function (no longer includes claim)
  const onTEEditRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    if (hrRejectDescription.trim() === "") {
      addToaster({
        color: "danger",
        title: "توضیحات رد درخواست را وارد کنید",
      });
      setHrRejectDescriptionError(true);
      return;
    }

    setHrRejectDescriptionError(false);
    setIsEditingRequest(true);

    try {
      await completeTaskWithPayload(taskId, {
        IsPaid: false,
        TEDescription: hrRejectDescription,
        ReferenceCode: "",
        TEEdit: true,
      });
      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsEditingRequest(false);
    }
  }, [
    taskId,
    completeTaskWithPayload,
    isTaskClaimed,
    hrRejectDescription,
    router,
  ]);

  // Separate TE approve function (no longer includes claim)
  const onTECompleteRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    setHrRejectDescriptionError(false);
    setIsAcceptingRequest(true);

    try {
      await completeTaskWithPayload(taskId, {
        IsPaid: paymentStatus === "success" ? true : false,
        TEDescription: hrRejectDescription,
        ReferenceCode: paymentId,
        // TEEdit: false,
      });
      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsAcceptingRequest(false);
    }
  }, [
    taskId,
    completeTaskWithPayload,
    isTaskClaimed,
    hrRejectDescription,
    router,
  ]);

  // Separate HRM reject function (no longer includes claim)
  const onHRMRejectRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    if (hrRejectDescription.trim() === "") {
      addToaster({
        color: "danger",
        title: "توضیحات رد درخواست را وارد کنید",
      });
      setHrRejectDescriptionError(true);
      return;
    }

    setIsRejectingRequest(true);
    try {
      await completeTaskWithPayload(taskId, {
        HRMApprove: false,
        HRMDescription: hrRejectDescription,
      });
      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsRejectingRequest(false);
    }
  }, [
    taskId,
    completeTaskWithPayload,
    isTaskClaimed,
    hrRejectDescription,
    refetch,
    router,
  ]);

  // Separate HRM approve function (no longer includes claim)
  const onHRMCompleteRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    setHrRejectDescriptionError(false);
    setIsAcceptingRequest(true);

    try {
      await completeTaskWithPayload(taskId, {
        HRMApprove: true,
        HRMDescription: hrRejectDescription,
      });
      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsAcceptingRequest(false);
    }
  }, [
    taskId,
    completeTaskWithPayload,
    isTaskClaimed,
    hrRejectDescription,
    refetch,
    router,
  ]);

  // Check if task is already claimed
  const isTaskAlreadyClaimed = useMemo(
    () => taskData?.assignee !== null,
    [taskData?.assignee]
  );

  const commonProps = {
    claimError,
    handleClaimTask,
    hrRejectDescription,
    hrRejectDescriptionError,
    isAcceptingRequest,
    isClaimingTask,
    isCompletingTask,
    isRejectingRequest,
    isTaskAlreadyClaimed,
    isTaskClaimed,
    setHrRejectDescription,
    completeTaskWithPayload,
    taskId,
  };

  const extraPropsByForm: Record<string, any> = {
    [FORM_KEYS.HRH_CHECK]: {
      loanRequestDetails: loanRequestDetails,
      onCompleteRequestClick,
      onRejectRequestClick,
      onSendToHRMRequestClick,
      setAmount,
      setIbanNumber,
    },
    [FORM_KEYS.PRE_CHECK]: {
      loanRequestDetails: loanRequestDetails,
      onCompleteRequestClick,
      onRejectRequestClick,
      amount,
      ibanNumber,
      setAmount,
      setIbanNumber,
    },
    [FORM_KEYS.HRM_CHECK]: {
      onHRMCompleteRequestClick,
      onHRMRejectRequestClick,
    },
    [FORM_KEYS.FM_CHECK]: {
      onFMCompleteRequestClick,
      onFMRejectRequestClick,
    },
    [FORM_KEYS.TE_CHECK]: {
      onTECompleteRequestClick,
      onTEEditRequestClick,
      paymentId,
      setPaymentId,
      paymentStatus,
      setPaymentStatus,
      isEditingRequest,
      requestId,
      taskId,
    },
  };

  return (
    <div className="col-span-8">
      <div className="border border-[#D8D9DF] p-4 rounded-[20px]">
        <div className="text-[#1C3A63] pb-3 mb-4 border-b border-[#1C3A631A]">
          شرح درخواست
        </div>
        <SummaryOfRequest
          trackingCode={requestData?.Data?.TrackingCode}
          StatusCode={requestStatus?.StatusCode}
          userData={userData?.Data}
          formKey={formKey}
          loanRequestDetails={loanRequestDetails}
          salaryAdvancedPaidRequest={salaryAdvancedPaidRequest?.Data as any}
        />
        {renderFormByKey(formKey, commonProps, extraPropsByForm[formKey] || {})}
      </div>
    </div>
  );
}
