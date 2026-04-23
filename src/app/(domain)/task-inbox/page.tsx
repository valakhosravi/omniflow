"use client";

import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";
import TaskInboxIndexPage from "@/packages/features/task-inbox/pages/Index";
import React from "react";

function TaskInboxPage() {
  return <TaskInboxIndexPage />;
}

export default AppWithTaskInboxSidebar(TaskInboxPage);
