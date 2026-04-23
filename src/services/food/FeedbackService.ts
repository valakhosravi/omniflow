import CreateCommentModel from "@/models/food/feedback/CreateFeedbackModel";
import http from "../httpService";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import CommentModel from "@/models/food/feedback/FeedbackModel";
import TotalRateModel from "@/models/food/feedback/TotalRateModel";

export async function getFeedbackGetByMealIdApi(id: number) {
  const { data } = await http.get<GeneralResponse<CommentModel>>(
    `/api/v2/food/client/Feedback/GetByMealId/${id}`,
  );
  return data;
}

export async function getRateByDailyMealIdApi(id: number) {
  const { data } = await http.get<GeneralResponse<null>>(
    `/api/v2/food/client/feedback/GetRateByDailyMealId/${id}`,
  );
  return data;
}

export async function getHasWriteFeedbackApi(id: number) {
  const { data } = await http.get<GeneralResponse<null>>(
    `/api/v2/food/client/Feedback/HasWriteFeedback/${id}`,
  );
  return data;
}

export async function getTotalRateApi(id: number) {
  const { data } = await http.get<GeneralResponse<TotalRateModel>>(
    `/api/v2/food/client/Feedback/GetTotalRate/${id}`,
  );
  return data;
}

export async function createFeedbackApi({
  MealId,
  DailyMealId,
  Message,
  Rating,
}: CreateCommentModel) {
  const { data } = await http.post<GeneralResponse<null>>(
    "/api/v2/food/client/Feedback/Create",
    {
      MealId,
      DailyMealId,
      Message,
      Rating,
    },
  );
  return data;
}

export async function UserFeedbackDeleteApi(id: number) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/v2/food/client/Feedback/DeleteUserFeedback/${id}`,
  );
  return data;
}

export async function AdminFeedbackDeleteApi(id: number) {
  const { data } = await http.delete<GeneralResponse<null>>(
    `/api/v2/food/client/Feedback/Delete/${id}`,
  );
  return data;
}
