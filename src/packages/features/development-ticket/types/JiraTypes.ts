export interface CreateRequest {
  Summary: string;
  Description: string;
  TrackingCode: number;
  StackHolder: string;
  Assignee: string;
}

export interface CreateReportRequest {
  Summary: string;
  Description: string;
  TrackingCode: number;
  StackHolder: string;
  Assignee: string;
  StackHolderContactPoint: string[];
  StackHolderContactDirector?: string | null;
}

export interface GetStackHolder {
  StackHolderId: number;
  Description?: string | null;
}

export interface StackHolderDirectorDetails {
  StackHolderDirectorId: number;
  Description?: string | null;
}

export interface UserGroupDetail {
  Self?: string | null;
  Name?: string | null;
  Key?: string | null;
  EmailAddress?: string | null;
  DisplayName?: string | null;
  Active: boolean;
  TimeZone?: string | null;
}

export interface GroupMemebers {
  Self?: string | null;
  MaxResults: number;
  StartAt: number;
  Total: number;
  IsLast: boolean;
  Values?: UserGroupDetail[] | null;
}

export interface GroupUsersByProperty {
  Self?: string | null;
  Name?: string | null;
  Key?: string | null;
  EmailAddress?: string | null;
  DisplayName?: string | null;
  Active: boolean;
  TimeZone?: string | null;
  PersonnelId: number;
}

export interface GetGroupUsersByPropertyDetails {
  Self?: string | null;
  MaxResults: number;
  StartAt: number;
  Total: number;
  IsLast: boolean;
  Values?: GroupUsersByProperty[] | null;
}

export interface PersonnelIdProperty {
  PersonnelId: number;
}

export interface GetUsernameByPersonnelId {
  Username?: string | null;
}

export enum JiraPropertyTypes {
  PropertyType1 = 1,
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

