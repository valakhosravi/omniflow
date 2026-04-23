import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";

// --- Development request models ---

export interface DevelopmetDetailsType {
  UserId: number;
  PersonnelId: number;
  FullName: string;
  RequestId: number;
  StatusCode: number;
  Description: null;
  StatusName: string;
  CreatedDate: string;
  ActionDate: string;
  TrackingCode: number;
  InstanceId: string;
  Title: string;
}

export interface GetDevelopmentRequestDetailsModel {
  DevelopId: number;
  RequestId: number;
  UserId: number;
  ApplicationId: string | null;
  Description: string;
  RequestType: number;
  RequestTypeName: string;
  Priority: number;
  PriorityName: string;
  ExtraDescription: string | null;
  CreatedDate: string;
  DeputyName?: string | null;
  BeneficialCustomers?: string | null;
  CustomerUsageDescription?: string | null;
  RequestedFeatures?: string | null;
  IsReportRequired?: boolean | null;
  ReportPath?: string | null;
  HasSimilarProcess?: number | null;
  HasSimilarProcessName?: string | null;
  SimilarProcessDescription?: string | null;
  IsRegulatoryCompliant?: number | null;
  IsRegulatoryCompliantName?: string | null;
  RegulatoryCompliantDescription?: string | null;
  ExpectedOutput?: string | null;
  TechnicalDetails?: string | null;
  Kpi?: string | null;
  LetterNumber?: string | null;
  StackHolderContactDirector?: string | null;
  StackHolder?: string | null;
  JiraTaskAssignee?: string | null;
  FullName?: string | null;
}

export enum RequestType {
  Change = 1,
  Development = 2,
}

export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
}

export interface CreateDevelopRequest {
  RequestId: number;
  ApplicationId?: number | null;
  Description: string;
  RequestType: RequestType;
  Priority: Priority;
  ExtraDescription?: string | null;
}

export interface EditDevelopRequest {
  ApplicationId?: number | null;
  Description?: string | null;
  RequestType?: RequestType;
  Priority?: Priority;
  ExtraDescription?: string | null;
  Title?: string | null;
}

export interface GetAllDevelopDetails {
  DevelopId: number;
  RequestId: number;
  UserId: number;
  ApplicationId?: number | null;
  Description?: string | null;
  RequestType: RequestType;
  RequestTypeName?: string | null;
  Priority: Priority;
  PriorityName?: string | null;
  ExtraDescription?: string | null;
  CreatedDate: string;
}

export interface UserInfoDetails {
  UserId: number;
  PersonnelId: number;
  FullName?: string | null;
  Mobile?: string | null;
  IsActive: boolean;
  PositionType?: number | null;
  Title?: string | null;
}

// --- Form data ---

export interface DevelopmentTicketFormData {
  title: string;
  requestType: number;
  order: number;
  description: string;
  deputyName?: string;
  stackHolderContactDirector?: string;
  hasSimilarProcess?: number;
  similarProcessDescription?: string;
  isRegulatoryCompliant?: number;
  regulatoryCompliantDescription?: string;
  beneficialCustomers?: string;
  customerUsageDescription?: string;
  requestedFeatures?: string;
  isReportRequired?: boolean;
  reportPath?: string;
  expectedOutput?: string;
  technicalDetails?: string;
  kpi?: string;
  letterNumber?: string;
  stackHolder?: string;
  extraDescription?: string;
}

// --- Internal API types ---

export interface MessageRequest {
  body: any;
}

// --- Workflow page types ---

export type DevelopmentReviewData = {
  requestId: string;
  fullName: string;
  jobTitle: string;
  personnelId: string | number;
  requestTypeName: string;
  priorityName: string;
  requestTitle: string;
  trackingCode: string;
  description: string;
  extraDescription: string | null;
  deputyName: string;
  hasSimilarProcessName: string;
  hasSimilarProcess: number;
  similarProcessDescription: string;
  isRegulatoryCompliantName: string;
  isRegulatoryCompliant: number;
  regulatoryCompliantDescription: string | null;
  beneficialCustomers: string;
  customerUsageDescription: string;
  requestedFeatures: string;
  isReportRequired: boolean;
  expectedOutput: string;
  technicalDetails: string | null;
  kpi: string | null;
  letterNumber: string | null;
  jiraTaskAssignee: string | null;
};

export type DevelopmentReviewDetailsProps<TData> = {
  detailsConfig: DetailRow<TData>[];
  data: TData;
  isLoading: boolean;
  requestId?: string;
  managerDescription?: string;
  setManagerDescription?: (value: string) => void;
  descriptionError?: string | null;
};
