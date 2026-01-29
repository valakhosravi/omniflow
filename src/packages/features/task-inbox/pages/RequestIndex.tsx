import TaskInboxLayout from "../layouts";
import Toolbar from "../components/Toolbar";
import RequestTable from "../components/RequestTable";

export default function RequestIndex() {
  return (
    <TaskInboxLayout>
      <Toolbar title="درخواست های من" />
      <RequestTable />
    </TaskInboxLayout>
  );
}
