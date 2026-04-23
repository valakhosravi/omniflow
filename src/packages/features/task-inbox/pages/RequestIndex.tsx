import Toolbar from "../components/Toolbar";
import RequestTable from "../components/RequestTable";

export default function RequestIndex() {
  return (
    <>
      <Toolbar title="درخواست های من" />
      <RequestTable />
    </>
  );
}
