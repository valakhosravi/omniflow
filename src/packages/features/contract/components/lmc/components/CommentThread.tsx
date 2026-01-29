"use client";

import { MessageAdd1, MessageText1 } from "iconsax-reactjs";
import { toJalaliDate } from "@/packages/features/task-inbox/utils/dateFormatter";
import { Comment } from "../types/ContractReviewTypes";

interface CommentThreadProps {
  comments: Comment[];
  entityType: "clause" | "term";
  entityId: number;
  currentUserGroupKeys?: string[];
  enableGroupKeyFilter?: boolean;
  commentFilter: "all" | "pending" | "approved" | "rejected";
  canUserReplyToComment: (comment: Comment) => boolean;
  activeReplyInputs: Record<string, boolean>;
  onToggleReplyInput: (
    commentId: number,
    entityType: "clause" | "term",
    entityId: number
  ) => void;
  renderReplyInput: (
    commentId: number,
    entityType: "clause" | "term",
    entityId: number
  ) => React.ReactNode;
}

export default function CommentThread({
  comments,
  entityType,
  entityId,
  currentUserGroupKeys = [],
  enableGroupKeyFilter = false,
  commentFilter,
  canUserReplyToComment,
  activeReplyInputs,
  onToggleReplyInput,
  renderReplyInput,
}: CommentThreadProps) {
  if (!comments || comments.length === 0) return null;

  // Filter comments by user GroupKeys only if enableGroupKeyFilter is true
  let filteredComments =
    enableGroupKeyFilter && currentUserGroupKeys && currentUserGroupKeys.length > 0
      ? comments.filter((comment) => {
          // Show comment if user's GroupKeys include the comment's userGroupKey
          if (comment.userGroupKey) {
            return currentUserGroupKeys.includes(comment.userGroupKey);
          }
          // If comment has no userGroupKey, don't show it
          return false;
        })
      : comments; // If enableGroupKeyFilter is false, show all comments

  // Apply status filter
  if (commentFilter !== "all") {
    filteredComments = filteredComments.filter((comment) => {
      switch (commentFilter) {
        case "pending":
          return comment.StatusCode === 1;
        case "approved":
          return comment.StatusCode === 2;
        case "rejected":
          return comment.StatusCode === 3;
        default:
          return true;
      }
    });
  }

  if (filteredComments.length === 0) return null;

  return (
    <div className="mt-4 space-y-3 border-t border-primary-950/[.1] pt-4">
      {filteredComments.map((comment) => {
        const canReply = canUserReplyToComment(comment);
        // Check if reply input is already active for this comment
        const replyInputKey = `comment-${comment.id}`;
        const isReplyInputActive = activeReplyInputs[replyInputKey];

        return (
          <div
            key={`${comment.id}-${entityId}-${comment.userId}`}
            className={`flex gap-3 p-3 rounded-[12px] border border-primary-950/[.05] ${
              comment.StatusCode === 2 && "bg-green-50"
            } ${comment.StatusCode === 3 && "bg-red-50"}
             ${comment.StatusCode === 4 && "bg-blue-50"}`}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-950/[.1] flex items-center justify-center text-primary-950 font-semibold text-sm">
              {comment.userName?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center gap-2 mb-1 flex-wrap">
                {(comment.userTitle || comment.userGroupName) && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[14px] text-primary-950">
                      {comment.userName}
                    </span>
                    <div className="flex items-center gap-2">
                      {comment.userTitle && (
                        <span className="text-[12px] text-primary-950/[.6]">
                          ({comment.userTitle})
                        </span>
                      )}
                      <span className="text-[11px] text-primary-950/[.4]">
                        {toJalaliDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-primary-950/[.6] border border-secondary-300 rounded-[6px] px-2 py-1 inline-flex gap-1">
                    ارجاع شده به {comment.userGroupName}
                  </span>
                  {/* Only show پاسخ button if reply input is not already active */}
                  {canReply && !isReplyInputActive && (
                    <button
                      onClick={() =>
                        onToggleReplyInput(comment.id, entityType, entityId)
                      }
                      className="flex items-center gap-1 text-[11px] text-primary-950/[.7] hover:text-primary-950 transition-colors px-2 py-1 rounded-[6px] hover:bg-primary-950/[.05]"
                    >
                      <MessageAdd1 size={14} />
                      <span>پاسخ</span>
                    </button>
                  )}
                </div>
              </div>
              {comment.text && (
                <p className="text-[14px] text-primary-950 leading-relaxed whitespace-pre-wrap">
                  {comment.text}
                </p>
              )}
              {/* Render reply input under this comment if active */}
              {renderReplyInput(comment.id, entityType, entityId)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

