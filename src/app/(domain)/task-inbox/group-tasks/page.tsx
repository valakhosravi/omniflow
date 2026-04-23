"use client";

import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import GroupTasksPage from "@/packages/features/task-inbox/pages/GroupTasks";

function GroupTasksRoutePage() {
  return <GroupTasksPage />;
}

export default AppWithTaskInboxSidebar(GroupTasksRoutePage);
