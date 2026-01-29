import {
  GetContractInfo,
  ContractClauseDetails,
  TermDetails,
  SubClauseDetails,
} from "../types/contractModel";
import RequestDetail from "../../development-ticket/components/v2/RequestDetail";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import { STATUS_STYLES } from "../../task-inbox/constants/constant";
import { Clock, Document, Refresh, User } from "iconsax-reactjs";
import HistoryOfClausesDrawer from "../components/lmc/HistoryOfClausesDrawer";
import ContractReview, { Comment } from "../components/lmc/ContractReview";
import {
  useGetContractAssigneeWithContractIdQuery,
  useGetContractInfoByRequestIdQuery,
  useUpdateContractAssigneeMutation,
} from "../api/contractApi";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useMemo, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { addToaster } from "@/ui/Toaster";
import { useGetRequestByIdQuery } from "../../task-inbox/api/RequestApi";
import { useCamunda } from "@/packages/camunda/hooks/useCamunda";
import { useRouter } from "next/navigation";
import CustomButton from "@/ui/Button";
import ContractAttachments from "../components/non-type/ContractAttachments";

interface LmcNonTypeFormReadOnlyProps {
  contractData: GetContractInfo;
  requestStatus: GetLastRequestStatus | undefined;
  onRefetch?: () => void;
  requestId?: string;
  taskId?: string | null;
}

