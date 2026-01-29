import CustomButton from "@/ui/Button";
import RequestSummary from "./RequestSummary";
import { useCallback, useEffect, useState } from "react";
import { useCamunda, useGetTaskByIdQuery } from "@/packages/camunda";
import { useRouter, useSearchParams } from "next/navigation";
import { addToaster } from "@/ui/Toaster";
import UploadMultipleFile from "./UploadMultipleFile";
import ReferralModal from "./ReferralModal";
import { useDisclosure } from "@heroui/react";
import GeneralResponse from "@/packages/core/types/api/general_response";
import SubmitJiraTicketModal from "./SubmitJiraTicketModal";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import Description from "@/packages/features/task-inbox/pages/requests/contract-request/components/Description";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";

interface ProductManagerFormProps {
  requestId: string;
  refetch: () => void;
  developRequestDetails: GeneralResponse<GetDevelopmentTicketModel> | undefined;
  formKey: string;
}

export default function ProductManagerForm({
  requestId,
  refetch,
  developRequestDetails,
  formKey,
}: ProductManagerFormProps) {
  const { onOpen, onOpenChange, isOpen } = useDisclosure();
  const {
    onOpen: onOpenJira,
    onOpenChange: onOpenChangeJira,
    isOpen: isOpenJira,
  } = useDisclosure();
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const router = useRouter();

  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");

  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);
  const [files, setFiles] = useState<FileType[]>([]);

  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const [isEditNeededRequest, setIsEditNeededRequest] = useState(false);

  const [isTaskClaimed, setIsTaskClaimed] = useState(false);

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
        PmApprove: false,
        PmDescription: managerDescription,
        PmEdit: false,
        HasExpertAssignee: false,
        ExpertAssigneePersonnelId: "",
        Summary: "",
        JiraDescription: "",
        StackHolder: "",
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
        PmApprove: false,
        PmDescription: managerDescription,
        PmEdit: true,
        HasExpertAssignee: false,
        ExpertAssigneePersonnelId: "",
        Summary: "",
        JiraDescription: "",
        StackHolder: "",
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
      onPress={onOpen}
    >
      ارجاع
    </CustomButton>,
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
      // onPress={onCompleteRequestClick}
      onPress={onOpenJira}
      isLoading={isAcceptingRequest}
    >
      تایید درخواست
    </CustomButton>,
  ];

  return (
    <>
      <RequestSummary
        requestId={requestId}
        developRequestDetails={developRequestDetails}
      />
      {/* <UploadMultipleFile
        requestId={requestId}
        classNames="w-full"
        title="بارگذاری فایل"
        canUpload={false}
      /> */}
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
        managerDescription={managerDescription}
        setManagerDescription={setManagerDescription}
        managerRejectDescriptionError={managerRejectDescriptionError}
      />
      <ReferralModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <SubmitJiraTicketModal
        isOpen={isOpenJira}
        onOpenChange={onOpenChangeJira}
        taskId={taskId}
        refetch={refetch}
        managerDescription={managerDescription}
        setManagerRejectDescriptionError={setManagerRejectDescriptionError}
        formKey={formKey}
        requestId={requestId}
      />
    </>
  );
}
