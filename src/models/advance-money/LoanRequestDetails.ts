export interface LoanRequestDetails {
  UserId: number;
  AmountRatioId: number;
  AmountRatio: number;
  RepaymentMonth: number;
  MaxLoansPerMonth: number;
  Amount: number;
  Destination: string | null;
  IsStandard: boolean;
  CreatedDate: string;
  RequestId: string;
}
