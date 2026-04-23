import withPermission, { PERMISSION } from "@/HOC/withPermission";
import SalaryAdvancePreCheckPageComponent from "@/features/loan/salary-advance/v1/components/SalaryAdvancePreCheckPageComponent";

function SalaryAdvancePreCheckPage() {
  return <SalaryAdvancePreCheckPageComponent />;
}

export default withPermission(SalaryAdvancePreCheckPage, PERMISSION.TASK);
