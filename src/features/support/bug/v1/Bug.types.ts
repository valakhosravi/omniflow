import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { needToSelecActions } from "./Bug.const";

export enum BugFixComponentType {
  EDIT,
  CREATE,
}
export type BugFixIndexPropsType = {
  type: BugFixComponentType;
  requestId?: string;
  BugFixData?: GeneralResponse<BugInfoResponse>;
};

export enum SupportExpertEnum {
  FIXED = "fixed",
  NOT_FIXED = "not-fixed",
  NEED_USER_ACTION = "need-user-action",
}

export enum SupportManagerEnum {
  FIXED = "fixed",
  REFERRAL_TO_EXPERT = "referral-to-expert",
  REFERRAL_TO_DEVELOPMENT_UNIT = "referral-to-development-unit",
}

export enum DevelopmentExpertEnum {
  FIXED = "fixed",
  REFERRAL_TO_DEVELOPMENT_MANAGER = "referral-to-development-manager",
  DEVELOPMENT_PROCESS_REQUEST = "development-process-request",
  NEED_USER_ACTION = "need-user-action",
}
export enum DevelopmentManagerEnum {
  NOT_VALID = "not-valid",
  REFERRAL_TO_DEVELOPMENT_UNIT = "referral-to-development-unit",
  REFERRAL_TO_SUPPORT_EXPERT = "referral-to-support-expert",
  REFERRAL_TO_EXPERT = "referral-to-expert",
}
export enum BugFixPagesTypes {
  SUPPORT_EXPERT = "support-expert",
  SUPPORT_MANAGER = "support-manager",
  DEVELOPMENT_EXPERT = "development-expert",
  DEVELOPMENT_MANAGER = "development-manager",
  USER_VERIFY = "user-verify",
  USER_REVIEW = "user-review",
}
export enum UserReviewEnum {
  FIXED = "fixed",
  NOT_FIXED = "not-fixed",
}

export type BugFixAction<T> = {
  value: T;
  label: string;
  icon: React.ReactNode;
  borderColor: string;
};

export type ActionsConfig<T> = {
  changeHandler?: (actionState: T) => void;
  actions: BugFixAction<T>[];
};

export type SelectOption = {
  label: string;
  value: string;
  sueId?: string;
};

export interface BugFixFormData {
  bugFixAction: BugFixActionType | "need-user-action";
  selectValue: { id: number; sueUserId?: number };
  additionalDescription?: string;
  JiraTitle?: string;
  Stakeholder?: string;
  StakeholderDirector?: string;
  StakeholderContatctPoint?: string;
  JiraDescription?: string;
  JiraPersonnelId?: string;
  bugPriority?: string;
  fileAddress?: string;
}

export type BugFixActionType =
  | SupportExpertEnum
  | SupportManagerEnum
  | DevelopmentExpertEnum
  | DevelopmentManagerEnum
  | UserReviewEnum;

// Payload Types for each page type
export interface SupportExpertPayload {
  SueBugApprove: boolean;
  SueEdit: boolean;
  SueDescription?: string;
  BugReasonId: number | null;
  SueBugStatus: number;
  FileAddress: string;
}

export interface SupportManagerPayload {
  SupportManagerBugApprove: boolean;
  HasSueAssignee: boolean;
  SueAssigneePersonnelId: string | null;
  SueAssigneeUserlId: string | null;
  ReferToPaymentDev: boolean;
  ReferToInfraDev: boolean;
  SupportManagerDescription: string;
  SupportManagerBugStatus: number;
  SupportManagerBugReasonId: number | null;
}

export interface DevelopmentExpertTLBOPayload {
  TLBOBugValid: boolean;
  TLBONeedEdit: boolean;
  TLBONewDev: boolean;
  TLBODescription: string;
  TLBOBugReasonId: number | null;
  TLBOBugstatus: number;
  JiraTitle?: string;
  Stakeholder?: string;
  StakeholderDirector?: string;
  StakeholderContatctPoint?: string;
  JiraDescription?: string;
  JiraTlboPersonnelId?: string;
}
export interface DevelopmentExpertTLPPayload {
  TLPBugValid: boolean;
  TLPNeedEdit: boolean;
  TLPNewDev: boolean;
  TLPDescription: string;
  TLPBugReasonId: number;
  TLPBugstatus: number;
  JiraTitle?: string;
  Stakeholder?: string;
  StakeholderDirector?: string;
  StakeholderContatctPoint?: string;
  JiraDescription?: string;
  JiraTlpPersonnelId?: string;
}

