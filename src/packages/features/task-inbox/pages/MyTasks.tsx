"use client";
import TaskInboxLayout from "../layouts";
import Toolbar from "../components/Toolbar";
import TaskTable from "../components/TaskTable";
import { TaskFilter } from "@/constants/task-filter";

export default function MyTasksPage() {
  return (
    <TaskInboxLayout>
      <Toolbar title={`وظایف من`} />
      <TaskTable type={TaskFilter.Assignee} />
    </TaskInboxLayout>
  );
}
