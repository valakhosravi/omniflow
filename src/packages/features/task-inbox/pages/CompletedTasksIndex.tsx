import TaskInboxLayout from "../layouts";
import Toolbar from "../components/Toolbar";
import CompletedTasksTable from "../components/CompletedTasksTable";

export default function CompletedTasksIndex() {
  return (
    <TaskInboxLayout>
      <Toolbar title="وظایف تکمیل شده" />
      <CompletedTasksTable />
    </TaskInboxLayout>
  );
}
