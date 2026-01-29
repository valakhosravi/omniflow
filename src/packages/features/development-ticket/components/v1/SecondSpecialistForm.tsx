import React from "react";
import RequestSummary from "./RequestSummary";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import UploadMultipleFile from "./UploadMultipleFile";

interface SecondSpecialistFormProps {
  requestId: string;
  refetch: () => void;
  developRequestDetails: GeneralResponse<GetDevelopmentTicketModel> | undefined;
  formKey: string;
  requestStatus?: GetLastRequestStatus | undefined;
}

export default function SecondSpecialistForm({
  requestId,
  refetch,
  developRequestDetails,
  formKey,
  requestStatus,
}: SecondSpecialistFormProps) {
  return (
    <>
      <RequestSummary
        requestId={requestId}
        developRequestDetails={developRequestDetails}
      />
      {formKey === "development-product-second-specialist-review" && (
        <UploadMultipleFile
          requestId={requestId}
          classNames="w-full"
          title="فایل‌های پیوست"
          canUpload={false}
        />
      )}
    </>
  );
}

