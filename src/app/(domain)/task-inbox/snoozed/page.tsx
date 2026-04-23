"use client";

import SnoozeIndex from "@/packages/features/task-inbox/pages/SnoozeIndex";
import { AppWithTaskInboxSidebar } from "@/components/common/AppWithTaskInboxSidebar";

function SnoozedPage() {
  return <SnoozeIndex />;
}

export default AppWithTaskInboxSidebar(SnoozedPage);
