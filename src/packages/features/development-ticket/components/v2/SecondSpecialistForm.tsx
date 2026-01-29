import React, { useState } from "react";
import RequestSummary from "./RequestSummary";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { FileType } from "@/components/common/AppFile/AppFile.types";

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
  const [files, setFiles] = useState<FileType[] | []>([]);

  return (
    <>
      <RequestSummary
        requestId={requestId}
        developRequestDetails={developRequestDetails}
      />
      {formKey === "development-product-second-specialist-review" && (
        <AppFile
          requestId={requestId}
          isMultiple={false}
          files={files}
          setFiles={setFiles}
          enableUpload={true}
          featureName={FeatureNamesEnum.DEVELOPMENT}
        />
      )}
    </>
  );
}
