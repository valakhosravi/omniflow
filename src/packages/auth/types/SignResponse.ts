export interface SigninResponse {
  PersonnelId: string;
  FullName: string;
  Mobile: string;
  IsActive: boolean;
  Token: string;
  ExpireTime: number;
}
