import {
  GetContractInfo,
  ContractClauseDetails,
  TermDetails,
  SubClauseDetails,
} from "../../../types/contractModel";
import { DragEndEvent } from "@dnd-kit/core";

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
  entityId: number;
  mentionedDepartments: string[]; // GroupKeys of mentioned departments (required, at least one)
  commentId?: number; // ID of the comment being replied to (for contract-deputy-review-assign)
  approve?: boolean; // Approval flag for contract-deputy-review-assign (true = approve, false = reject)
}

export type CommentFilter = "all" | "pending" | "approved" | "rejected";

export interface ClauseSectionProps {
  clause: ContractClauseDetails;
  clauseIndex: number;
  subClauseStartIndexLookup: Record<string, number>;
  showCommentToggle?: boolean;
  showActionsOnHover?: boolean;
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
    entityId: number
  ) => React.ReactNode;
  renderCommentInput: (
    entityType: "clause" | "term",
    id: number,
    label: string
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
    sortedTerms: TermDetails[]
  ) => (event: DragEndEvent) => void;
  clauseId?: number;
  isExpanded?: boolean;
  onToggleExpansion?: () => void;
}

export interface TermSectionProps {
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
    entityId: number
  ) => React.ReactNode;
  renderCommentInput: (
    entityType: "clause" | "term",
    id: number,
    label: string
  ) => React.ReactNode;
  onEditTerm?: (term: TermDetails) => void;
  onEditSubClause?: (subClause: SubClauseDetails, termId: number) => void;
  onDeleteTerm?: (term: TermDetails) => void;
  onDeleteSubClause?: (subClause: SubClauseDetails, termId: number) => void;
  onAddSubClause?: (term: TermDetails) => void;
  hasAccessToEdit?: boolean;
  cluaseSortOrder: number;
}

export interface DragHandleProps {
  attributes: any;
  listeners: any;
}

