"use client";
import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
import { useRouter } from "next/navigation";
import GeneralResponse from "@/packages/core/types/api/general_response";
import { GetDevelopmentTicketModel } from "../../types/DevelopmentRequests";
import { FORM_COMPONENTS_DEVELOPMENT } from "../../constants/constant";

interface RequestDescriptionProps {
  formKey?: string;
  requestId?: string;
  requestStatus: GetLastRequestStatus | undefined;
  refetch: () => void;
  developRequestDetails: GeneralResponse<GetDevelopmentTicketModel> | undefined;
}

export default function RequestDescription({
  formKey,
  requestId,
  requestStatus,
  refetch,
  developRequestDetails,
}: RequestDescriptionProps) {
  const router = useRouter();
  const FormComponent = FORM_COMPONENTS_DEVELOPMENT[0][formKey ?? ""];

  if (!FormComponent) {
    return null;
  }

  return (
    <div className="col-span-8 border border-primary-950/[.1] rounded-[20px] p-4 space-y-[24px]">
      <h4 className="font-medium text-[16px]/[30px] text-primary-950">
        شرح درخواست
      </h4>
      <div className="h-[1px] bg-primary-950/[.1] w-full mt-3 mb-4" />
      <FormComponent
        requestId={requestId}
        requestStatus={requestStatus}
        refetch={refetch}
        developRequestDetails={developRequestDetails}
        formKey={formKey}
      />
    </div>
  );
}
