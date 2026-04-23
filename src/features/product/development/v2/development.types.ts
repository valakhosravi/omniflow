import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import {
  GeneralResponse,
  GetRequestById,
} from "@/services/commonApi/commonApi.type";

export enum DevelopmentPagesEnum {
  START = "start",
  FOLLOW_UP = "follow_up",
  EDIT = "development_edit",
  MANAGER_REVIEW = "development_manager_review",
  PRODUCT_MANAGER = "development-product-manager-review",
  PRODUCT_SPECIALIST = "development-product-specialist-review",
  SECOND_SPECIALIST = "development-product-second-specialist-review",
}
export interface CreateRequest {
  Summary: string;
  Description: string;
  TrackingCode: number;
  StackHolder: string;
  Assignee: string;
}
export interface CreateJiraIssueRequest {
  Fields: {
    project: {
      key: string;
    };
    summary: string;
    description: string;
    issuetype: {
      name: string;
    };
    assignee: {
      name: string;
    };
    customfield_10204?: string;
    labels?: string[];
    priority: {
      name: string;
    };
    components?: Array<{ name: string }>;
  };
  FileAddress?: string;
  BucketName: string;
}

export interface DevelopmetDetailsType {
  UserId: number;
  PersonnelId: number;
  FullName: string;
  RequestId: number;
  StatusCode: number;
  Description: string | null;
  StatusName: string;
  CreatedDate: string;
  ActionDate: string;
  TrackingCode: number;
  InstanceId: string;
  Title: string;
}
export interface GetUsernameByPersonnelId {
  Username?: string | null;
}
export interface DevelopmentTicketFormData {
  title: string;
  requestType: number;
  order: number;
  description: string;
  deputyName: string | null;
  stackHolderContactDirector: string;
  hasSimilarProcess: number | null;
  similarProcessDescription: string | null;
  isRegulatoryCompliant: number | null;
  regulatoryCompliantDescription: string | null;
  beneficialCustomers: string | null;
  customerUsageDescription: string | null;
  requestedFeatures: string | null;
  isReportRequired: boolean;
  reportPath: string | null;
  expectedOutput: string | null;
  technicalDetails: string | null;
  kpi: string | null;
  letterNumber: string | null;
  stackHolder: string | null;
  extraDescription: string | null;
}

export interface DevelopmentCreateFormInputsSectionProps {
  errors: FieldErrors<DevelopmentTicketFormData>;
  register: UseFormRegister<DevelopmentTicketFormData>;
  control: Control<DevelopmentTicketFormData, any, DevelopmentTicketFormData>;
  watch: UseFormWatch<DevelopmentTicketFormData>;
  pageType: DevelopmentPagesEnum;
}

export interface DevelopmentRequestDetailsResponse {
  RequestId: number;
  ProcessRequestId: number;
  UserId: number;
  ApplicationId: number | null;
  Description: string;
  RequestType: number;
  RequestTypeName: string;
  Priority: number;
  PriorityName: string;
  ExtraDescription: string | null;
  DeputyName: string;
  BeneficialCustomers: string;
  CustomerUsageDescription: string;
  RequestedFeatures: string;
  IsReportRequired: boolean;
  ReportPath: string | null;
  HasSimilarProcess: number;
  HasSimilarProcessName: string;
  SimilarProcessDescription: string;
  IsRegulatoryCompliant: number;
  IsRegulatoryCompliantName: string;
  RegulatoryCompliantDescription: string | null;
  ExpectedOutput: string;
  TechnicalDetails: string | null;
  Kpi: string | null;
  LetterNumber: string | null;
  JiraTaskAssignee: string | null;
  JiraIssueKey: string | null;
  CreatedDate: string; // ISO date string
  StatusDetails: string | null;
  FullName: string;
  Title: string;
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

export type ProductManagerFormProps = {
  requestId: string;
  refetch: () => void;
  developRequestDetails: GeneralResponse<GetRequestById> | undefined;
  formKey: string;
};
export interface CreateJiraIssueModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  developRequestDetails?: GeneralResponse<DevelopmetDetailsType> | undefined;
  developTicketDetail?: any;
  requestId: string;
  onSuccess?: () => void;
  trackingCode: string;
}

export interface CreateJiraIssueFormData {
  assignee: string;
  priority: string;
  components?: string[];
}

/* ========================================================================= */
/*  Flat data shapes consumed by workflow hooks / details components          */
/* ========================================================================= */

import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";

export type DevelopmentReviewData = {
  requestId: string;
  fullName: string;
  jobTitle: string;
  personnelId: string | number;
  requestTypeName: string;
  priorityName: string;
  requestTitle: string;
  trackingCode: string;
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
  description: string;
  extraDescription: string | null;
  jiraIssueKey: string | null;
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
