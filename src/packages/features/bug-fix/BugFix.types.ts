import GeneralResponse from "@/models/general-response/general_response";
import { needToSelecActions } from "./BugFix.const";

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
  USER_EDIT = "user-edit",
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
};

export type InfoRowProps = {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  isTextArea?: boolean;
};

export interface BugFixFormData<T> {
  bugFixAction: BugFixActionType | "need-user-action";
  selectValue: number;
  additionalDescription?: string;
  JiraTitle?: string;
  Stakeholder?: string;
  StakeholderDirector?: string;
  StakeholderContatctPoint?: string;
  JiraDescription?: string;
  JiraPersonnelId?: string;
  bugPriority?: string;
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
  SuePersonnelId: string;
  SueUserId: number;
}

export interface SupportManagerPayload {
  SupportManagerBugApprove: boolean;
  HasSueAssignee: boolean;
  SueAssigneePersonnelId: string | null;
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
  TLBOBugReasonId: number;
  TLBOBugstatus: number;
  JiraTitle: string;
  Stakeholder: string;
  StakeholderDirector: string;
  StakeholderContatctPoint: string;
  JiraDescription: string;
  JiraTlboPersonnelId: string;
}
export interface DevelopmentExpertTLPPayload {
  TLPBugValid: boolean;
  TLPNeedEdit: boolean;
  TLPNewDev: boolean;
  TLPDescription: string;
  TLPBugReasonId: number;
  TLPBugstatus: number;
  JiraTitle: string;
  Stakeholder: string;
  StakeholderDirector: string;
  StakeholderContatctPoint: string;
  JiraDescription: string;
  JiraTlpPersonnelId: string;
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
  [BugFixPagesTypes.USER_EDIT]: UserEditPayload;
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
