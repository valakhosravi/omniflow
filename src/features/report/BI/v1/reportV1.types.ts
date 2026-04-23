import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";

/* ========================================================================= */
/*  API / Entity types                                                        */
/* ========================================================================= */

export enum AIMLTargetModel {
  Regression = 1,
  Classification = 2,
  Clustering = 3,
}

export interface AIMLTargetModelDetails {
  TargetModel: AIMLTargetModel;
  TargetModelName?: string | null;
}

export enum DataAccessClearance {
  Confidential = 1,
  Internal = 2,
  Public = 3,
}

export interface DataAccessClearanceDetails {
  DataAccessClearance: DataAccessClearance;
  DataAccessClearanceDescription?: string | null;
  DataAccessClearanceName?: string | null;
}

export interface CategoryDetails {
  CategoryId: number;
  Name?: string | null;
  CreatedDate: string;
}

export interface DataScopeDetails {
  DataScopeId: number;
  Name?: string | null;
  CreatedDate: string;
}

export interface KpiDetails {
  Kpiid: number;
  Name?: string | null;
  CreatedDate: string;
}

export enum ModelLimitation {
  TimeLimit = 1,
  DataSize = 2,
  Accuracy = 3,
}

export interface ModelLimitationDetails {
  ModelLimitation: ModelLimitation;
  ModelLimitationName?: string | null;
}

export enum OutputFormat {
  Pdf = 1,
  Excel = 2,
  Csv = 3,
  Image = 4,
}

export interface OutputFormatDetails {
  OutputFormat: OutputFormat;
  OutputFormatDescription?: string | null;
  OutputFormatName?: string | null;
}

export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

export interface PriorityDetails {
  Priority: Priority;
  PriorityDescription?: string | null;
  PriorityName?: string | null;
}

export enum ReportUpdatePeriod {
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
  Quarterly = 4,
  Yearly = 5,
}

export interface ReportUpdatePeriodDetails {
  ReportUpdatePeriod: ReportUpdatePeriod;
  ReportUpdatePeriodName?: string | null;
}

export interface ReportAttachmentDetails {
  AttachmentId: number;
  AttachmentKey: string;
  AttachmentAddress: string;
  Title: string;
  PersonnelId: number;
  Assignee: string;
  AssigneeType: string;
}

export interface ReportRequest {
  AimlId: number;
  CategoryId: number;
  CategoryName: string;
  CreatedDate: string; // ISO date string
  DataAccessId: number;
  DataAccessName: string;
  DataScopeId: number;
  DataScopeName: string;
  DeliveryDate: string | null;
  Description: string | null;
  Filters: string | null;
  IsAiml: boolean;
  KpiId?: number;
  KpiName?: string;
  /** Comma-separated KPI values (new format) */
  Kpi?: string;
  ModelLimitationId: number;
  ModelLimitationName: string;
  NeedCompare: boolean;
  OutputFormatId: number;
  OutputFormatName: string;
  PriorityId: number;
  PriorityName: string;
  JiraIssueKey: string;
  ReportAttachmentDetails: ReportAttachmentDetails[]; // replace `any` with a specific type if known
  ReportId: number;
  ReportUpdateId: number;
  ReportUpdateName: string;
  RequestId: number;
  Requirements: string | null;
  Target: string | null;
  TargetModelId: number;
  TargetModelName: string;
  TargetVariable: string | null;
  Title: string;
  UserId: number;
}

export enum ReportComponentType {
  EDIT,
  CREATE,
}

export interface SaveReportRequest {
  RequestId: number;
  CategoryId: number;
  PriorityId: number;
  Target?: string | null;
  Description?: string | null;
  OutputFormatId: number;
  DataScopeId: number;
  Kpiid: number;
  Filters?: string | null;
  DataAccessId: number;
  DeliveryDate?: string | null;
  NeedCompare?: boolean | null;
  ReportUpdateId: number;
  IsAiml: boolean;
  TargetModelId?: number | null;
  TargetVariable?: string | null;
  ModelLimitationId?: number | null;
  Requirements?: string | null;
}

export interface SaveAIMLReportRequest {
  ReportId: number;
  TargetModelId: number;
  TargetVariable?: string | null;
  ModelLimitationId: number;
  Requirements?: string | null;
}

