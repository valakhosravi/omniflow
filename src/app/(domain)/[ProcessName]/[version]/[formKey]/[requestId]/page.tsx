"use client";

import AppProcessNotImplementedPage from "@/components/common/AppProcessNotImplementedPage";
import { useParams } from "next/navigation";

function NotFound() {
  const params = useParams();
  const processName = params?.processName as string;
  const version = params?.version as string;
  const formKey = params?.formKey as string;
  const requestId = params?.requestId as string;

  switch (processName) {
    default:
      return (
        <AppProcessNotImplementedPage
          formKey={formKey}
          processName={processName}
          requestId={requestId}
          version={version}
        />
      );
  }
}
export default NotFound;
