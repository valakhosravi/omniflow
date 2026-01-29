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
  ColorCode: string;
  Title: string;
  TrackingCode: number;
  LabelId: number | 0;
  SnoozeDate: string;
  SnoozeId: number | 0;
  Version: number;
  ProcessName: string;
  IsDeprecated: boolean;
}

export interface UserRequestsTaskModel {
  requestId: number;
  processId: number;
  userId: number;
  instanceId: string;
  isTerminated: boolean;
  terminatedDate?: string;
  createdDate: string;
  fullName: string;
  name: string;
  formName: string;
  formTitle: string;
  taskId: string;
  personnelId: string;
  ColorCode: string;
  LabelId: number | 0;
  SnoozeId: number | 0;
  SnoozeDate: string;
}
