"use client";

import MyTasksPage from "@/packages/features/task-inbox/pages/MyTasks";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";

function MyTasksRoutePage() {
  return <MyTasksPage />;
}
export default AppWithTaskInboxSidebar(MyTasksRoutePage);
