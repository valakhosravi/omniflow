"use client";

import React, { useMemo } from "react";
import Loading from "../loading";
import useGetProcessByNameAndVersion from "@/hooks/process/useGetProcessByNameAndVersion";
import AppProcessError from "@/components/common/AppProcessError";
import AppProcessNotImplementedPage from "@/components/common/AppProcessNotImplementedPage";
import DevelopmentTicketIndexV1 from "@/packages/features/development-ticket/pages/DevelopmentTicketIndexV1";
import DevelopmentTicketIndexV2 from "@/packages/features/development-ticket/pages/DevelopmentTicketIndexV2";

export default function DevelopmentRouter() {
  // TODO: call this api serverside
  const {
    data: processByNameAndVersion,
    isLoading,
    isError,
  } = useGetProcessByNameAndVersion("Development");

  const version = useMemo(() => {
    if (processByNameAndVersion) {
      const _version = (processByNameAndVersion as any).Data.Version || -1;
      // TODO: show version in url
      // push(`/development?version=${_version}`);
      return _version;
    } else {
      return -1;
    }
  }, [processByNameAndVersion]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <AppProcessError />;
  }

  switch (version) {
    case 1:
    case 2:
    case 3:
      return <DevelopmentTicketIndexV1 />;
    case 4:
      return <DevelopmentTicketIndexV2 />;

    default:
      return (
        <AppProcessNotImplementedPage
          formKey="start"
          processName="development"
          version={version}
        />
      );
  }
}
