export interface GetRequestsByInstanceIds {
  RequestId: number;
  ProcessId: number;
  UserId: number;
  PersonnelId: string;
  InstanceId: string;
  IsTerminated: boolean;
  TerminatedDate?: string; // یا `Date` اگر پارسش می‌کنی
  CreatedDate: string; // یا `Date`
  FullName: string;
  Name: string;
}
