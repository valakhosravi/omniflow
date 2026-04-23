import type React from "react";
import type { DragEndEvent } from "@dnd-kit/core";

export interface Category {
  CategoryId: number;
  Name: string;
  CreatedDate: string;
}

export interface SubCategory {
  SubCategoryId: number;
  CategoryId: number;
  Name: string;
  Description: string;
  IsType: boolean;
  FilePath: string;
  CreatedDate: string;
  IsPersonal?: boolean;
}

export interface SubCategoryField {
  ContractFieldId: number;
  CreatedDate: string;
  DisplayName: string;
  FieldType: number;
  FieldTypeDescription: string;
  IsRequired: boolean;
  Name: string;
  SortOrder: number;
  SubCategoryId: number;
}

export interface Configuration {
  ConfigurationId: number;
  SubCategoryId: number;
  Title: string;
  Name: string;
  Type: number;
}

export enum ContractFieldType {
  Text = 1,
  Checkbox = 2,
  Date = 3,
  Number = 4,
}

export interface ContractFieldDetails {
  FieldName: string;
  FieldValue: string;
  ContractFieldId: number;
  IsRequired: boolean;
  DisplayName: string;
  FieldType?: number;
}

export interface ContractFieldValuesInfo {
  ContractFieldValueId: number;
  ContractFieldId: number;
  ContractId: number;
  FieldValue: string;
  CreatedDate: string;
}

export interface ContractFieldValueDetails {
  ContractFieldDetails: ContractFieldValuesInfo[];
  ContractTitle: string;
}

export interface ContractDetails {
  ContractId: number;
  SubCategoryId: number;
  CategoryId: number;
  RequestId: number;
  UserId: number;
  Title: string;
  CreatedDate: string;
  ContractFieldValues: ContractFieldValuesInfo[];
}

export interface ClauseDetails {
  ClauseId: number;
  Name: string;
  SortOrder: number;
  CreatedDate: string;
  Terms: GetTermsRequestByClauseId[];
}

export interface ContractClauseDetails {
  ClauseId: number;
  ClauseName: string;
  ClauseDescription: string;
  SortOrder: number;
  Terms: TermDetails[];
  IsEditable: boolean;
}

export interface GetTermsRequestByClauseId {
  TermId: number;
  Title: string;
  InitialDescription: string;
  CreatedDate: string;
  FinalDescription: string;
  ModifiedDate?: string;
  ModifierUserId?: number;
  SortOrder: number;
  SubClauses: SubClauseDetails[];
}

export interface TermDetails {
  TermId: string;
  Title: string;
  InitialDescription: string;
  FinalDescription: string;
  SortOrder: number;
  SubClauses: SubClauseDetails[];
  readonly?: boolean;
  IsEditable?: boolean;
}

export interface SubClauseDetails {
  SubClauseId: number;
  Title: string;
  Description: string;
}

export interface GetSubClauses {
  SubClauseId: number;
  Title: string;
  Description: string;
  CreatedDate: string;
}

export interface GetContractInfo {
  FilePath: string;
  ContractTitle: string;
  IsType: boolean;
  ContractFields: ContractFieldDetails[];
  ContractClauses: ContractClauseDetails[];
  Attachments: string[];
  ContractId: number;
  CategoryId: number;
  Settings?: ContractSetting[];
}

export interface GetTermAssigneeDetails {
  TermAssigneeId: number;
  TermId: number;
  UserId: number;
  AssignerUserId: number;
  StatusCode: number;
  Comment: string;
  CreatedDate: string;
}

export interface GetContractAssigneeDetails {
  ContractAssigneeId: number;
  ContractId: number;
  EntityId: number;
  EntityTypeId: number;
  UserId: number;
  AssignerUserId: number;
  StatusCode: number;
  Message: string | null;
  Comment: string | null;
  CreatedDate: string;
  ModifiedDate: string | null;
  UserFullName: string;
  UserGroupKey: string;
  AssignerFullName: string;
  UserJobPosition: string;
  AssignerJobPosition: string;
  UserGroupName: string;
}

export interface SaveContractDetail {
  ContractId: number;
}

export interface SaveContractFieldValueDetails {
  ContractFieldId: number;
  FieldValue: string;
}

export interface SaveClauseRequest {
  ContractId: number;
  Name: string;
  Description?: string;
  SortOrder: number;
}

export interface SaveTermRequest {
  ClauseId: number;
  Title: string;
  InitialDescription: string;
  SortOrder: number;
  isEditable: boolean;
}

export interface SaveFinalTermRequest {
  TermId: number;
  FinalDescription: string;
}

export interface SaveSubClauseRequest {
  TermId: number;
  Title: string;
  Description: string;
}

