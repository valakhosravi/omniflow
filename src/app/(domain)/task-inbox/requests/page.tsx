"use client";

import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import RequestIndex from "@/packages/features/task-inbox/pages/RequestIndex";

function RequestsPage() {
  return <RequestIndex />;
}

export default AppWithTaskInboxSidebar(RequestsPage);
