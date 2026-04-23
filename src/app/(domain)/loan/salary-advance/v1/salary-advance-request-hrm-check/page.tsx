import withPermission, { PERMISSION } from "@/HOC/withPermission";
import SalaryAdvanceHrmCheckPageComponent from "@/features/loan/salary-advance/v1/components/SalaryAdvanceHrmCheckPageComponent";

function SalaryAdvanceHrmCheckPage() {
  return <SalaryAdvanceHrmCheckPageComponent />;
}

export default withPermission(SalaryAdvanceHrmCheckPage, PERMISSION.TASK);