export interface SaveTermAssigneeRequest {
  TermId: number;
  UserId: number;
  StatusCode: number;
}

export interface EditContractRequest {
  Title: string;
  FieldValueDetails: SaveContractFieldValueDetails[];
}

export interface UpdateRequestIdRequest {
  RequestId: number;
}

export interface UpdateClauseRequest {
  Name: string;
  Description?: string;
}

export interface UpdateTermRequest {
  Title?: string;
  InitialDescription?: string;
  SubClauses?: UpdateSubClauseDetails[];
}

export interface UpdateSubClauseDetails {
  Title?: string;
  Description?: string;
}

export interface UpdateSubClauseRequest {
  Title: string;
  Description: string;
}

export interface UpdateContractTermRequest {
  Title: string;
  InitialDescription: string;
  SubClauses: UpdateSubClauseRequest[];
}

export interface UpdateTermAssigneeRequest {
  StatusCode?: number;
  Comment?: string;
}

export interface UpdateTermSortRequest {
  TermId: number;
  SortOrder: number;
}

export interface UpdateClauseSortRequest {
  ClauseId: number;
  SortOrder: number;
}

export interface FullEditContractRequest {
  IsType: boolean;
  ContractTitle: string;
  PersonnelId: number;
  ContractFields: ContractFieldDetails[];
  ContractClauses: ContractClauseDetailsEdit[];
  Attachments: string[];
  Settings?: ContractSetting[];
}

export interface ContractClauseDetailsEdit {
  ClauseName: string;
  SortOrder: number;
  Terms: TermDetailsEdit[];
}

export interface TermDetailsEdit {
  Title: string;
  InitialDescription: string;
  FinalDescription: string;
  SortOrder: number;
  SubClauses: SubClauseDetailsEdit[];
}

export interface SubClauseDetailsEdit {
  Title: string;
  Description: string;
}

export interface FullSaveRequest {
  RequestId: number | null;
  CategoryId: number;
  Title: string;
  ContractFields: SaveContractFieldValueDetails[];
  ContractClauses: ContractClauses[];
  PartyName: string;
  PartyType: number;
  NationalId: string;
  Setting?: ContractSetting[];
}

export interface ContractClauses {
  Name: string;
  Description: string;
  SortOrder: number;
  IsEditable: boolean;
  Terms: Term[];
}

export interface Term {
  Title: string;
  InitialDescription: string;
  SortOrder: number;
  SubClauses: SubClause[];
}

export interface SubClause {
  Title: string;
  Description: string;
}

export interface ContractDepartments {
  ParentId: number;
  GroupKey: string;
  Name: string;
}

export interface ContractSetting {
  Key: string;
  Value: string;
}

export interface ContractTemplate {
  TemplateId: number;
  Name: string;
  Description: string;
  ClausesCount: number;
  TermsCount: number;
  SubClausesCount: number;
  CreatedDate: string;
  Clauses?: ContractClauseDetails[];
}

export interface saveTermAssigneeRequest {
  ContractId: number;
  RequestId: number;
  BusinessKey?: string;
  TermGroups?: TermGroup[];
}

export interface TermGroup {
  GroupKeys?: string[];
  TermId: number;
}

export interface EntityGroup {
  GroupKeys?: string[];
  EntityId: number;
  EntityTypeId: number;
  Message?: string;
}

export interface SaveContractAssigneeRequest {
  ContractId: number;
  RequestId: number;
  BusinessKey?: string;
  ProcessInstanceId?: string;
  EntityGroups?: EntityGroup[];
}

export interface UpdateContractAssigneeRequest {
  StatusCode?: number;
  Comment?: string;
}

export interface SaveSubCategoryTemplateRequest {
  CategoryId: number;
  Name: string;
  Description: string;
  Template: string;
  IsPersonal: boolean;
}

export interface SaveSubCategoryWithFieldsRequest {
  CategoryId: number;
  Name: string;
  Description: string;
  Template: string;
  IsPersonal: boolean;
  SubCategoryFields: SubCategoryField[];
}

export interface UpdateSubCategoryWithFieldsRequest {
  CategoryId: number;
  Name: string;
  Description: string;
  Template: string;
  IsPersonal: boolean;
  SubCategoryFields: SubCategoryField[];
}

export interface SubCategoryTemplate {
  ContractFieldId: number;
  SubCategoryId: number;
  CategoryId: number;
  Name: string;
  Description: string;
  IsPersonal: boolean;
  Template: string;
  CreatedDate: string;
  SubCategoryFields?: SubCategoryField[];
}

export interface SaveContractFieldValues {
  ContractId: number;
  FieldValueDetails: FieldValueDetailsModel[];
}

export interface FieldValueDetailsModel {
  ContractFieldId: number;
  FieldValue: string;
}