export interface DevelopmentManagerMPPayload {
  MPBugValid: boolean;
  MPReferToSupport: boolean;
  MPReferToInfraDev: boolean;
  MPHasTlpAssignee: boolean;
  MPTlpAssigneePersonnelId: string;
  MPDescription: string;
  MPBugReasonId: number | undefined;
  MPBugStatus: number;
  MPTlpAssigneeUserId: string;
}
export interface DevelopmentManagerMBOPayload {
  MBOBugValid: boolean;
  MBOReferToSupport: boolean;
  MBOReferToPaymentDev: boolean;
  MBOHasTlboAssignee: boolean;
  MBOTlboAssigneePersonnelId: string;
  MBODescription: string;
  MBOBugReasonId: number | undefined;
  MBOBugStatus: number;
  MBOTlboAssigneeUserId: string;
}

export interface UserVerifyPayload {
  RequesterVerify: boolean;
  RequesterDescription: string;
  RequesterVerifyBugstatus: number;
}
export interface UserEditPayload {}
export interface UserReviewPayload {}

// Mapped type for Payload_Types
export type Payload_Types = {
  [BugFixPagesTypes.SUPPORT_EXPERT]: SupportExpertPayload;
  [BugFixPagesTypes.SUPPORT_MANAGER]: SupportManagerPayload;
  [BugFixPagesTypes.DEVELOPMENT_EXPERT]:
    | DevelopmentExpertTLPPayload
    | DevelopmentExpertTLBOPayload;
  [BugFixPagesTypes.DEVELOPMENT_MANAGER]:
    | DevelopmentManagerMPPayload
    | DevelopmentManagerMBOPayload;
  [BugFixPagesTypes.USER_VERIFY]: UserVerifyPayload;
  [BugFixPagesTypes.USER_REVIEW]: UserReviewPayload;
};

export type SelectInputConfig = {
  type: NeedToSelectActionType;
  label: string;
  options: SelectOption[];
};

export type NeedToSelectActionType = (typeof needToSelecActions)[number];
export enum BugStatus {
  Open = 1,
  Closed = 2,
}
export interface ApplicationResponse {
  ApplicationId: number;
  Name: string | null;
  ApplicationKey: string | null;
  CreatedDate: string;
}

export interface BugReasonResponse {
  ReasonId: number;
  Title: string | null;
  CreatedDate: string | null;
}

export interface BugResponse {
  RequestId: number;
  ProcessRequestId: number;
  Title: string | null;
  FeatureId: number;
  Link: string | null;
  Description: string | null;
  CreatedDate: string;
}

export interface BugInfoResponse {
  FeatureName: string;
  ApplicationId: number;
  ApplicationName: string;
  Status: any[];
  RequestId: number;
  ProcessRequestId: number;
  Title: string;
  FeatureId: number;
  Link: string;
  Description: string;
  CreatedDate: string;
  Priority: number;
  JiraIssueKey: string;
  Attachments: {
    AttachmentId: number;
    AttachmentKey: string;
    AttachmentAddress: string;
    Title: string;
    PersonnelId: number;
    Assignee: number | null;
    AssigneeType: number | null;
  }[];
}

export interface FeatureResponse {
  FeatureId: number;
  ApplicationId: number;
  Name: string | null;
  Description: string | null;
  CreateDate: string;
}

export enum DevelopmenrUnitsEnum {
  DEVELOPMENT = 1,
  PAYMENT = 2,
}

/* ========================================================================= */
/*  Flat data shapes consumed by workflow hooks / details components          */
/* ========================================================================= */

import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";

export type BugReviewData = {
  requestId: string;
  title: string;
  priority: number;
  priorityLabel: string;
  priorityColor: string;
  featureName: string;
  applicationName: string;
  description: string;
  link: string;
  jiraIssueKey: string;
  fullName: string;
  jobPositionName: string;
  statusName: string;
  statusCode: number;
  createdDate: string;
};

export type BugReviewDetailsProps<TData> = {
  detailsConfig: DetailRow<TData>[];
  data: TData;
  isLoading: boolean;
  requestId?: string;
  managerDescription?: string;
  setManagerDescription?: (value: string) => void;
  descriptionError?: string | null;
};
