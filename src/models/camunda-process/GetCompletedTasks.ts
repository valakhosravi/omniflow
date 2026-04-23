export interface CompletedTask {
  RequestId: number;
  RequestCreatorId: number;
  RequestCreatorName: string;
  PersonnelId: number;
  Title: string;
  InstanceId: string;
  TrackingCode: string;
  IsTerminated: boolean;
  IsRead: boolean;
  IsVerified: boolean;
  ProcessTypeName: string;
  ProcessName: string;
  DefinitionId: string;
  Version: string;
  StatusCode: string;
  StatusName: string;
  StatusDate: string;
}
