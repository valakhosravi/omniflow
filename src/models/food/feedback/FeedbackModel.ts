export default interface CommentModel {
  Items: CommentItems[];
  TotalCount: number;
  PageSize: number;
  CurrentPage: number;
  TotalPages: number;
  HasPrevious: boolean;
  HasNext: boolean;
}

export interface CommentItems {
  FeedbackId: number;
  UserId: number;
  Rating: number;
  Message: string;
  FullName: string;
  PlanName: string;
  CreatedDate: string;
}
