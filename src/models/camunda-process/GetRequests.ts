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

export interface GetRequestById {
  UserId: number;
  FullName: string;
  RequestId: number;
  StatusCode: number;
  Description: string;
  StatusName: string;
  CreatedDate: string;
  ActionDate: string;
  TrackingCode: number;
  PersonnelId: number;
  InstanceId: string;
  BusinessKey: string;
  ProcessInstanceId?: string;
  Title: string;
}

export interface GetRequestTimelineModel {
  Fullname: string;
  StatusDate: string;
  StatusName: string;
  StatusDescription: string | null;
  personnelId: number;
  StateCode: number;
  StateName: string;
  StatusCode: number;
  JobPositionName: string;
}
