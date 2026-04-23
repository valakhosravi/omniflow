import type React from "react";

export type AppWorkflowRequestDetailItem = {
  id?: string | number;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  value?: React.ReactNode;
};

export type AppWorkflowRequestDetailProps = {
  /** The only required prop — component handles data fetching internally */
  requestId: number;
  title?: React.ReactNode;
  stickyTop?: number;
  className?: string;
  cardClassName?: string;
};
