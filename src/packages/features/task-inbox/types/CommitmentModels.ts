export interface GetCommitments {
  CommitmentLetterId: number;
  UserId: number;
  IsApprove: boolean;
  CreatedDate: string;
}

export interface saveCommitment {
  IsApprove: boolean;
}
