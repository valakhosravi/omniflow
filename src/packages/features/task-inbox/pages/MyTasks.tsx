"use client";
import Toolbar from "../components/Toolbar";
import TaskTable from "../components/TaskTable";
import { TaskFilter } from "@/constants/task-filter";

function MyTasksPage() {
  return (
    <>
      <Toolbar title={`وظایف من`} />
      <TaskTable type={TaskFilter.Assignee} />
    </>
  );
}

export default MyTasksPage;
