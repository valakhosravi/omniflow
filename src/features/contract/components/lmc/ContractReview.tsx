/* eslint-disable react-hooks/rules-of-hooks */
// TODO : vala
"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  GetContractInfo,
  ContractClauseDetails,
  TermDetails,
  SubClauseDetails,
} from "../../contract.types";
import {
  MessageAdd1,
  MessageText1,
  CloseCircle,
  Edit2,
  Trash,
  Add,
  More,
  ArrowDown2,
  ArrowUp2,
} from "iconsax-reactjs";
import CustomButton from "@/ui/Button";
import { Textarea, Chip, Select, SelectItem, Checkbox } from "@heroui/react";
import MultiSelect from "@/ui/MultiSelect";
import { toJalaliDate } from "@/packages/features/task-inbox/utils/dateFormatter";
import { useGetContractDepartmentsQuery } from "../../contract.services";
import { Tooltip } from "@/ui/NextUi";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface ContractReviewProps {
  contractData: GetContractInfo;
  termComments?: Record<number, Comment[]>;
  clauseComments?: Record<number, Comment[]>;
  onAddComment?: (comment: AddCommentPayload) => Promise<void>;
  currentUserId?: number;
  currentUserName?: string;
  currentUserGroupKeys?: string[]; // User's GroupKeys to check if they can reply
  enableGroupKeyFilter?: boolean; // Enable filtering by GroupKeys (for contract-deputy-review-assign)
  onEditClause?: (clause: ContractClauseDetails) => void;
  onEditTerm?: (term: TermDetails) => void;
  onEditSubClause?: (subClause: SubClauseDetails, termId: number) => void;
  onDeleteClause?: (clause: ContractClauseDetails) => void;
  onDeleteTerm?: (term: TermDetails) => void;
  onDeleteSubClause?: (subClause: SubClauseDetails, termId: number) => void;
  onAddClause?: () => void;
  onAddTerm?: (clause: ContractClauseDetails) => void;
  onAddSubClause?: (term: TermDetails) => void;
  onClauseSortChange?: (clauses: ContractClauseDetails[]) => void;
  onTermSortChange?: (clauseId: number, terms: TermDetails[]) => void;
  hasAccessToEdit?: boolean;
  isAddingComment?: boolean;
  isSortingClauses?: boolean;
  isSortingTerms?: boolean;
  showActionsOnHover?: boolean; // Control whether edit/delete/add buttons appear only on hover
}

export interface Comment {
  id: number;
  text: string;
  userId: number;
  userName: string;
  userTitle?: string;
  userGroupName?: string;
  userGroupKey?: string; // GroupKey of the referenced department
  createdAt: string;
  entityType: "clause" | "term";
  entityId: number;
  mentionedDepartments?: string[]; // GroupKeys of mentioned departments
  StatusCode?: number; // Status code from API (1 = pending/awaiting response, 2 = approved, 3 = rejected, 4 = initial message)
}

export interface AddCommentPayload {
  text: string; // Can be empty string
  entityType: "clause" | "term";
  entityId?: number; // Single entity ID (for backward compatibility)
  entityIds?: number[]; // Multiple entity IDs (for batch operations)
  mentionedDepartments: string[]; // GroupKeys of mentioned departments (required, at least one)
  commentId?: number; // ID of the comment being replied to (for contract-deputy-review-assign)
  approve?: boolean; // Approval flag for contract-deputy-review-assign (true = approve, false = reject)
}