export default function LmcNonTypeFormReadOnly({
  contractData: initialContractData,
  requestStatus,
  onRefetch,
  requestId,
  taskId,
}: LmcNonTypeFormReadOnlyProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { userDetail } = useAuth();
  const { completeTaskWithPayload, isCompletingTask } = useCamunda();
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  // Use query hook if requestId is provided to get refetch function
  const contractQuery = useGetContractInfoByRequestIdQuery(
    Number(requestId || 0),
    { skip: !requestId }
  );

  // Use the refetch from query if available, otherwise use the prop
  const refetchContract = contractQuery.refetch || onRefetch;

  // Get current contract data from query if available, otherwise use prop
  const contractData = contractQuery.data?.Data || initialContractData;

  // Fetch contract assignee data (which contains comments)
  const { data: contractAssignee, refetch: refetchTermAssignee } =
    useGetContractAssigneeWithContractIdQuery(contractData.ContractId, {
      skip: !contractData.ContractId,
    });

  // Update contract assignee mutation
  const [updateContractAssignee, { isLoading: isUpdatingAssignee }] =
    useUpdateContractAssigneeMutation();

  // Check if all user's comments have been replied to
  const allCommentsReplied = useMemo(() => {
    if (!contractAssignee?.Data || !userDetail?.UserDetail.UserId) {
      return false;
    }

    // Find all comments assigned to current user
    const userComments = contractAssignee.Data.filter(
      (assignee) => assignee.UserId === userDetail.UserDetail.UserId
    );

    // If no comments assigned to user, allow completion
    if (userComments.length === 0) {
      return true;
    }

    // Check if all user's comments have been replied to (StatusCode !== 1)
    // StatusCode: 1 = pending, 2 = approved, 3 = rejected
    const allReplied = userComments.every(
      (assignee) => assignee.StatusCode !== 1
    );

    console.log("Checking if all comments replied:", {
      userComments: userComments.length,
      allReplied,
      statuses: userComments.map((c) => ({
        id: c.ContractAssigneeId,
        status: c.StatusCode,
      })),
    });

    return allReplied;
  }, [contractAssignee, userDetail]);

  // Transform contract assignee comments into the format expected by ContractReview
  const { termComments, clauseComments } = useMemo(() => {
    const termCommentsMap: Record<number, Comment[]> = {};
    const clauseCommentsMap: Record<number, Comment[]> = {};

    if (contractAssignee?.Data) {
      contractAssignee.Data.forEach((assignee) => {
        // Show both Message (initial) and Comment (reply) if they exist
        // Message is the initial message - use AssignerFullName, AssignerJobPosition
        // Comment is the reply - use UserFullName, UserJobPosition, UserGroupName

        const hasMessage = !!assignee.Message;
        const hasComment = !!assignee.Comment;
        const hasReference = !!assignee.UserGroupName;

        if (hasMessage || hasComment || hasReference) {
          // EntityTypeId: 1 = Term, 2 = Clause
          if (assignee.EntityTypeId === 2) {
            // Term comment
            if (!termCommentsMap[assignee.EntityId]) {
              termCommentsMap[assignee.EntityId] = [];
            }

            // Add initial message if it exists
            if (hasMessage || hasReference) {
              termCommentsMap[assignee.EntityId].push({
                id: assignee.ContractAssigneeId,
                text: assignee.Message || "",
                userId: assignee.AssignerUserId || assignee.UserId,
                userName: assignee.AssignerFullName || "کاربر",
                userTitle: assignee.AssignerJobPosition,
                userGroupName: assignee.UserGroupName, // Referenced department
                userGroupKey: assignee.UserGroupKey,
                createdAt: assignee.CreatedDate,
                entityType: "term" as const,
                entityId: assignee.EntityId,
                StatusCode: assignee.StatusCode === 1 ? 1 : 4, // Keep StatusCode 1 if it's 1, otherwise set to 4 for background color
              });
            }

            // Add reply (Comment) if it exists
            if (hasComment) {
              termCommentsMap[assignee.EntityId].push({
                id: assignee.ContractAssigneeId,
                text: assignee.Comment || "",
                userId: assignee.UserId,
                userName: assignee.UserFullName || "کاربر",
                userTitle: assignee.UserJobPosition,
                userGroupName: assignee.UserGroupName,
                userGroupKey: assignee.UserGroupKey,
                createdAt: assignee.CreatedDate,
                entityType: "term" as const,
                entityId: assignee.EntityId,
                StatusCode: assignee.StatusCode, // Reply uses actual StatusCode from API
              });
            }
          } else if (assignee.EntityTypeId === 1) {
            // Clause comment
            if (!clauseCommentsMap[assignee.EntityId]) {
              clauseCommentsMap[assignee.EntityId] = [];
            }

            // Add initial message if it exists
            if (hasMessage || hasReference) {
              clauseCommentsMap[assignee.EntityId].push({
                id: assignee.ContractAssigneeId,
                text: assignee.Message || "",
                userId: assignee.AssignerUserId || assignee.UserId,
                userName: assignee.AssignerFullName || "کاربر",
                userTitle: assignee.AssignerJobPosition,
                userGroupName: assignee.UserGroupName, // Referenced department
                userGroupKey: assignee.UserGroupKey,
                createdAt: assignee.CreatedDate,
                entityType: "clause" as const,
                entityId: assignee.EntityId,
                StatusCode: assignee.StatusCode === 1 ? 1 : 4, // Keep StatusCode 1 if it's 1, otherwise set to 4 for background color
              });
            }

            // Add reply (Comment) if it exists
            if (hasComment) {
              clauseCommentsMap[assignee.EntityId].push({
                id: assignee.ContractAssigneeId,
                text: assignee.Comment || "",
                userId: assignee.UserId,
                userName: assignee.UserFullName || "کاربر",
                userTitle: assignee.UserJobPosition,
                userGroupName: assignee.UserGroupName,
                userGroupKey: assignee.UserGroupKey,
                createdAt: assignee.CreatedDate,
                entityType: "clause" as const,
                entityId: assignee.EntityId,
                StatusCode: assignee.StatusCode, // Reply uses actual StatusCode from API
              });
            }
          }
        }
      });
    }

    return { termComments: termCommentsMap, clauseComments: clauseCommentsMap };
  }, [contractAssignee]);

  // Handle adding new comments (with group key restriction)
  // In contract-deputy-review-assign, uses UpdateContractAssignee API then completes Camunda task
  const handleAddComment = async (payload: {
    text: string; // Can be empty string
    entityType: "clause" | "term";
    entityId?: number; // Single entity ID (for backward compatibility)
    entityIds?: number[]; // Multiple entity IDs (for batch operations)
    mentionedDepartments: string[]; // Required, at least one department
    commentId?: number; // ID of the comment being replied to (contractAssigneeId)
    approve?: boolean; // Approval flag (true = approve, false = reject)
  }) => {
    console.log("LmcNonTypeFormReadOnly handleAddComment called", {
      payload,
      taskId,
    });

    if (!taskId) {
      console.error("taskId is missing");
      addToaster({
        title: "شناسه وظیفه یافت نشد",
        color: "danger",
      });
      throw new Error("شناسه وظیفه یافت نشد");
    }
    console.log("payload", payload);
    // When replying to a comment, commentId (contractAssigneeId) is required
    if (payload.commentId === undefined || payload.commentId === 0) {
      console.error("commentId is missing or zero", {
        commentId: payload.commentId,
      });
      addToaster({
        title: "شناسه نظر یافت نشد",
        color: "danger",
      });
      throw new Error("شناسه نظر یافت نشد");
    }

    // If rejecting (approve === false), require comment text
    if (
      payload.approve === false &&
      (!payload.text || payload.text.trim() === "")
    ) {
      addToaster({
        title: "توضیحات رد را وارد کنید",
        color: "danger",
      });
      throw new Error("توضیحات رد را وارد کنید");
    }

    try {
      console.log("Calling updateContractAssignee API", {
        id: payload.commentId,
        StatusCode: payload.approve ? 2 : 3, // 2 = approved, 3 = rejected
        Comment: payload.text || "",
      });

      // First, update the contract assignee with the response
      await updateContractAssignee({
        id: payload.commentId || 0,
        body: {
          StatusCode: payload.approve ? 2 : 3, // 2 = approved, 3 = rejected
          Comment: payload.text || "",
        },
      }).unwrap();

      console.log("updateContractAssignee succeeded");

      addToaster({
        title: payload.approve
          ? "پاسخ با موفقیت تایید شد"
          : "پاسخ با موفقیت رد شد",
        color: "success",
      });

      // Refetch contract assignee to show updated comments
      if (refetchTermAssignee) {
        refetchTermAssignee();
      }
    } catch (error: any) {
      console.error("Error in handleAddComment", error);
      addToaster({
        title:
          error?.data?.ResponseMessage ||
          error?.data?.message ||
          error?.message ||
          "خطا در ثبت پاسخ",
        color: "danger",
      });
      throw error; // Re-throw to propagate to ContractReview
    }
  };

  // Handle complete button click
  const handleComplete = async () => {
    if (!taskId) {
      addToaster({
        title: "شناسه وظیفه یافت نشد",
        color: "danger",
      });
      return;
    }

    setIsCompleting(true);

    try {
      // Complete Camunda task with empty payload
      await completeTaskWithPayload(taskId, {});

      addToaster({
        title: "وظیفه با موفقیت تکمیل شد",
        color: "success",
      });

      // Navigate back to task inbox
      router.push("/task-inbox/my-tasks");
    } catch (error: any) {
      addToaster({
        title: error?.data?.message || "خطا در تکمیل وظیفه",
        color: "danger",
      });
    } finally {
      setIsCompleting(false);
    }
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
              درخواست ایجاد قرارداد {contractData.ContractTitle}
            </span>
          </div>
          <div className="flex items-center gap-x-[20px]">
            <button
              className="font-semibold text-[14px]/[35px] text-primary-950 border-[#26272B33] border-1 rounded-[12px] px-4 py-2 flex items-center gap-2"
              onClick={onOpen}
            >
              <Clock size={20} />
              تاریخچه بند ها
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <ContractAttachments
              attachments={contractData.Attachments || []}
            />
            <div className="bg-white border border-primary-950/[.1] rounded-[16px] p-6 space-y-6">
              <ContractReview
                contractData={contractData}
                termComments={termComments}
                clauseComments={clauseComments}
                onAddComment={handleAddComment}
                currentUserId={userDetail?.UserDetail.UserId}
                currentUserName={userDetail?.UserDetail.FullName}
                currentUserGroupKeys={userDetail?.UserDetail.GroupKeys}
                enableGroupKeyFilter={true} // Filter comments by GroupKeys in contract-deputy-review-assign
                // No add/edit/delete handlers for clauses/terms - read-only mode
              />

              {/* Complete Task Button */}
              <div className="border-t border-primary-950/[.1] pt-6">
                <div className="flex flex-col items-end gap-2">
                  {!allCommentsReplied && (
                    <p className="text-[12px] text-danger">
                      لطفا به تمام نظرات ارجاع شده پاسخ دهید
                    </p>
                  )}
                  <CustomButton
                    buttonSize="sm"
                    buttonVariant="primary"
                    className="!rounded-[12px]"
                    onPress={handleComplete}
                    isLoading={isCompleting}
                    isDisabled={!allCommentsReplied}
                  >
                    پایان
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
          <RequestDetail
            formData={formData}
            CreatedDate={requestStatus?.CreatedDate}
          />
        </div>
      </div>
      <HistoryOfClausesDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        contractData={contractData}
      />
    </>
  );
}
