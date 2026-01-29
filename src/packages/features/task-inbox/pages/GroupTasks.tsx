"use client";
import TaskInboxLayout from "../layouts";
import Toolbar from "../components/Toolbar";
import TaskTable from "../components/TaskTable";
import { TaskFilter } from "@/constants/task-filter";

export default function GroupTasksPage() {
  return (
    <TaskInboxLayout>
      <Toolbar title={`گروه من`} />
      <TaskTable type={TaskFilter.CandidateGroup} />
    </TaskInboxLayout>
  );
}
