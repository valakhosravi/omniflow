export interface GetUserRequests {
  CanBeCanceled: boolean;
  InstanceId: string; // معادل Guid در C#
  IsTerminated: boolean;
  TerminatedDate: string | null; // معادل DateTime? در C#
  CreatedDate: string; // معادل DateTime در C#
  ProcessTypeName: string;
  StatusName: string;
  FullName: string;
  PersonnelId: string;
  Title: string;
  TrackingCode: string;
  RequestId: number;
  LabelId: number;
  LabelColor: string;
  LabelName: string;
  StatusDate: string;
  IsRead: boolean;
  StatusCode: number;
  StateCode: number;
  StateName: string;
  SnoozeId: number | null;
  SnoozeDate: string;
  JobPositionName: string;
}

export interface GetLastRequestStatus {
  StatusName: string;
  FullName: string;
  JobPositionName: string;
  StatusCode: number;
  StatusDate: string;
  UserId: string;
  CanBeCanceled: boolean;
  CreatedDate: string;
}