export default function ContractReview({
  contractData,
  termComments = {},
  clauseComments = {},
  onAddComment,
  currentUserGroupKeys = [],
  enableGroupKeyFilter = false,
  onEditClause,
  onEditTerm,
  onEditSubClause,
  onDeleteClause,
  onDeleteTerm,
  onDeleteSubClause,
  onAddClause,
  onAddTerm,
  onAddSubClause,
  onClauseSortChange,
  onTermSortChange,
  hasAccessToEdit = true,
  isSortingClauses = false,
  isSortingTerms = false,
  showActionsOnHover = true,
}: ContractReviewProps) {
  const pathname = usePathname();
  const isContractLmcApprovePage =
    pathname?.includes("contract-lmc-approve") ?? false;

  const [activeCommentInputs, setActiveCommentInputs] = useState<
    Record<string, boolean>
  >({});
  const [activeReplyInputs, setActiveReplyInputs] = useState<
    Record<string, boolean>
  >({}); // For reply inputs under specific comments: "comment-{commentId}"
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [selectedActions, setSelectedActions] = useState<
    Record<string, boolean>
  >({});
  const [mentionedDepartments, setMentionedDepartments] = useState<
    Record<string, string[]>
  >({});
  const [submittingCommentKey, setSubmittingCommentKey] = useState<
    string | null
  >(null);
  const [, setSubmittingAction] = useState<"approve" | "reject" | null>(null);

  // State for multi-term selection
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedTermIds, setSelectedTermIds] = useState<Set<number>>(
    new Set(),
  );
  const [multiTermCommentKey, setMultiTermCommentKey] = useState<string | null>(
    null,
  );

  // State for comment status filter
  type CommentFilter = "all" | "pending" | "approved" | "rejected";
  const [commentFilter] = useState<CommentFilter>("all");
  const hasLMCPermission = useMemo(
    () =>
      currentUserGroupKeys?.some((key) => key.toUpperCase().includes("LMC")) ??
      false,
    [currentUserGroupKeys],
  );

  // State to track which clauses are expanded (accordion)
  const [expandedClauses, setExpandedClauses] = useState<
    Record<number, boolean>
  >(() => {
    // Initialize all clauses as expanded by default
    const initial: Record<number, boolean> = {};
    contractData.ContractClauses.forEach((clause) => {
      initial[clause.ClauseId] = true;
    });
    return initial;
  });

  // Fetch departments for mentions
  const { data: contractDepartments } = useGetContractDepartmentsQuery();

  // Automatically open reply inputs for comments that user can reply to in deputy-review-assign mode
  useEffect(() => {
    // Check if we have comments with reply functionality
    const hasComments =
      Object.keys(termComments).length > 0 ||
      Object.keys(clauseComments).length > 0;

    if (hasComments && onAddComment) {
      const replyInputsToOpen: Record<string, boolean> = {};

      // Check all term comments
      Object.entries(termComments).forEach(([, comments]) => {
        comments.forEach((comment) => {
          // Auto-open for comments with StatusCode === 1
          if (comment.StatusCode === 1) {
            // If currentUserGroupKeys is provided, check for matching group key
            if (currentUserGroupKeys && currentUserGroupKeys.length > 0) {
              if (
                comment.userGroupKey &&
                currentUserGroupKeys.includes(comment.userGroupKey)
              ) {
                const key = `comment-${comment.id}`;
                replyInputsToOpen[key] = true;
              }
            } else {
              // If no currentUserGroupKeys, auto-open all pending comments
              const key = `comment-${comment.id}`;
              replyInputsToOpen[key] = true;
            }
          }
        });
      });

      // Check all clause comments
      Object.entries(clauseComments).forEach(([, comments]) => {
        comments.forEach((comment) => {
          // Auto-open for comments with StatusCode === 1
          if (comment.StatusCode === 1) {
            // If currentUserGroupKeys is provided, check for matching group key
            if (currentUserGroupKeys && currentUserGroupKeys.length > 0) {
              if (
                comment.userGroupKey &&
                currentUserGroupKeys.includes(comment.userGroupKey)
              ) {
                const key = `comment-${comment.id}`;
                replyInputsToOpen[key] = true;
              }
            } else {
              // If no currentUserGroupKeys, auto-open all pending comments
              const key = `comment-${comment.id}`;
              replyInputsToOpen[key] = true;
            }
          }
        });
      });

      // Only update state if the inputs have actually changed
      setActiveReplyInputs((prev) => {
        const prevKeys = Object.keys(prev);
        const newKeys = Object.keys(replyInputsToOpen);

        // Check if the number of keys is different
        if (prevKeys.length !== newKeys.length) {
          return replyInputsToOpen;
        }

        // Check if any key has changed
        const hasChanged = newKeys.some((key) => !prev[key]);

        if (hasChanged) {
          return replyInputsToOpen;
        }

        // No changes, return previous state to prevent re-render
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termComments, clauseComments, currentUserGroupKeys]);

  // Toggle clause expansion
  const toggleClauseExpansion = (clauseId: number) => {
    setExpandedClauses((prev) => ({
      ...prev,
      [clauseId]: !prev[clauseId],
    }));
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle clause drag end
  const handleClauseDragEnd =
    (sortedClauses: ContractClauseDetails[]) => (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = sortedClauses.findIndex(
          (clause) => clause.ClauseId === active.id,
        );
        const newIndex = sortedClauses.findIndex(
          (clause) => clause.ClauseId === over.id,
        );

        const reorderedClauses = arrayMove(sortedClauses, oldIndex, newIndex);

        // Update sort order
        const updatedClauses = reorderedClauses.map((clause, index) => ({
          ...clause,
          SortOrder: index + 1,
        }));

        // Call the sort change handler
        if (onClauseSortChange) {
          onClauseSortChange(updatedClauses);
        }
      }
    };

  // Handle term drag end
  const handleTermDragEnd =
    (clauseId: number, sortedTerms: TermDetails[]) => (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = sortedTerms.findIndex(
          (term) => term.TermId === active.id,
        );
        const newIndex = sortedTerms.findIndex(
          (term) => term.TermId === over.id,
        );

        const reorderedTerms = arrayMove(sortedTerms, oldIndex, newIndex);

        // Update sort order
        const updatedTerms = reorderedTerms.map((term, index) => ({
          ...term,
          SortOrder: index + 1,
        }));

        // Call the term sort change handler
        if (onTermSortChange) {
          onTermSortChange(clauseId, updatedTerms);
        }
      }
    };

  // Auto-set Legal Department when reply input opens in contract-deputy-review-assign mode
  // (detected by checking if the key starts with "comment-")
  useEffect(() => {
    if (contractDepartments?.Data) {
      const legalDepartment = contractDepartments.Data.find(
        (dept) => dept.Name === "دپارتمان حقوقی",
      );

      if (legalDepartment?.GroupKey) {
        // Set Legal Department for all active reply inputs that are replies to comments
        setMentionedDepartments((prev) => {
          const updated = { ...prev };
          let hasChanges = false;

          Object.keys(activeReplyInputs).forEach((key) => {
            // Check if this is a reply to a comment (key starts with "comment-")
            const isCommentReply = key.startsWith("comment-");
            if (
              isCommentReply &&
              activeReplyInputs[key] &&
              (!prev[key] || prev[key].length === 0)
            ) {
              updated[key] = [legalDepartment.GroupKey];
              hasChanges = true;
            }
          });

          return hasChanges ? updated : prev;
        });
      }
    }
  }, [contractDepartments, activeReplyInputs]);

  // Check if user can reply to a specific entity based on matching group keys
  // Only applies group key restriction if currentUserGroupKeys is provided (for contract-deputy-review-assign)
  // If not provided, all users can reply (for contract-lmc-approve)
  const canUserReply = (
    entityType: "clause" | "term",
    entityId: number,
  ): boolean => {
    if (!onAddComment) {
      return false;
    }

    // If currentUserGroupKeys is not provided or empty, allow all replies (contract-lmc-approve behavior)
    if (!currentUserGroupKeys || currentUserGroupKeys.length === 0) {
      return true;
    }

    // If user has "LMC" in their GroupKeys, allow them to comment on all clauses and terms
    if (currentUserGroupKeys.some((key) => key.toUpperCase().includes("LMC"))) {
      return true;
    }

    // Get comments for this entity
    const comments =
      entityType === "term"
        ? termComments[entityId] || []
        : clauseComments[entityId] || [];

    // If no comments exist, allow reply (user can be the first to comment)
    if (comments.length === 0) {
      return true;
    }

    // Check if any comment has a UserGroupKey that matches user's GroupKeys
    // Only allow reply if user's GroupKeys match at least one comment's UserGroupKey
    const canReply = comments.some((comment) => {
      if (comment.userGroupKey) {
        return currentUserGroupKeys.includes(comment.userGroupKey);
      }
      return false;
    });

    return canReply;
  };

  const toggleCommentInput = (entityType: "clause" | "term", id: number) => {
    const key = `${entityType}-${id}`;
    setActiveCommentInputs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    if (!activeCommentInputs[key]) {
      setCommentTexts((prev) => ({
        ...prev,
        [key]: "",
      }));
      setMentionedDepartments((prev) => ({
        ...prev,
        [key]: [],
      }));
    }
  };

  const toggleReplyInput = (commentId: number) => {
    const key = `comment-${commentId}`;
    setActiveReplyInputs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    if (!activeReplyInputs[key]) {
      // In contract-deputy-review-assign mode (replying to comment), initialize with Legal Department
      const isCommentReply = key.startsWith("comment-");
      let initialDepartments: string[] = [];

      if (isCommentReply) {
        const legalDepartment = contractDepartments?.Data?.find(
          (dept) => dept.Name === "دپارتمان حقوقی",
        );
        if (legalDepartment?.GroupKey) {
          initialDepartments = [legalDepartment.GroupKey];
        }
      }

      setCommentTexts((prev) => ({
        ...prev,
        [key]: "",
      }));
      setMentionedDepartments((prev) => ({
        ...prev,
        [key]: initialDepartments,
      }));
    }
  };

  const handleDepartmentSelection = (
    entityType: "clause" | "term",
    id: number,
    selectedValues: (string | number)[],
    commentId?: number,
  ) => {
    const key = commentId ? `comment-${commentId}` : `${entityType}-${id}`;
    setMentionedDepartments((prev) => ({
      ...prev,
      [key]: selectedValues as string[],
    }));
  };

  const handleAddComment = async (
    entityType: "clause" | "term",
    id: number,
    commentId?: number,
    approve?: boolean,
    termIds?: number[], // For multi-term comments
  ) => {
    // Handle multi-term comment submission
    if (termIds && termIds.length > 0) {
      const key = multiTermCommentKey || "multi-term";
      const trimmedText = commentTexts[key]?.trim() ?? "";
      const text =
        approve && (!trimmedText || trimmedText.length === 0)
          ? "تایید شد"
          : trimmedText;
      const departments = mentionedDepartments[key] || [];

      if (departments.length === 0) {
        console.warn("No departments selected, cannot submit comment");
        return;
      }

      if (onAddComment) {
        try {
          setSubmittingCommentKey(key);
          // Submit all selected terms in a single API call
          await onAddComment({
            text,
            entityType: "term",
            entityIds: termIds, // Batch all term IDs
            mentionedDepartments: departments,
          });

          // Reset state only on success
          setCommentTexts((prev) => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
          });
          setMentionedDepartments((prev) => {
            const newState = { ...prev };
            delete newState[key];
            return newState;
          });
          setSelectedTermIds(new Set());
          setIsMultiSelectMode(false);
          setMultiTermCommentKey(null);
        } catch (error) {
          console.error("Error adding multi-term comment:", error);
        } finally {
          setSubmittingCommentKey(null);
          setSubmittingAction(null);
        }
      }
      return;
    }

    // Original single comment logic
    const key = commentId ? `comment-${commentId}` : `${entityType}-${id}`;
    const trimmedText = commentTexts[key]?.trim() ?? "";
    const text =
      approve && (!trimmedText || trimmedText.length === 0)
        ? "تایید شد"
        : trimmedText;

    // In contract-deputy-review-assign mode (when replying to comment), use Legal Department
    const isCommentReply = commentId !== undefined && commentId > 0;
    let departments: string[] = [];

    if (isCommentReply) {
      // When replying to a comment, always use Legal Department directly
      const legalDepartment = contractDepartments?.Data?.find(
        (dept) => dept.Name === "دپارتمان حقوقی",
      );
      if (legalDepartment?.GroupKey) {
        departments = [legalDepartment.GroupKey];
      } else {
        // In deputy-review-assign mode, Legal Department is required by backend
        // Even if not found in API, proceed with empty array - backend will handle it
        departments = mentionedDepartments[key] || [];
      }
    } else {
      departments = mentionedDepartments[key] || [];
    }

    // Require at least one department (except when replying in deputy-review-assign mode)
    // In deputy-review-assign reply mode, backend handles the Legal Department assignment
    if (departments.length === 0 && !isCommentReply) {
      console.warn("No departments selected, cannot submit comment", {
        isCommentReply,
        commentId,
        key,
        mentionedDepartments: mentionedDepartments[key],
        contractDepartments: contractDepartments?.Data,
        legalDepartmentFound: contractDepartments?.Data?.find(
          (dept) => dept.Name === "دپارتمان حقوقی",
        ),
      });
      return;
    }

    // When replying to a comment, set Legal Department if not already set
    if (isCommentReply && departments.length === 0) {
      const legalDepartment = contractDepartments?.Data?.find(
        (dept) => dept.Name === "دپارتمان حقوقی",
      );
      if (legalDepartment?.GroupKey) {
        departments = [legalDepartment.GroupKey];
      }
      // If still empty, proceed anyway - backend will handle Legal Department assignment
    }

    if (onAddComment) {
      try {
        setSubmittingCommentKey(key);
        // Set the action type for loading state
        if (approve !== undefined) {
          setSubmittingAction(approve ? "approve" : "reject");
        }
        await onAddComment({
          text,
          entityType,
          entityId: id,
          mentionedDepartments: departments,
          commentId: commentId, // Pass commentId if replying to a specific comment
          approve, // Pass approve flag for contract-deputy-review-assign
        });

        // Reset state only on success
        setCommentTexts((prev) => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
        setMentionedDepartments((prev) => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
        if (commentId) {
          setActiveReplyInputs((prev) => ({
            ...prev,
            [key]: false,
          }));
        } else {
          setActiveCommentInputs((prev) => ({
            ...prev,
            [key]: false,
          }));
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        setSubmittingCommentKey(null);
        setSubmittingAction(null);
      }
    } else {
      console.warn("onAddComment is not provided");
    }
  };

  const handleCancelComment = (
    entityType: "clause" | "term",
    id: number,
    commentId?: number,
  ) => {
    const key = commentId ? `comment-${commentId}` : `${entityType}-${id}`;
    if (commentId) {
      setActiveReplyInputs((prev) => ({
        ...prev,
        [key]: false,
      }));
    } else {
      setActiveCommentInputs((prev) => ({
        ...prev,
        [key]: false,
      }));
    }
    setCommentTexts((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    setSelectedActions((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    setMentionedDepartments((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  // Check if user can reply to a specific comment based on matching group keys
  const canUserReplyToComment = (comment: Comment): boolean => {
    if (!onAddComment) {
      return false;
    }

    // In contract-deputy-review-assign mode, only allow replies to comments with StatusCode === 1 (pending)
    if (comment.StatusCode !== 1) {
      return false;
    }

    // If currentUserGroupKeys is provided, check for matching group keys
    if (currentUserGroupKeys && currentUserGroupKeys.length > 0) {
      // If user has "LMC" in their GroupKeys, allow them to reply to all comments
      if (
        currentUserGroupKeys.some((key) => key.toUpperCase().includes("LMC"))
      ) {
        return true;
      }

      if (comment.userGroupKey) {
        return currentUserGroupKeys.includes(comment.userGroupKey);
      }
      return false;
    }

    // If no currentUserGroupKeys, allow replies to all pending comments (for testing/admin)
    return true;
  };

  const renderCommentThread = (
    comments: Comment[],
    entityType: "clause" | "term",
    entityId: number,
  ) => {
    if (!comments || comments.length === 0) return null;

    // Filter comments by user GroupKeys only if enableGroupKeyFilter is true
    let filteredComments =
      enableGroupKeyFilter &&
      currentUserGroupKeys &&
      currentUserGroupKeys.length > 0
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
                        onClick={() => toggleReplyInput(comment.id)}
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
  };

  const renderReplyInput = (
    commentId: number,
    entityType: "clause" | "term",
    entityId: number,
  ) => {
    const key = `comment-${commentId}`;
    const isActive = activeReplyInputs[key];
    const commentText = commentTexts[key] || "";

    // In contract-deputy-review-assign mode (when replying to a comment), show تایید/رد buttons
    // We detect this by checking if commentId exists (meaning it's a reply, not a new comment)
    const isDeputyReviewAssign = commentId > 0;
    const legalDepartment = contractDepartments?.Data?.find(
      (dept) => dept.Name === "دپارتمان حقوقی",
    );
    const legalDepartmentKey = legalDepartment?.GroupKey || "";

    // Set selected departments: use Legal Department if in deputy-review-assign mode, otherwise use state
    const selectedDepartments =
      isDeputyReviewAssign && legalDepartmentKey
        ? [legalDepartmentKey]
        : mentionedDepartments[key] || [];

    if (!isActive) {
      return null;
    }

    // Get entity label for display
    let label = "";
    if (entityType === "term") {
      const term = contractData.ContractClauses.flatMap((c) => c.Terms).find(
        (t) => t.TermId === String(entityId),
      );
      label = term?.Title || "بند";
    } else {
      const clause = contractData.ContractClauses.find(
        (c) => c.ClauseId === entityId,
      );
      label = clause?.ClauseName || "ماده";
    }

    return (
      <div className="mt-3 pt-3 border-t border-primary-950/[.1]">
        <div className="p-4 bg-primary-950/[.02] rounded-[12px] border border-primary-950/[.1]">
          <div className="text-[14px] font-medium text-primary-950 mb-2 block">
            پاسخ به نظر برای {label}
          </div>
          <div className="mb-3">
            {!isDeputyReviewAssign && (
              <MultiSelect
                label="ارجاع به واحد *"
                options={
                  contractDepartments?.Data?.map((dept) => ({
                    value: dept.GroupKey,
                    label: dept.Name,
                  })) || []
                }
                selectedValues={selectedDepartments}
                onSelectionChange={(selectedValues) =>
                  handleDepartmentSelection(
                    entityType,
                    entityId,
                    selectedValues,
                    commentId,
                  )
                }
                placeholder={
                  isDeputyReviewAssign
                    ? "ارجاع به واحد حقوقی"
                    : "انتخاب واحد..."
                }
                disabled={isDeputyReviewAssign}
              />
            )}
          </div>
          <div className="mb-3">
            <label className="text-[12px] font-medium text-primary-950/[.7] mb-2 block">
              متن نظر{" "}
              {isDeputyReviewAssign && <span className="text-danger">*</span>}
              {!isDeputyReviewAssign && "(اختیاری)"}
            </label>
            <Textarea
              value={commentText}
              onChange={(e) =>
                setCommentTexts((prev) => ({
                  ...prev,
                  [key]: e.target.value,
                }))
              }
              placeholder="نظر خود را وارد کنید..."
              minRows={3}
              classNames={{
                inputWrapper:
                  "border border-primary-950/[.2] rounded-[8px] bg-white",
                input: "text-right dir-rtl text-[14px]",
              }}
              autoFocus
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            {/* <CustomButton
              buttonSize="sm"
              buttonVariant="outline"
              onPress={() =>
                handleCancelComment(entityType, entityId, commentId)
              }
              startContent={<CloseCircle size={16} />}
            >
              انصراف
            </CustomButton> */}
            {isDeputyReviewAssign ? (
              // In deputy-review-assign mode, show select and button
              <>
                <Select
                  selectedKeys={
                    selectedActions[key] !== undefined
                      ? [selectedActions[key] ? "approve" : "reject"]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys)[0] as string;
                    setSelectedActions((prev) => ({
                      ...prev,
                      [key]: selectedValue === "approve",
                    }));
                  }}
                  placeholder="انتخاب وضعیت"
                  classNames={{
                    base: "w-[150px]",
                    trigger:
                      "border border-primary-950/[.2] rounded-[8px] bg-white h-[36px] min-h-[36px]",
                    value: "text-[14px] text-primary-950",
                  }}
                >
                  <SelectItem key="approve">تایید</SelectItem>
                  <SelectItem key="reject">رد</SelectItem>
                </Select>
                <CustomButton
                  buttonSize="sm"
                  buttonVariant="primary"
                  className="h-[40px]"
                  onPress={() => {
                    const action = selectedActions[key];
                    if (action !== undefined) {
                      handleAddComment(entityType, entityId, commentId, action);
                    }
                  }}
                  isLoading={submittingCommentKey === key}
                  isDisabled={selectedActions[key] === undefined}
                >
                  ثبت
                </CustomButton>
              </>
            ) : (
              // In other modes (like contract-lmc-approve), show single ثبت نظر button
              <CustomButton
                buttonSize="sm"
                buttonVariant="primary"
                onPress={() => {
                  handleAddComment(entityType, entityId, commentId);
                }}
                isDisabled={selectedDepartments.length === 0}
                isLoading={submittingCommentKey === key}
                startContent={<MessageText1 size={16} />}
              >
                ثبت نظر
              </CustomButton>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMultiTermCommentInput = () => {
    if (selectedTermIds.size === 0) return null;

    const key = multiTermCommentKey || "multi-term";
    const commentText = commentTexts[key] || "";
    const selectedDepartments = mentionedDepartments[key] || [];

    // Get term labels for display
    const selectedTerms = Array.from(selectedTermIds)
      .map((termId) => {
        // Find the term and its parent clause
        let foundTerm: TermDetails | undefined;
        let parentClause: ContractClauseDetails | undefined;

        for (const clause of contractData.ContractClauses) {
          const term = clause.Terms.find((t) => {
            // Handle both string and number types for TermId
            const tTermId =
              typeof t.TermId === "string" ? Number(t.TermId) : t.TermId;
            return tTermId === termId;
          });
          if (term) {
            foundTerm = term;
            parentClause = clause;
            break;
          }
        }

        if (foundTerm && parentClause) {
          return `بند ${parentClause.SortOrder}.${foundTerm.SortOrder}`;
        }
        return `بند ${termId}`;
      })
      .filter(Boolean);

    return (
      <div className="mt-4 p-4 rounded-[12px] border border-primary-950/[.1] sticky top-4 z-10 bg-white mb-4 shadow-md">
        <div className="text-[14px] font-medium text-primary-950 mb-2 block">
          نظر برای {selectedTerms.length} بند انتخاب شده
        </div>
        <div className="mb-2">
          <div className="flex flex-wrap gap-2">
            {selectedTerms.map((title, index) => (
              <Chip
                key={index}
                size="sm"
                variant="flat"
                className="bg-primary-950/[.1] text-primary-950"
              >
                {title}
              </Chip>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <MultiSelect
            label="ارجاع به واحد *"
            options={
              contractDepartments?.Data?.map((dept) => ({
                value: dept.GroupKey,
                label: dept.Name,
              })) || []
            }
            selectedValues={selectedDepartments}
            onSelectionChange={(selectedValues) =>
              setMentionedDepartments((prev) => ({
                ...prev,
                [key]: selectedValues as string[],
              }))
            }
            placeholder="انتخاب واحد..."
          />
        </div>
        <div className="mb-3">
          <label className="text-[12px] font-medium text-primary-950/[.7] mb-2 block">
            متن نظر (اختیاری)
          </label>
          <Textarea
            value={commentText}
            onChange={(e) =>
              setCommentTexts((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
            placeholder="نظر خود را وارد کنید..."
            minRows={3}
            classNames={{
              inputWrapper:
                "border border-primary-950/[.2] rounded-[8px] bg-white",
              input: "text-right dir-rtl text-[14px]",
            }}
            autoFocus
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <CustomButton
            buttonSize="sm"
            buttonVariant="outline"
            onPress={() => {
              setSelectedTermIds(new Set());
              setIsMultiSelectMode(false);
              setMultiTermCommentKey(null);
              setCommentTexts((prev) => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
              });
              setMentionedDepartments((prev) => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
              });
            }}
            startContent={<CloseCircle size={16} />}
          >
            انصراف
          </CustomButton>
          <CustomButton
            buttonSize="sm"
            buttonVariant="primary"
            onPress={() =>
              handleAddComment(
                "term",
                0,
                undefined,
                undefined,
                Array.from(selectedTermIds),
              )
            }
            isDisabled={selectedDepartments.length === 0}
            isLoading={submittingCommentKey === key}
            startContent={<MessageText1 size={16} />}
          >
            ثبت نظر برای {selectedTermIds.size} بند
          </CustomButton>
        </div>
      </div>
    );
  };

  const renderCommentInput = (
    entityType: "clause" | "term",
    id: number,
    label: string,
  ) => {
    const key = `${entityType}-${id}`;
    const isActive = activeCommentInputs[key];
    const commentText = commentTexts[key] || "";
    const selectedDepartments = mentionedDepartments[key] || [];
    const canReply = canUserReply(entityType, id);

    // Check if user has LMC permissions
    // In contract-deputy-review-assign mode (when currentUserGroupKeys is provided),
    // hide the main comment input button since we show reply buttons on individual comments
    // Exception: LMC users should always see the comment button based on canReply
    if (
      currentUserGroupKeys &&
      currentUserGroupKeys.length > 0 &&
      !hasLMCPermission
    ) {
      // Only show if comment input is already active
      if (!isActive) {
        return null;
      }
    } else {
      // In contract-lmc-approve mode or for LMC users, use the canUserReply check
      if (!canReply) {
        return null;
      }
    }

    if (!isActive) {
      return null;
    }

    return (
      <div className="mt-4 p-4 bg-primary-950/[.02] rounded-[12px] border border-primary-950/[.1]">
        <div className="text-[14px] font-medium text-primary-950 mb-2 block">
          نظر برای {label}
        </div>
        <div className="mb-3">
          <MultiSelect
            label="ارجاع به واحد *"
            options={
              contractDepartments?.Data?.map((dept) => ({
                value: dept.GroupKey,
                label: dept.Name,
              })) || []
            }
            selectedValues={selectedDepartments}
            onSelectionChange={(selectedValues) =>
              handleDepartmentSelection(entityType, id, selectedValues)
            }
            placeholder="انتخاب واحد..."
          />
        </div>
        <div className="mb-3">
          <label className="text-[12px] font-medium text-primary-950/[.7] mb-2 block">
            متن نظر *
          </label>
          <Textarea
            value={commentText}
            onChange={(e) =>
              setCommentTexts((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
            placeholder="نظر خود را وارد کنید..."
            minRows={3}
            classNames={{
              inputWrapper:
                "border border-primary-950/[.2] rounded-[8px] bg-white",
              input: "text-right dir-rtl text-[14px]",
            }}
            autoFocus
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <CustomButton
            buttonSize="sm"
            buttonVariant="outline"
            onPress={() => handleCancelComment(entityType, id)}
            startContent={<CloseCircle size={16} />}
          >
            انصراف
          </CustomButton>
          <CustomButton
            buttonSize="sm"
            buttonVariant="primary"
            onPress={() => handleAddComment(entityType, id)}
            isDisabled={selectedDepartments.length === 0 || !commentText.trim()}
            isLoading={submittingCommentKey === key}
            startContent={<MessageText1 size={16} />}
          >
            ثبت نظر
          </CustomButton>
        </div>
      </div>
    );
  };

  const shouldShowCommentToggle = (
    entityType: "clause" | "term",
    id: number,
  ) => {
    const key = `${entityType}-${id}`;
    const isActive = activeCommentInputs[key];

    if (
      currentUserGroupKeys &&
      currentUserGroupKeys.length > 0 &&
      !hasLMCPermission
    ) {
      return false;
    }

    if (!canUserReply(entityType, id)) {
      return false;
    }

    return !isActive;
  };

  // Sort clauses by SortOrder
  const sortedClauses = [...contractData.ContractClauses].sort(
    (a, b) => a.SortOrder - b.SortOrder,
  );

  const subClauseStartIndexLookup = (() => {
    const lookup: Record<string, number> = {};
    let runningIndex = 0;

    sortedClauses.forEach((clause) => {
      const orderedTerms = [...clause.Terms].sort(
        (a, b) => a.SortOrder - b.SortOrder,
      );

      orderedTerms.forEach((term) => {
        lookup[String(term.TermId)] = runningIndex;
        runningIndex += term.SubClauses?.length ?? 0;
      });
    });

    return lookup;
  })();

  const toggleTermSelection = (termId: number) => {
    setSelectedTermIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(termId)) {
        newSet.delete(termId);
      } else {
        newSet.add(termId);
      }
      return newSet;
    });

    // Initialize multi-term comment key if not set
    if (!multiTermCommentKey) {
      const key = "multi-term";
      setMultiTermCommentKey(key);
      setCommentTexts((prev) => ({
        ...prev,
        [key]: "",
      }));
      setMentionedDepartments((prev) => ({
        ...prev,
        [key]: [],
      }));
    }
  };

  return (
    <div className="relative">
      {/* Multi-Term Selection Mode Toggle */}
      {hasAccessToEdit && isContractLmcApprovePage && (
        <div className="mb-4 flex items-center justify-between">
          <CustomButton
            buttonSize="sm"
            buttonVariant={isMultiSelectMode ? "primary" : "outline"}
            onPress={() => {
              setIsMultiSelectMode((prev) => !prev);
              if (!isMultiSelectMode) {
                setSelectedTermIds(new Set());
              }
            }}
            className="font-semibold"
          >
            {isMultiSelectMode ? "لغو انتخاب چندگانه" : "انتخاب چندگانه بندها"}
          </CustomButton>
          {isMultiSelectMode && selectedTermIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-primary-950/[.7]">
                {selectedTermIds.size} بند انتخاب شده
              </span>
            </div>
          )}
        </div>
      )}

      {/* Multi-Term Comment Input */}
      {isMultiSelectMode &&
        selectedTermIds.size > 0 &&
        renderMultiTermCommentInput()}

      {/* Comment Status Filter */}
      {/* {commentCounts.all > 0 && (
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-[14px] text-primary-950/[.7] font-medium">
            فیلتر نظرات:
          </span>
          <Chip
            size="sm"
            variant={commentFilter === "all" ? "solid" : "bordered"}
            color={commentFilter === "all" ? "primary" : "default"}
            className="cursor-pointer"
            onClick={() => setCommentFilter("all")}
          >
            همه ({commentCounts.all})
          </Chip>
          <Chip
            size="sm"
            variant={commentFilter === "pending" ? "solid" : "bordered"}
            color={commentFilter === "pending" ? "warning" : "default"}
            className="cursor-pointer"
            onClick={() => setCommentFilter("pending")}
          >
            ارجاع شده ({commentCounts.pending})
          </Chip>
          <Chip
            size="sm"
            variant={commentFilter === "approved" ? "solid" : "bordered"}
            color={commentFilter === "approved" ? "success" : "default"}
            className="cursor-pointer"
            onClick={() => setCommentFilter("approved")}
          >
            موافق ({commentCounts.approved})
          </Chip>
          <Chip
            size="sm"
            variant={commentFilter === "rejected" ? "solid" : "bordered"}
            color={commentFilter === "rejected" ? "danger" : "default"}
            className="cursor-pointer"
            onClick={() => setCommentFilter("rejected")}
          >
            مخالف ({commentCounts.rejected})
          </Chip>
        </div>
      )} */}

      {/* Loading Overlay for Sorting */}
      {(isSortingClauses || isSortingTerms) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-[16px]">
          <div className="bg-white rounded-[12px] shadow-lg p-4 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-950"></div>
            <span className="text-[14px] text-primary-950 font-medium">
              در حال به‌روزرسانی ترتیب...
            </span>
          </div>
        </div>
      )}

      {/* Conditionally render with or without drag and drop */}
      {onClauseSortChange ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleClauseDragEnd(sortedClauses)}
        >
          <div className="flex flex-col gap-4">
            <SortableContext
              items={sortedClauses.map((clause) => clause.ClauseId)}
              strategy={verticalListSortingStrategy}
            >
              {sortedClauses.map((clause, index) => (
                <SortableClauseSection
                  key={clause.ClauseId}
                  clause={clause}
                  clauseIndex={index + 1}
                  subClauseStartIndexLookup={subClauseStartIndexLookup}
                  showCommentToggle={shouldShowCommentToggle(
                    "clause",
                    clause.ClauseId,
                  )}
                  showActionsOnHover={showActionsOnHover}
                  getTermCommentToggle={(termId) =>
                    shouldShowCommentToggle("term", termId)
                  }
                  termComments={termComments}
                  clauseComments={clauseComments[clause.ClauseId] || []}
                  activeCommentInputs={activeCommentInputs}
                  commentTexts={commentTexts}
                  onToggleCommentInput={toggleCommentInput}
                  onAddComment={handleAddComment}
                  onCancelComment={handleCancelComment}
                  setCommentTexts={setCommentTexts}
                  renderCommentThread={renderCommentThread}
                  renderCommentInput={renderCommentInput}
                  onEditClause={onEditClause}
                  onEditTerm={onEditTerm}
                  onEditSubClause={onEditSubClause}
                  onDeleteClause={onDeleteClause}
                  onDeleteTerm={onDeleteTerm}
                  onDeleteSubClause={onDeleteSubClause}
                  onAddTerm={onAddTerm}
                  onAddSubClause={onAddSubClause}
                  hasAccessToEdit={hasAccessToEdit}
                  onTermDragEnd={
                    onTermSortChange ? handleTermDragEnd : undefined
                  }
                  clauseId={clause.ClauseId}
                  isExpanded={expandedClauses[clause.ClauseId] ?? true}
                  onToggleExpansion={() =>
                    toggleClauseExpansion(clause.ClauseId)
                  }
                  isMultiSelectMode={isMultiSelectMode}
                  selectedTermIds={selectedTermIds}
                  onToggleTermSelection={toggleTermSelection}
                />
              ))}
            </SortableContext>

            {/* Add Clause Button */}
            {hasAccessToEdit && onAddClause && (
              <div className="flex justify-center">
                <CustomButton
                  buttonSize="sm"
                  buttonVariant="outline"
                  // iconOnly
                  onPress={onAddClause}
                  className="font-semibold"
                >
                  <Add size={18} />
                  افزودن ماده جدید
                </CustomButton>
              </div>
            )}
          </div>
        </DndContext>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedClauses.map((clause, index) => (
            <ClauseSection
              key={clause.ClauseId}
              clause={clause}
              clauseIndex={index + 1}
              subClauseStartIndexLookup={subClauseStartIndexLookup}
              showCommentToggle={shouldShowCommentToggle(
                "clause",
                clause.ClauseId,
              )}
              showActionsOnHover={showActionsOnHover}
              getTermCommentToggle={(termId) =>
                shouldShowCommentToggle("term", termId)
              }
              termComments={termComments}
              clauseComments={clauseComments[clause.ClauseId] || []}
              activeCommentInputs={activeCommentInputs}
              commentTexts={commentTexts}
              onToggleCommentInput={toggleCommentInput}
              onAddComment={handleAddComment}
              onCancelComment={handleCancelComment}
              setCommentTexts={setCommentTexts}
              renderCommentThread={renderCommentThread}
              renderCommentInput={renderCommentInput}
              onEditClause={onEditClause}
              onEditTerm={onEditTerm}
              onEditSubClause={onEditSubClause}
              onDeleteClause={onDeleteClause}
              onDeleteTerm={onDeleteTerm}
              onDeleteSubClause={onDeleteSubClause}
              onAddTerm={onAddTerm}
              onAddSubClause={onAddSubClause}
              hasAccessToEdit={hasAccessToEdit}
              onTermDragEnd={undefined}
              clauseId={clause.ClauseId}
              isExpanded={expandedClauses[clause.ClauseId] ?? true}
              onToggleExpansion={() => toggleClauseExpansion(clause.ClauseId)}
              isMultiSelectMode={isMultiSelectMode}
              selectedTermIds={selectedTermIds}
              onToggleTermSelection={toggleTermSelection}
            />
          ))}

          {/* Add Clause Button */}
          {hasAccessToEdit && onAddClause && (
            <div className="flex justify-center">
              <CustomButton
                buttonSize="sm"
                buttonVariant="outline"
                onPress={onAddClause}
                className="font-semibold"
              >
                <Add size={18} />
                افزودن ماده جدید
              </CustomButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ClauseSectionProps {
  clause: ContractClauseDetails;
  clauseIndex: number;
  subClauseStartIndexLookup: Record<string, number>;
  showCommentToggle?: boolean;
  getTermCommentToggle?: (termId: number) => boolean;
  termComments: Record<number, Comment[]>;
  clauseComments: Comment[];
  activeCommentInputs: Record<string, boolean>;
  commentTexts: Record<string, string>;
  onToggleCommentInput: (entityType: "clause" | "term", id: number) => void;
  onAddComment: (entityType: "clause" | "term", id: number) => void;
  onCancelComment: (entityType: "clause" | "term", id: number) => void;
  setCommentTexts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  renderCommentThread: (
    comments: Comment[],
    entityType: "clause" | "term",
    entityId: number,
  ) => React.ReactNode;
  renderCommentInput: (
    entityType: "clause" | "term",
    id: number,
    label: string,
  ) => React.ReactNode;
  onEditClause?: (clause: ContractClauseDetails) => void;
  onEditTerm?: (term: TermDetails) => void;
  onEditSubClause?: (subClause: SubClauseDetails, termId: number) => void;
  onDeleteClause?: (clause: ContractClauseDetails) => void;
  onDeleteTerm?: (term: TermDetails) => void;
  onDeleteSubClause?: (subClause: SubClauseDetails, termId: number) => void;
  onAddTerm?: (clause: ContractClauseDetails) => void;
  onAddSubClause?: (term: TermDetails) => void;
  hasAccessToEdit?: boolean;
  onTermDragEnd?: (
    clauseId: number,
    sortedTerms: TermDetails[],
  ) => (event: DragEndEvent) => void;
  clauseId?: number;
  isExpanded?: boolean;
  onToggleExpansion?: () => void;
  showActionsOnHover?: boolean;
  isMultiSelectMode?: boolean;
  selectedTermIds?: Set<number>;
  onToggleTermSelection?: (termId: number) => void;
}

// Sortable Clause Section Wrapper
function SortableClauseSection(props: ClauseSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.clause.ClauseId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ClauseSection {...props} dragHandleProps={{ attributes, listeners }} />
    </div>
  );
}

function ClauseSection({
  clause,
  clauseIndex,
  subClauseStartIndexLookup,
  getTermCommentToggle = () => false,
  termComments,
  clauseComments,
  activeCommentInputs,
  commentTexts,
  onToggleCommentInput,
  onAddComment,
  onCancelComment,
  setCommentTexts,
  renderCommentThread,
  renderCommentInput,
  onEditClause,
  onEditTerm,
  onEditSubClause,
  onDeleteClause,
  onDeleteTerm,
  onDeleteSubClause,
  onAddTerm,
  onAddSubClause,
  hasAccessToEdit = true,
  onTermDragEnd,
  clauseId,
  dragHandleProps,
  isExpanded = true,
  onToggleExpansion,
  showActionsOnHover = true,
  isMultiSelectMode = false,
  selectedTermIds = new Set(),
  onToggleTermSelection,
}: ClauseSectionProps & {
  dragHandleProps?: {
    attributes: any;
    listeners: any;
  };
}) {
  const clauseKey = `clause-${clause.ClauseId}`;
  const isClauseCommentActive = activeCommentInputs[clauseKey];
  return (
    <div className="border border-primary-950/[.1] rounded-[16px] overflow-hidden bg-white">
      {/* Clause Header */}
      <div
        className={`p-5 bg-primary-950/[.03] border-primary-950/[.1] group ${
          isExpanded ? "border-b" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 justify-between">
            <div className="inline-flex gap-2">
              {/* Drag Handle */}
              {hasAccessToEdit && dragHandleProps && (
                <button
                  {...dragHandleProps.attributes}
                  {...dragHandleProps.listeners}
                  className="cursor-grab active:cursor-grabbing text-primary-950/[.4] hover:text-primary-950/[.7] transition-colors"
                >
                  <More size={20} className="rotate-90" />
                </button>
              )}
              <h3 className="text-[18px] font-bold text-primary-950">
                ماده {clauseIndex}: {clause.ClauseName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {hasAccessToEdit && onEditClause && clause.IsEditable && (
                  <Tooltip
                    placement="top"
                    content="ویرایش ماده"
                    closeDelay={300}
                    className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px]"
                    offset={4}
                  >
                    <CustomButton
                      buttonSize="xs"
                      buttonVariant="outline"
                      iconOnly
                      onPress={() => onEditClause(clause)}
                      className={`font-semibold transition-opacity ${
                        showActionsOnHover
                          ? "opacity-0 group-hover:opacity-100"
                          : ""
                      }`}
                    >
                      <Edit2 size={16} />
                    </CustomButton>
                  </Tooltip>
                )}
                {hasAccessToEdit && onDeleteClause && (
                  <Tooltip
                    placement="top"
                    content="حذف ماده"
                    closeDelay={300}
                    className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px]"
                    offset={4}
                  >
                    <CustomButton
                      buttonSize="xs"
                      buttonVariant="outline"
                      iconOnly
                      onPress={() => onDeleteClause(clause)}
                      className={`font-semibold !text-danger transition-opacity ${
                        showActionsOnHover
                          ? "opacity-0 group-hover:opacity-100"
                          : ""
                      }`}
                    >
                      <Trash size={16} />
                    </CustomButton>
                  </Tooltip>
                )}
                {/* {hasAccessToEdit && showCommentToggle && (
                  <CustomButton
                    buttonSize="xs"
                    buttonVariant="outline"
                    onPress={() =>
                      onToggleCommentInput("clause", clause.ClauseId)
                    }
                    className={`font-semibold !rounded-[12px] text-xs transition-opacity ${
                      showActionsOnHover
                        ? "opacity-0 group-hover:opacity-100"
                        : ""
                    }`}
                  >
                    <MessageAdd1 size={14} />
                    افزودن نظر و ارجاع
                  </CustomButton>
                )} */}
                {hasAccessToEdit && onAddTerm && (
                  <CustomButton
                    buttonSize="xs"
                    buttonVariant="outline"
                    onPress={() => onAddTerm(clause)}
                    className={`font-semibold !rounded-[12px] transition-opacity ${
                      showActionsOnHover
                        ? "opacity-0 group-hover:opacity-100"
                        : ""
                    }`}
                  >
                    <Add size={16} />
                    افزودن بند جدید
                  </CustomButton>
                )}
                {typeof clause.IsEditable !== "undefined" && !clause.IsEditable && (
                  <div className="inline-block border p-1 text-xs w-[168px] rounded-full text-center border-accent-300 bg-accent-300/15 text-accent-300">
                    انتخاب شده از کتابخانه
                  </div>
                )}
              </div>
            </div>
            {/* Accordion Toggle Button */}
          </div>
          <div className="inline-flex gap-2">
            {clauseComments.length > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary-950/[.05] rounded-[6px]">
                <MessageText1 size={14} className="text-primary-950/[.6]" />
                <span className="text-[12px] font-medium text-primary-950/[.6]">
                  {clauseComments.length}
                </span>
              </div>
            )}
            {onToggleExpansion && (
              <button
                onClick={onToggleExpansion}
                className="text-primary-950/[.6] hover:text-primary-950 transition-colors p-1 hover:bg-primary-950/[.05] rounded cursor-pointer"
                aria-label={isExpanded ? "بستن" : "باز کردن"}
              >
                {isExpanded ? <ArrowUp2 size={20} /> : <ArrowDown2 size={20} />}
              </button>
            )}
          </div>
        </div>
        {clause.ClauseDescription && (
          <div
            className="text-[14px] text-primary-950/[.7] leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: clause.ClauseDescription,
            }}
          />
        )}
        {/* Clause Comment Input */}
        {isExpanded &&
          hasAccessToEdit &&
          isClauseCommentActive &&
          renderCommentInput("clause", clause.ClauseId, clause.ClauseName)}

        {/* Clause Comments Thread */}
        {isExpanded &&
          clauseComments.length > 0 &&
          renderCommentThread(clauseComments, "clause", clause.ClauseId)}
      </div>

      {/* Terms */}
      {isExpanded && (
        <div className="p-5 space-y-4">
          {(() => {
            // Sort terms by SortOrder
            const sortedTerms = [...clause.Terms].sort(
              (a, b) => a.SortOrder - b.SortOrder,
            );
            const cluaseSortOrder = clauseIndex;

            return onTermDragEnd && clauseId ? (
              <DndContext
                sensors={useSensors(
                  useSensor(PointerSensor, {
                    activationConstraint: {
                      distance: 8,
                    },
                  }),
                  useSensor(KeyboardSensor, {
                    coordinateGetter: sortableKeyboardCoordinates,
                  }),
                )}
                collisionDetection={closestCenter}
                onDragEnd={onTermDragEnd(clauseId, sortedTerms)}
              >
                <SortableContext
                  items={sortedTerms.map((term) => term.TermId)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedTerms.map((term, termIndex) => {
                    const subClauseStartIndex =
                      subClauseStartIndexLookup[String(term.TermId)] ?? 0;
                    const termCommentToggle = getTermCommentToggle(
                      Number(term.TermId),
                    );

                    return (
                      <SortableTermSection
                        key={term.TermId}
                        term={term}
                        termIndex={termIndex + 1}
                        cluaseSortOrder={cluaseSortOrder}
                        subClauseStartIndex={subClauseStartIndex}
                        showCommentToggle={termCommentToggle}
                        comments={termComments[Number(term.TermId)] || []}
                        activeCommentInputs={activeCommentInputs}
                        commentTexts={commentTexts}
                        onToggleCommentInput={onToggleCommentInput}
                        onAddComment={onAddComment}
                        onCancelComment={onCancelComment}
                        setCommentTexts={setCommentTexts}
                        renderCommentThread={renderCommentThread}
                        renderCommentInput={renderCommentInput}
                        onEditTerm={onEditTerm}
                        onEditSubClause={onEditSubClause}
                        onDeleteTerm={onDeleteTerm}
                        onDeleteSubClause={onDeleteSubClause}
                        onAddSubClause={onAddSubClause}
                        hasAccessToEdit={hasAccessToEdit}
                        showActionsOnHover={showActionsOnHover}
                        isMultiSelectMode={isMultiSelectMode}
                        selectedTermIds={selectedTermIds}
                        onToggleTermSelection={onToggleTermSelection}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            ) : (
              sortedTerms.map((term, termIndex) => {
                const subClauseStartIndex =
                  subClauseStartIndexLookup[String(term.TermId)] ?? 0;
                const termCommentToggle = getTermCommentToggle(
                  Number(term.TermId),
                );

                return (
                  <TermSection
                    key={term.TermId}
                    term={term}
                    termIndex={termIndex + 1}
                    cluaseSortOrder={cluaseSortOrder}
                    subClauseStartIndex={subClauseStartIndex}
                    showCommentToggle={termCommentToggle}
                    comments={termComments[Number(term.TermId)] || []}
                    activeCommentInputs={activeCommentInputs}
                    commentTexts={commentTexts}
                    onToggleCommentInput={onToggleCommentInput}
                    onAddComment={onAddComment}
                    onCancelComment={onCancelComment}
                    setCommentTexts={setCommentTexts}
                    renderCommentThread={renderCommentThread}
                    renderCommentInput={renderCommentInput}
                    onEditTerm={onEditTerm}
                    onEditSubClause={onEditSubClause}
                    onDeleteTerm={onDeleteTerm}
                    onDeleteSubClause={onDeleteSubClause}
                    onAddSubClause={onAddSubClause}
                    hasAccessToEdit={hasAccessToEdit}
                    showActionsOnHover={showActionsOnHover}
                    isMultiSelectMode={isMultiSelectMode}
                    selectedTermIds={selectedTermIds}
                    onToggleTermSelection={onToggleTermSelection}
                  />
                );
              })
            );
          })()}
        </div>
      )}
    </div>
  );
}

interface TermSectionProps {
  term: TermDetails;
  termIndex: number;
  subClauseStartIndex: number;
  showCommentToggle?: boolean;
  showActionsOnHover?: boolean;
  comments: Comment[];
  activeCommentInputs: Record<string, boolean>;
  commentTexts: Record<string, string>;
  onToggleCommentInput: (entityType: "clause" | "term", id: number) => void;
  onAddComment: (entityType: "clause" | "term", id: number) => void;
  onCancelComment: (entityType: "clause" | "term", id: number) => void;
  setCommentTexts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  renderCommentThread: (
    comments: Comment[],
    entityType: "clause" | "term",
    entityId: number,
  ) => React.ReactNode;
  renderCommentInput: (
    entityType: "clause" | "term",
    id: number,
    label: string,
  ) => React.ReactNode;
  onEditTerm?: (term: TermDetails) => void;
  onEditSubClause?: (subClause: SubClauseDetails, termId: number) => void;
  onDeleteTerm?: (term: TermDetails) => void;
  onDeleteSubClause?: (subClause: SubClauseDetails, termId: number) => void;
  onAddSubClause?: (term: TermDetails) => void;
  hasAccessToEdit?: boolean;
  cluaseSortOrder: number;
  isMultiSelectMode?: boolean;
  selectedTermIds?: Set<number>;
  onToggleTermSelection?: (termId: number) => void;
}

// Sortable Term Section Wrapper
function SortableTermSection(props: TermSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.term.TermId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TermSection {...props} dragHandleProps={{ attributes, listeners }} />
    </div>
  );
}

function TermSection({
  term,
  termIndex,
  subClauseStartIndex,
  showCommentToggle = false,
  comments,
  activeCommentInputs,
  onToggleCommentInput,
  cluaseSortOrder,
  renderCommentThread,
  renderCommentInput,
  onEditTerm,
  onEditSubClause,
  onDeleteTerm,
  onDeleteSubClause,
  onAddSubClause,
  hasAccessToEdit = true,
  dragHandleProps,
  showActionsOnHover = true,
  isMultiSelectMode = false,
  selectedTermIds = new Set(),
  onToggleTermSelection,
}: TermSectionProps & {
  dragHandleProps?: {
    attributes: any;
    listeners: any;
  };
}) {
  const termKey = `term-${term.TermId}`;
  const isTermCommentActive = activeCommentInputs[termKey];
  const termIdNumber = Number(term.TermId);
  const isSelected = selectedTermIds.has(termIdNumber);

  return (
    <div className="relative">
      {/* Left border line for GitLab-style */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary-950/[.1]" />

      <div className="pl-6 border-l-2 border-transparent hover:border-primary-950/[.2] transition-colors">
        {/* Term Content */}
        <div
          className={`bg-primary-950/[.01] rounded-[12px] p-4 border transition-colors group/term ${
            isSelected
              ? "border-primary-950/[.3] bg-primary-950/[.05]"
              : "border-primary-950/[.05]"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {/* Multi-Select Checkbox */}
              {isMultiSelectMode &&
                hasAccessToEdit &&
                !!term.IsEditable &&
                onToggleTermSelection && (
                  <Checkbox
                    isSelected={isSelected}
                    onValueChange={() => onToggleTermSelection(termIdNumber)}
                    classNames={{
                      wrapper: "after:bg-primary-950",
                    }}
                  />
                )}
              {/* Drag Handle */}
              {hasAccessToEdit && dragHandleProps && !isMultiSelectMode && (
                <button
                  {...dragHandleProps.attributes}
                  {...dragHandleProps.listeners}
                  className="cursor-grab active:cursor-grabbing text-primary-950/[.3] hover:text-primary-950/[.6] transition-colors"
                >
                  <More size={18} className="rotate-90" />
                </button>
              )}
              <h4 className="text-[16px] font-semibold text-primary-950 w-[56px]">
                بند {termIndex}.{cluaseSortOrder}
              </h4>
              {typeof term.IsEditable !== "undefined" && !term.IsEditable && (
                <div className="inline-block border p-1 text-xs w-[168px] rounded-full text-center border-accent-300 bg-accent-300/15 text-accent-300">
                  انتخاب شده از کتابخانه
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasAccessToEdit &&
                onEditTerm &&
                !term.readonly &&
                (typeof term.IsEditable === "undefined" || term.IsEditable) && (
                  <Tooltip
                    placement="top"
                    content="ویرایش بند"
                    closeDelay={300}
                    className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px]"
                    offset={4}
                  >
                    <CustomButton
                      buttonSize="xs"
                      buttonVariant="outline"
                      iconOnly
                      onPress={() => onEditTerm(term)}
                      className={`font-semibold transition-opacity ${
                        showActionsOnHover
                          ? "opacity-0 group-hover/term:opacity-100"
                          : ""
                      }`}
                    >
                      <Edit2 size={14} />
                    </CustomButton>
                  </Tooltip>
                )}
              {hasAccessToEdit && onDeleteTerm && (
                <Tooltip
                  placement="top"
                  content="حذف بند"
                  closeDelay={300}
                  className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px]"
                  offset={4}
                >
                  <CustomButton
                    buttonSize="xs"
                    buttonVariant="outline"
                    iconOnly
                    onPress={() => onDeleteTerm(term)}
                    className={`font-semibold !text-danger transition-opacity ${
                      showActionsOnHover
                        ? "opacity-0 group-hover/term:opacity-100"
                        : ""
                    }`}
                  >
                    <Trash size={14} />
                  </CustomButton>
                </Tooltip>
              )}

              {hasAccessToEdit &&
                showCommentToggle &&
                !isMultiSelectMode &&
                term.IsEditable && (
                  <CustomButton
                    buttonSize="xs"
                    buttonVariant="outline"
                    onPress={() =>
                      onToggleCommentInput("term", Number(term.TermId))
                    }
                    className={`font-semibold text-xs !rounded-[12px] transition-opacity ${
                      showActionsOnHover
                        ? "opacity-0 group-hover/term:opacity-100"
                        : ""
                    }`}
                  >
                    <MessageAdd1 size={14} />
                    افزودن نظر و ارجاع
                  </CustomButton>
                )}
              {hasAccessToEdit &&
                onAddSubClause &&
                !term.readonly &&
                term.IsEditable && (
                  <CustomButton
                    buttonSize="xs"
                    buttonVariant="outline"
                    onPress={() => onAddSubClause(term)}
                    className={`font-semibold text-xs !rounded-[12px] transition-opacity ${
                      showActionsOnHover
                        ? "opacity-0 group-hover/term:opacity-100"
                        : ""
                    }`}
                  >
                    <Add size={14} />
                    افزودن تبصره
                  </CustomButton>
                )}
              {comments.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-primary-950/[.05] rounded-[6px]">
                  <MessageText1 size={14} className="text-primary-950/[.6]" />
                  <span className="text-[12px] font-medium text-primary-950/[.6]">
                    {comments.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className="text-[14px] text-primary-950/[.7] leading-relaxed mb-3"
            dangerouslySetInnerHTML={{
              __html: term.FinalDescription || term.InitialDescription || "",
            }}
          />

          {/* SubClauses */}
          <div className="mt-3 pl-4 border-r-2 border-primary-950/[.1] pr-4">
            {term.SubClauses && term.SubClauses.length > 0 && (
              <div className="space-y-2">
                {term.SubClauses.map((subClause, index) => (
                  <div
                    key={subClause.SubClauseId || index}
                    className="group/subclause"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-[13px] text-primary-950/[.8]">
                        تبصره {subClauseStartIndex + index + 1}
                      </div>
                      <div className="flex items-center gap-1">
                        {hasAccessToEdit && onEditSubClause && (
                          <Tooltip
                            placement="top"
                            content="ویرایش تبصره"
                            closeDelay={300}
                            className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px]"
                            offset={4}
                          >
                            <CustomButton
                              buttonSize="xs"
                              buttonVariant="outline"
                              iconOnly
                              onPress={() =>
                                onEditSubClause(subClause, Number(term.TermId))
                              }
                              className={`font-semibold transition-opacity ${
                                showActionsOnHover
                                  ? "opacity-0 group-hover/subclause:opacity-100"
                                  : ""
                              }`}
                            >
                              <Edit2 size={12} />
                            </CustomButton>
                          </Tooltip>
                        )}
                        {hasAccessToEdit && onDeleteSubClause && (
                          <Tooltip
                            placement="top"
                            content="حذف تبصره"
                            closeDelay={300}
                            className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px] "
                            offset={4}
                          >
                            <CustomButton
                              buttonSize="xs"
                              buttonVariant="outline"
                              iconOnly
                              onPress={() =>
                                onDeleteSubClause(
                                  subClause,
                                  Number(term.TermId),
                                )
                              }
                              className={`font-semibold !text-danger transition-opacity ${
                                showActionsOnHover
                                  ? "opacity-0 group-hover/subclause:opacity-100"
                                  : ""
                              }`}
                            >
                              <Trash size={12} />
                            </CustomButton>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <div
                      className="text-[13px] text-primary-950/[.6] leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: subClause.Description || "",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Term Comment Input */}
        {hasAccessToEdit &&
          isTermCommentActive &&
          renderCommentInput("term", Number(term.TermId), term.Title)}

        {/* Term Comments Thread */}
        {comments.length > 0 &&
          renderCommentThread(comments, "term", Number(term.TermId))}
      </div>
    </div>
  );
}
