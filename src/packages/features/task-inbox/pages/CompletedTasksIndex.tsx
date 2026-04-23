import Toolbar from "../components/Toolbar";
import CompletedTasksTable from "../components/CompletedTasksTable";

export default function CompletedTasksIndex() {
  return (
    <>
      <Toolbar title="وظایف تکمیل شده" />
      <CompletedTasksTable />
    </>
  );
}