export interface SaveContractRequest {
  RequestId?: number | null;
  CategoryId: number;
  Title: string;
  FieldValueDetails: FieldValueDetailsModel[];
  Setting?: ContractSetting[];
}

export interface SaveContractResponse {
  ContractId: number;
}

export interface Library {
  TermLibraryId: number;
  CategoryId: number;
  Title: string;
  Description: string;
  LibraryType: 1 | 2; // 1: Clause, 2: Term
  CreatedDate: string;
}

export interface ContractFieldValue {
  ContractFieldId: number;
  FieldValue: string;
  FieldName: string;
  IsRequired: boolean;
  DisplayName: string;
}

export type NonTypeContractEntriesFormData = ContractFieldValue[];

export interface NonTypeContractEntriesForm {
  [key: string]: string;
}

export interface ContractEntriesFormData {
  title: string;
  [key: string]: string | number | boolean;
}

export interface ContractEntriesNonTypeFormData {
  [key: string]: string | number | boolean;
}

export interface Clause {
  clauseIndex: number;
  title: string;
  termCount: number;
  SortOrder: number;
  terms: ClauseTypeTerm[];
  IsEditable: boolean;
  backendId?: number;
}

export interface ClauseTypeTerm {
  number: string;
  description: string;
  SortOrder: number;
  subClause: ClauseTypeSubClause[];
  backendId?: number;
}

export interface ClauseTypeSubClause {
  subClauseIndex: number;
  subClauseDescription: string;
  backendId?: number;
}

export interface ContractReviewProps {
  contractData: GetContractInfo;
  termComments?: Record<number, Comment[]>;
  clauseComments?: Record<number, Comment[]>;
  onAddComment?: (comment: AddCommentPayload) => Promise<void>;
  currentUserId?: number;
  currentUserName?: string;
  currentUserGroupKeys?: string[];
  enableGroupKeyFilter?: boolean;
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
  userGroupKey?: string;
  createdAt: string;
  entityType: "clause" | "term";
  entityId: number;
  mentionedDepartments?: string[];
  StatusCode?: number;
}

export interface AddCommentPayload {
  text: string;
  entityType: "clause" | "term";
  entityId: number;
  mentionedDepartments: string[];
  commentId?: number;
  approve?: boolean;
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
}

export interface DragHandleProps {
  attributes: any;
  listeners: any;
}

export interface ApprovalHistoryItem {
  FullName: string;
  JobTitle: string;
  ModifiedDate: string;
  CreatedDate: string;
  Message: string;
  Comment: string;
  Title?: string;
  EntityTypeId?: number;
}

export interface SaveTemplateData {
  CategoryId: number;
  Name: string;
  Description: string;
  Template: string;
  IsPersonal: boolean;
}

export interface SaveTemplateWithFieldsFormData {
  Name: string;
  Description: string;
  CategoryId: number;
}

export interface ClauseFormData {
  name: string;
  description: string;
}

export type TemplateVariable = Omit<SubCategoryField, "SubCategoryId"> & {
  id: string;
};

export type PartyInfo = {
  PartyName: string;
  NationalId: string;
  PartyType: number;
  Phone?: string;
  PostalCode?: string;
  Address?: string;
};

export type NonTypeContractState = {
  contractTitle: string;

  partyInfo: PartyInfo;

  formValues: {
    data: NonTypeContractEntriesFormData | null;
    description: string;
    attachmentUrl: string;
    attachmentTitle?: string;
  };

  clauses: Clause[];
  activeClause: number | null;
  activeTerm: string;
  CategoryId: number | null;
  contractData?: any;
};

export interface ContractFormData {
  title: string;
  fieldValues: Record<string, string | number | boolean>;
  fieldValueDetails: FieldValueDetailsModel[];
}

export interface ContractState {
  selectedContract: SubCategory | null;
  formData: ContractFormData | null;
  categoryId: number | null;
  subCategoryId: number | null;
  contractId: number | null;
  contractTitle: string | "";
  templateFormData: SaveTemplateWithFieldsFormData | null;
}

export interface TermDepartment {
  termId: number;
  departments: string[];
}

export interface DataSliceState {
  requestId: string;
  termDepartments: TermDepartment[];
  contractData: GetContractInfo;
}

export interface ContractSubmissionClause {
  Name: string;
  Description: string;
  SortOrder: number;
  Terms: ContractSubmissionTerm[];
  IsEditable: boolean;
}

export interface ContractSubmissionTerm {
  Title: string;
  InitialDescription: string;
  SortOrder: number;
  SubClauses: ContractSubmissionSubClause[];
}

export interface ContractSubmissionSubClause {
  Title: string;
  Description: string;
}
