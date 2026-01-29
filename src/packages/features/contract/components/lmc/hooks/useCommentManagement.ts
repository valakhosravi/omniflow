import { useState, useEffect, useMemo } from "react";
import {
  Comment,
  AddCommentPayload,
  CommentFilter,
} from "../types/ContractReviewTypes";
import { ContractDepartments } from "../../../types/contractModel";
import GeneralResponse from "@/models/general-response/general_response";

interface UseCommentManagementProps {
  termComments: Record<number, Comment[]>;
  clauseComments: Record<number, Comment[]>;
  onAddComment?: (comment: AddCommentPayload) => Promise<void>;
  currentUserGroupKeys?: string[];
  enableGroupKeyFilter?: boolean;
  contractDepartments?: GeneralResponse<ContractDepartments[]>;
}

export function useCommentManagement({
  termComments,
  clauseComments,
  onAddComment,
  currentUserGroupKeys = [],
  enableGroupKeyFilter = false,
  contractDepartments,
}: UseCommentManagementProps) {
  const [activeCommentInputs, setActiveCommentInputs] = useState<
    Record<string, boolean>
  >({});
  const [activeReplyInputs, setActiveReplyInputs] = useState<
    Record<string, boolean>
  >({}); // For reply inputs under specific comments: "comment-{commentId}"
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [mentionedDepartments, setMentionedDepartments] = useState<
    Record<string, string[]>
  >({});
  const [submittingCommentKey, setSubmittingCommentKey] = useState<
    string | null
  >(null);
  const [submittingAction, setSubmittingAction] = useState<
    "approve" | "reject" | null
  >(null);

  // State for comment status filter
  const [commentFilter, setCommentFilter] = useState<CommentFilter>("all");

  // Calculate comment counts by status
  const commentCounts = useMemo(() => {
    const allComments: Comment[] = [
      ...Object.values(termComments).flat(),
      ...Object.values(clauseComments).flat(),
    ];

    // Apply GroupKey filter only if enableGroupKeyFilter is true
    const filteredByGroup =
      enableGroupKeyFilter && currentUserGroupKeys && currentUserGroupKeys.length > 0
        ? allComments.filter((comment) => {
            if (comment.userGroupKey) {
              return currentUserGroupKeys.includes(comment.userGroupKey);
            }
            return false;
          })
        : allComments;

    return {
      all: filteredByGroup.length,
      pending: filteredByGroup.filter((c) => c.StatusCode === 1).length,
      approved: filteredByGroup.filter((c) => c.StatusCode === 2).length,
      rejected: filteredByGroup.filter((c) => c.StatusCode === 3).length,
    };
  }, [termComments, clauseComments, currentUserGroupKeys, enableGroupKeyFilter]);

  // Automatically open reply inputs for comments that user can reply to in deputy-review-assign mode
  useEffect(() => {
    // Check if we have comments with reply functionality
    const hasComments =
      Object.keys(termComments).length > 0 ||
      Object.keys(clauseComments).length > 0;

    if (hasComments && onAddComment) {
      const replyInputsToOpen: Record<string, boolean> = {};

      // Check all term comments
      Object.entries(termComments).forEach(([entityId, comments]) => {
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
      Object.entries(clauseComments).forEach(([entityId, comments]) => {
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

  // Auto-set Legal Department when reply input opens in contract-deputy-review-assign mode
  useEffect(() => {
    if (contractDepartments?.Data && Array.isArray(contractDepartments.Data)) {
      const legalDepartment = contractDepartments.Data.find(
        (dept) => dept.Name === "دپارتمان حقوقی"
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
  const canUserReply = (
    entityType: "clause" | "term",
    entityId: number
  ): boolean => {
    if (!onAddComment) {
      return false;
    }

    // If currentUserGroupKeys is not provided or empty, allow all replies (contract-lmc-approve behavior)
    if (!currentUserGroupKeys || currentUserGroupKeys.length === 0) {
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
    const canReply = comments.some((comment) => {
      if (comment.userGroupKey) {
        return currentUserGroupKeys.includes(comment.userGroupKey);
      }
      return false;
    });

    return canReply;
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
      if (comment.userGroupKey) {
        return currentUserGroupKeys.includes(comment.userGroupKey);
      }
      return false;
    }

    // If no currentUserGroupKeys, allow replies to all pending comments (for testing/admin)
    return true;
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

  const toggleReplyInput = (
    commentId: number,
    entityType: "clause" | "term",
    entityId: number
  ) => {
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
        const legalDepartment =
          contractDepartments?.Data && Array.isArray(contractDepartments.Data)
            ? contractDepartments.Data.find(
                (dept) => dept.Name === "دپارتمان حقوقی"
              )
            : undefined;
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
    commentId?: number
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
    approve?: boolean
  ) => {
    const key = commentId ? `comment-${commentId}` : `${entityType}-${id}`;
    const text = commentTexts[key]?.trim() || "";

    // In contract-deputy-review-assign mode (when replying to comment), use Legal Department
    const isCommentReply = commentId !== undefined && commentId > 0;
    let departments: string[] = [];

    if (isCommentReply) {
      // When replying to a comment, always use Legal Department directly
      const legalDepartment =
        contractDepartments?.Data && Array.isArray(contractDepartments.Data)
          ? contractDepartments.Data.find(
              (dept) => dept.Name === "دپارتمان حقوقی"
            )
          : undefined;
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
    if (departments.length === 0 && !isCommentReply) {
      console.warn("No departments selected, cannot submit comment");
      return;
    }

    // When replying to a comment, set Legal Department if not already set
    if (isCommentReply && departments.length === 0) {
      const legalDepartment =
        contractDepartments?.Data && Array.isArray(contractDepartments.Data)
          ? contractDepartments.Data.find(
              (dept) => dept.Name === "دپارتمان حقوقی"
            )
          : undefined;
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
    commentId?: number
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
    setMentionedDepartments((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  return {
    activeCommentInputs,
    activeReplyInputs,
    commentTexts,
    mentionedDepartments,
    submittingCommentKey,
    submittingAction,
    commentFilter,
    commentCounts,
    setCommentTexts,
    setCommentFilter,
    canUserReply,
    canUserReplyToComment,
    toggleCommentInput,
    toggleReplyInput,
    handleDepartmentSelection,
    handleAddComment,
    handleCancelComment,
  };
}

