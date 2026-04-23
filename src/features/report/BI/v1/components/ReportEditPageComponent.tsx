"use client";

import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import ReportStartPageComponent from "./ReportStartPageComponent";
import { ReportComponentType } from "../reportV1.types";

function ReportEditPageComponent() {
  return <ReportStartPageComponent type={ReportComponentType.EDIT} />;
}

export default AppWithTaskInboxSidebar(ReportEditPageComponent);
