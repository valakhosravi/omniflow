"use client";

import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import CompletedTasksIndex from "@/packages/features/task-inbox/pages/CompletedTasksIndex";

function CompletedTasksPage() {
  return <CompletedTasksIndex />;
}

export default AppWithTaskInboxSidebar(CompletedTasksPage);
