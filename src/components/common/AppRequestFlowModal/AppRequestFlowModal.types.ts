import type { GeneralResponse, GetRequestTimelineModel } from "@/services/commonApi/commonApi.type";

export interface AppRequestFlowModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  requestTimeline: GeneralResponse<GetRequestTimelineModel[]> | undefined;
}
