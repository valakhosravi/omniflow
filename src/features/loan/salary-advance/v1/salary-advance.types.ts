import type { DetailRow } from "@/components/common/AppWorkflowPage/AppWorkflowPage.type";

/* ========================================================================= */
/*  Domain models                                                              */
/* ========================================================================= */

export enum RuleType {
  EMPLOYEE_STATUS = 1,
  EMPLOYMENT_DURATION = 2,
  REQUEST_FREQUENCY = 3,
  REQUEST_FREQUENCY_PER_YEAR = 4,
  REQUEST_FREQUENCY_PER_AMOUNT_RATIO = 5,
}

export interface RuleError {
  ruleId: number;
  ruleType: RuleType;
  message: string;
  code: string;
  amountRatioId?: number;
}

export interface RuleValidationResult {
  isValid: boolean;
  errors: RuleError[];
}

export interface AmountRatio {
  AmountRatioId: number;
  Ratio: number;
  IsActive: boolean;
  RepaymentMonth: number;
  MaxLoansPerMonth: number;
  CreatedDate: string;
}

export interface ProcessRule {
  ProcessRuleId: number;
  ProcessTypeId: number;
  Type: number;
  Value: number;
  IsActive: boolean;
  CreatedDate: string;
}

export interface SalaryAdvancedPaidRequestDetail {
  RequestId: number;
  TrackingCode: number;
  PersonnelId: string;
  RequestCreatedDate: string;
  StatusDescription: string | null;
  AmountRatioId: number;
  AmountRatio: number;
}

export interface SalaryAdvancedPaidRequestGroup {
  RepaymentMonth: number;
  MaxLoansPerMonth: number;
  Details: SalaryAdvancedPaidRequestDetail[];
}

export interface UnterminatedProcess {
  RequestId: number;
  TrackingCode: number;
  PersonnelId: string;
  CreatedDate: string;
  StatusCode: number;
  StatusName: string;
}

export interface LoanRequestDetails {
  UserId: number;
  AmountRatioId: number;
  Ratio: number;
  RepaymentMonth: number;
  MaxLoansPerMonth: number;
  Amount: number;
  Destination: string | null;
  IsStandard: boolean;
  CreatedDate: string;
  RequestId: string;
}

export interface TimelineItem {
  Fullname: string;
  StatusDate: string;
  StatusName: string;
  StatusDescription: string;
  personnelId: number;
  StateCode: number;
  StateName: string;
  StatusCode: number;
}

export interface RequestHistoryItem {
  RequestId: number;
  FullName: string;
  PersonnelId: number;
  StatusName: string;
  StateName: string;
  StatusCode: string;
  StateCode: number;
  TrackingCode: number;
  StatusDescription: string;
  StatusDate: string;
}

/* ========================================================================= */
/*  Follow-up data                                                            */
/* ========================================================================= */

export type SalaryAdvanceFollowUpData = {
  requestId: string;
  fullName: string;
  personnelId: string;
  trackingCode: string;
  amountRatio: number;
  repaymentMonth: number;
  isStandard: boolean;
  paidRequestsCount: number;
  employmentDate: string;
  jobTitle: string;
  nationalCode: string;
};

export type SalaryAdvanceFollowUpDetailsProps = {
  detailsConfig: DetailRow<SalaryAdvanceFollowUpData>[];
  data: SalaryAdvanceFollowUpData;
  isLoading: boolean;
};

/* ========================================================================= */
/*  Check pages (review) data                                                 */
/* ========================================================================= */

export type SalaryAdvanceReviewData = {
  requestId: string;
  fullName: string;
  personnelId: string;
  trackingCode: string;
  jobTitle: string;
  amount: number;
  amountRatio: number; 
  maxLoansPerMonth: number;
  isStandard: boolean;
  repaymentMonth: number;
  paidRequestsCount: number;
  employmentDate: string;
  nationalCode: string;
  destination: string;
  salaryAdvanceId: string;
};

export type CheckFormKey =
  | "salary-advance-request-pre-check"
  | "salary-advance-request-hrh-check"
  | "salary-advance-request-hrm-check"
  | "salary-advance-request-fm-check"
  | "salary-advance-request-te-check";

export type SalaryAdvanceCheckDetailsProps = {
  detailsConfig: DetailRow<SalaryAdvanceReviewData>[];
  data: SalaryAdvanceReviewData;
  isLoading: boolean;
  isTaskClaimed: boolean;
  description: string;
  setDescription: (val: string) => void;
  descriptionError?: string | null;
  children?: React.ReactNode;
};