export interface EditReportRequest {
  CategoryId?: number | null;
  PriorityId?: number | null;
  Target?: string | null;
  Description?: string | null;
  OutputFormatId?: number | null;
  DataScopeId?: number | null;
  KpiId?: number | null;
  Filters?: string | null;
  DataAccessId?: number | null;
  DeliveryDate?: string | null;
  NeedCompare?: boolean | null;
  ReportUpdateId?: number | null;
  IsAiml: boolean;
  TargetModelId?: number | null;
  TargetVariable?: string | null;
  ModelLimitationId?: number | null;
  Requirements?: string | null;
}
export const KPI_OTHER_KEY = "other";

export interface ReportTicketFormData {
  title: string;
  requestType?: number;
  order?: number;
  purpose: string;
  description: string;
  requiredOutput?: number;
  dataRange?: number;
  kpis?: string[];
  kpisOther?: string;
  filter?: string;
  accessLevel?: number;
  deliveryTime: string;
  modelingRequest: boolean;
  modelPurpose?: number;
  targetVariable: string;
  modelLimitation?: number;
  updatePeriod?: number;
  requirements: string;
  needToCompare: boolean;
}

export type ReportFormPropsType = {
  reportInfo?: ReportRequest;
  reportType: ReportComponentType;
};

/* ========================================================================= */
/*  Form / UI types                                                           */
/* ========================================================================= */

export type SelectOption = {
  label: string;
  value: string | number;
};

export type ReportFormOptions = {
  category: SelectOption[];
  priority: SelectOption[];
  outputFormat: SelectOption[];
  dataScope: SelectOption[];
  access: SelectOption[];
  AIMLTarget: SelectOption[];
  modelLimitation: SelectOption[];
  updatePeriod: SelectOption[];
};

/* ========================================================================= */
/*  Review / Workflow data types                                               */
/* ========================================================================= */

export type BaseReportReviewData = {
  requestId: string;
  requestTitle: string;
  categoryName: string;
  priorityName: string;
  target: string;
  description: string;
  outputFormatName: string;
  dataScopeName: string;
  kpiName: string;
  filters: string;
  dataAccessName: string;
  reportUpdateName: string;
  deliveryDate: string;
  needToCompare: boolean;
  isAiml: boolean;
};

export type DGReviewData = BaseReportReviewData;

export type ReportManagerReviewData = BaseReportReviewData & {
  reportRequestId: number;
  trackingCode: string;
  jiraIssueKey: string;
};

export type ReportFollowUpData = {
  requestId: string;
  requestTitle: string;
  categoryName: string;
  priorityName: string;
  target: string;
  description: string;
  outputFormatName: string;
  dataScopeName: string;
  kpiName: string;
  filters: string;
  dataAccessName: string;
  reportUpdateName: string;
  deliveryDate: string;
  modelLimitationName: string;
  trackingCode: string;
  jiraIssueKey: string;
};

export type JiraApproveFormData = {
  stackHolder: string;
  taskFollower: string;
  reportRecipient: string;
  summary: string;
  jiraDescription: string;
};

export type ReferExpertFormData = {
  expertKey: string;
  expertPersonnelId: string;
};

/* ========================================================================= */
/*  Component prop types                                                      */
/* ========================================================================= */

export type ReportReviewDetailsProps<TData> = {
  detailsConfig: DetailRow<TData>[];
  data: TData;
  isLoading: boolean;
  /** When provided, renders a read-only file attachment section */
  requestId?: string;
  /** When provided, renders a textarea for manager description */
  managerDescription?: string;
  setManagerDescription?: (value: string) => void;
};

export interface JiraApproveModalContentProps {
  onClose: () => void;
  onConfirm: (data: JiraApproveFormData) => Promise<void>;
  stackHolders: { Description: string }[];
  stackHolderDirectors: { Description: string }[];
  isLoadingStackHolders: boolean;
  isLoadingStackHolderDirectors: boolean;
  isSubmitting: boolean;
}

export interface GroupUserItem {
  Key: string;
  DisplayName: string;
  PersonnelId: number;
}

export interface ReferExpertModalContentProps {
  onClose: () => void;
  onConfirm: (data: {
    expertKey: string;
    expertPersonnelId: string;
  }) => Promise<void>;
  groupUsers: GroupUserItem[];
  isSubmitting: boolean;
}
