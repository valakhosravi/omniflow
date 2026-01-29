import { useCamunda, useGetTaskByIdQuery } from "@/packages/camunda";
import CustomButton from "@/ui/Button";
import { useDisclosure } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import RequestSummary from "./RequestSummary";
import SubmitJiraTicketModal from "./SubmitJiraTicketModal";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { addToaster } from "@/ui/Toaster";
import SpecialistReferralModal from "./SpecialistReferralModal";
import CreateJiraIssueModal from "./CreateJiraIssueModal";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useGetDevelopmentRequestDetailsQuery } from "../../api/developmentApi";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import { useCreateJiraIssueMutation } from "../../api/jiraApi";
import Description from "@/packages/features/task-inbox/pages/requests/contract-request/components/Description";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";

interface SpecialistFormProps {
  requestId: string;
  refetch: () => void;
  developRequestDetails: GeneralResponse<GetDevelopmentTicketModel> | undefined;
  formKey: string;
}

export default function SpecialistForm({
  requestId,
  refetch,
  developRequestDetails,
  formKey,
}: SpecialistFormProps) {
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");
  const router = useRouter();
  const { userDetail } = useAuth();

  const [managerDescription, setManagerDescription] = useState("");
  const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
    useState(false);

  const [isTaskClaimed, setIsTaskClaimed] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenJira,
    onOpen: onOpenJira,
    onOpenChange: onOpenChangeJira,
  } = useDisclosure();
  const {
    isOpen: isOpenCreateJira,
    onOpen: onOpenCreateJira,
    onOpenChange: onOpenChangeCreateJira,
  } = useDisclosure();
  const [isRejectingRequest, setIsRejectingRequest] = useState(false);
  const [isEditNeededRequest, setIsEditNeededRequest] = useState(false);
  const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);

  const { completeTaskWithPayload, isCompletingTask } = useCamunda();

  const { data: developTicketDetail } = useGetDevelopmentRequestDetailsQuery(
    Number(requestId)
  );

  const [developmentData, setDevelopmentData] = useState(null);

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

    if (managerDescription.length === 0) {
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
        PeApprove: false,
        PeDescription: managerDescription,
        PeEdit: false,
        SecondExpertPersonnelId: "",
        Priority: "",
        StackHolderContactPoint: "",
        Component: "",
        LetterNumber: "",
        DevelopId: developTicketDetail?.Data?.DevelopId || 0,
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
    developTicketDetail,
  ]);

  const onEditNeeded = useCallback(async () => {
    if (!taskId) return;

    // if (!isTaskClaimed) {
    //   addToaster({
    //     color: "warning",
    //     title: "ابتدا باید وظیفه را دریافت کنید",
    //   });
    //   return;
    // }

    if (managerDescription.length === 0) {
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
        PeApprove: false,
        PeDescription: managerDescription,
        PeEdit: true,
        SecondExpertPersonnelId: "",
        Priority: "",
        StackHolderContactPoint: "",
        Component: "",
        LetterNumber: "",
        DevelopId: developTicketDetail?.Data?.DevelopId || 0,
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
    developTicketDetail,
  ]);

  const [createJiraIssue, { isLoading: isCreating }] =
    useCreateJiraIssueMutation();

  const [files, setFiles] = useState<FileType[] | []>([]);

  const onCompleteRequestClickSpetialist = useCallback(async () => {
    if (!taskId) return;

    setManagerRejectDescriptionError(false);
    setIsAcceptingRequest(true);
    try {
      await completeTaskWithPayload(taskId, {
        PeApprove: true,
        PeDescription: managerDescription || "",
        PeEdit: false,
        DevelopId: developTicketDetail?.Data?.DevelopId || 0,
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
    managerDescription,
    developTicketDetail,
    router,
    refetch,
    requestId,
  ]);

  const buttons = useMemo(() => {
    return [
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
        buttonVariant="outline"
        className="!rounded-[12px]"
        onPress={onOpenCreateJira}
      >
        ایجاد تیکت جیرا
      </CustomButton>,
      <CustomButton
        buttonSize="sm"
        buttonVariant="primary"
        className="!rounded-[12px]"
        onPress={async () => {
          console.log(
            "first",
            (userDetail as any).UserDetail.PersonnelId,
            (developmentData as any)?.JiraTaskAssignee,
            (userDetail as any).UserDetail.PersonnelId ==
              (developmentData as any)?.JiraTaskAssignee
          );
          if (
            userDetail &&
            userDetail.UserDetail.PersonnelId &&
            userDetail.UserDetail.PersonnelId ==
              (developmentData as any)?.JiraTaskAssignee
          ) {
            console.log("onOpenJira");
            onOpenJira();
          } else {
            onCompleteRequestClickSpetialist();

            addToaster({
              color: "success",
              title: "تیکت جیرا با موفقیت ایجاد شد",
            });
          }
        }}
        isLoading={isAcceptingRequest}
      >
        تایید درخواست
      </CustomButton>,
    ];
  }, [
    developmentData,
    onOpen,
    onEditNeeded,
    onRejectRequestClick,
    onOpenCreateJira,
  ]);

  return (
    <>
      <RequestSummary
        requestId={requestId}
        developRequestDetails={developRequestDetails}
        setDevelopmentData={setDevelopmentData as any}
      />
      {formKey === "development-product-specialist-review" && (
        <AppFile
          requestId={requestId}
          isMultiple={false}
          files={files}
          setFiles={setFiles}
          enableUpload={true}
          featureName={FeatureNamesEnum.DEVELOPMENT}
        />
      )}
      <Description
        buttons={buttons}
        title="اطلاعات تکمیلی تیکت توسعه"
        managerDescription={managerDescription}
        setManagerDescription={setManagerDescription}
        managerRejectDescriptionError={managerRejectDescriptionError}
      />
      <SpecialistReferralModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        developRequestDetails={developRequestDetails}
        refetch={refetch}
        processInstanceId={developRequestDetails?.Data?.InstanceId}
      />
      <SubmitJiraTicketModal
        requestId={requestId}
        isOpen={isOpenJira}
        onOpenChange={onOpenChangeJira}
        taskId={taskId}
        refetch={refetch}
        managerDescription={managerDescription}
        setManagerRejectDescriptionError={setManagerRejectDescriptionError}
        formKey={formKey}
      />
      <CreateJiraIssueModal
        isOpen={isOpenCreateJira}
        onOpenChange={onOpenChangeCreateJira}
        developRequestDetails={developRequestDetails}
        developTicketDetail={developTicketDetail}
        requestId={requestId}
        onSuccess={() => {
          refetch();
        }}
      />
    </>
  );
}
