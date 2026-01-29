// New structure for the updated API response
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

// Keep the old interface for backward compatibility
export interface SalaryAdvancedPaidRequest {
  RequestId: number;
  InstanceId: string;
  PersonnelId: string;
  FullName: string;
  Title: string;
  TrackingCode: string;
  RequestDate: string;
  PaidDate: string;
  Amount: number;
  Year: number;
  Month: number;
  StatusName: string;
  StatusCode: number;
  ProcessTypeName: string;
}
