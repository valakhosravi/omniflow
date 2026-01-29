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

export interface CreateApplicationRequest {
  Name: string;
  Parent?: string | null;
}

export interface EditApplicationRequest {
  Name: string;
  Parent?: string | null;
}

export interface GetAllApplicationRequest {
  ApplicationId?: number;
  Name?: string | null;
  Parent?: string | null;
  CreatedDate?: string;
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
  DelivaryDate: string | null;
  Description: string | null;
  Filters: string | null;
  IsAiml: boolean;
  KpiId: number;
  KpiName: string;
  ModelLimitationId: number;
  ModelLimitationName: string;
  NeedCompare: boolean;
  OutputFormatId: number;
  OutputFormatName: string;
  PriorityId: number;
  PriorityName: string;
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
  DelivaryDate?: string | null;
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
  DelivaryDate?: string | null;
  NeedCompare?: boolean | null;
  ReportUpdateId?: number | null;
  IsAiml: boolean;
  TargetModelId?: number | null;
  TargetVariable?: string | null;
  ModelLimitationId?: number | null;
  Requirements?: string | null;
}
export interface ReportTicketFormData {
  title: string;
  requestType?: number;
  order?: number;
  purpose: string;
  description: string;
  requiredOutput?: number;
  dataRange?: number;
  kpis?: number;
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
