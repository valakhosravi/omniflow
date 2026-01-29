import { useCamunda, useGetTaskByIdQuery } from "@/packages/camunda";
import CustomButton from "@/ui/Button";
import { addToaster } from "@/ui/Toaster";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import RequestSummary from "./RequestSummary";
import { Button } from "@heroui/react";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import UploadMultipleFile from "./UploadMultipleFile";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import Description from "@/packages/features/task-inbox/pages/requests/contract-request/components/Description";
import AppFile from "@/components/common/AppFile";
import { FileType } from "@/components/common/AppFile/AppFile.types";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";

interface ManagerFormProps {
  requestId: string;
  refetch: () => void;
  developRequestDetails: GeneralResponse<GetDevelopmentTicketModel> | undefined;
}

export default function ManagerForm({
  refetch,
  requestId,
  developRequestDetails,
}: ManagerFormProps) {
  const {
    completeTaskWithPayload,
    isCompletingTask,
    isClaimingTask,
    claimTaskWithPayload,
  } = useCamunda();
  const router = useRouter();

  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");

  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);

  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const [isEditNeededRequest, setIsEditNeededRequest] = useState(false);

  const [isTaskClaimed, setIsTaskClaimed] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileType[]>([]);

  const { userDetail } = useAuth();

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

  useEffect(() => {
    if (taskData?.assignee) {
      setIsTaskClaimed(true);
    }
  }, [taskData?.assignee]);

  const isTaskAlreadyClaimed = useMemo(
    () => taskData?.assignee !== null,
    [taskData?.assignee]
  );

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
          userId: String(Number(userDetail?.UserDetail.PersonnelId)),
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
  }, [taskId, claimTaskWithPayload, userDetail?.UserDetail.PersonnelId]);

  const onCompleteRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    setManagerRejectDescriptionError(false);
    setIsAcceptingRequest(true);

    try {
      await completeTaskWithPayload(taskId, {
        ManagerApprove: true,
        ManagerDescription: managerDescription,
        ManagerEdit: false,
      });

      // Revalidate request status after task completion
      refetch();
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
    managerDescription,
    router,
  ]);

  const onRejectRequestClick = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    if (managerDescription.trim() === "") {
      addToaster({
        color: "danger",
        title: "توضیحات رد درخواست را وارد کنید",
      });
      setManagerRejectDescriptionError(true);
      return;
    }

    setIsRejectingRequest(true);
    try {
      await completeTaskWithPayload(taskId, {
        ManagerApprove: false,
        ManagerDescription: managerDescription,
        ManagerEdit: false,
      });

      // Revalidate request status after task completion
      refetch();
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
    managerDescription,
    refetch,
    router,
  ]);

  const onEditNeeded = useCallback(async () => {
    if (!taskId) return;

    if (!isTaskClaimed) {
      addToaster({
        color: "warning",
        title: "ابتدا باید وظیفه را دریافت کنید",
      });
      return;
    }

    if (managerDescription.trim() === "") {
      addToaster({
        color: "danger",
        title: "توضیحات نیازمند اقدام درخواست دهنده را وارد کنید",
      });
      setManagerRejectDescriptionError(true);
      return;
    }

    setIsEditNeededRequest(true);
    try {
      await completeTaskWithPayload(taskId, {
        ManagerApprove: false,
        ManagerDescription: managerDescription,
        ManagerEdit: true,
      });

      refetch();
      addToaster({
        color: "success",
        title: "درخواست با موفقیت بازگشت خورد",
      });
      // Navigate to task inbox
      router.replace("/task-inbox?tab=mytask");
    } catch (error: any) {
      addToaster({
        color: "danger",
        title: error.data.message,
      });
    } finally {
      setIsEditNeededRequest(false);
    }
  }, [
    taskId,
    completeTaskWithPayload,
    isTaskClaimed,
    managerDescription,
    refetch,
    router,
  ]);

  const buttons = [
    <CustomButton
      buttonSize="sm"
      buttonVariant="outline"
      className="!rounded-[12px]"
      onPress={onEditNeeded}
      isLoading={isEditNeededRequest}
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
      onPress={onCompleteRequestClick}
      isLoading={isAcceptingRequest}
    >
      تایید درخواست
    </CustomButton>,
  ];

  if (!isTaskAlreadyClaimed && !isTaskClaimed) {
    return (
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="solid"
          className="bg-[#1C3A63] text-white rounded-[12px]"
          size="md"
          onPress={handleClaimTask}
          isLoading={isClaimingTask}
          disabled={isClaimingTask}
        >
          {isClaimingTask ? "در حال دریافت وظیفه..." : "دریافت وظیفه"}
        </Button>
        {claimError && (
          <span className="text-red-500 text-sm">{claimError}</span>
        )}
      </div>
    );
  }
  return (
    <>
      <RequestSummary
        requestId={requestId}
        developRequestDetails={developRequestDetails}
      />
      <AppFile
        enableUpload={false}
        requestId={String(requestId)}
        featureName={FeatureNamesEnum.DEVELOPMENT}
        files={files}
        setFiles={setFiles}
      />
      <Description
        buttons={buttons}
        title="اطلاعات تکمیلی تیکت توسعه"
        setManagerDescription={setManagerDescription}
        managerDescription={managerDescription}
        managerRejectDescriptionError={managerRejectDescriptionError}
      />
    </>
  );
}
