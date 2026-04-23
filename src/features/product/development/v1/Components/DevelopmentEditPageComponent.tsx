"use client";

import { useParams } from "next/navigation";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import { useGetDevelopmentTicketQuery } from "../development.services";
import { useGetLastRequestStatusQuery } from "@/services/commonApi/commonApi";
import EditForm from "./EditForm";

function DevelopmentEditPageComponent() {
  const params = useParams();
  const requestId = String(params?.requestId);

  const {
    data: developRequestDetails,
    refetch,
  } = useGetDevelopmentTicketQuery(Number(requestId), {
    skip: !requestId,
  });

  const { refetch: refetchStatus } = useGetLastRequestStatusQuery(
    Number(requestId),
    { skip: !requestId, refetchOnMountOrArgChange: true },
  );

  return (
    <EditForm
      requestId={requestId}
      refetch={() => {
        refetch();
        refetchStatus();
      }}
      developRequestDetails={developRequestDetails}
      formKey="development-edit"
    />
  );
}

export default AppWithTaskInboxSidebar(DevelopmentEditPageComponent);
