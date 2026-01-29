import TaskInboxLayout from "../layouts";
import Toolbar from "../components/Toolbar";
import SnoozeTable from "../components/SnoozeTable";

export default function SnoozeIndex() {
  return (
    <TaskInboxLayout>
      <Toolbar title="یادآوری مجدد" />
      <SnoozeTable />
    </TaskInboxLayout>
  );
}
