export interface GetProcessByNameAndVersionResponse {
  CreatedDate: string;
  DefinitionId: string;
  IsDeprecated: boolean;
  Name: string;
  ProcessKey: string;
  ProcessTypeId: number;
  Version: number | string; // Can be number or string depending on API version
}

export interface GetProcessByNameAndVersionParams {
  processName: string;
  version: string;
}
