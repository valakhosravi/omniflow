import withPermission, { PERMISSION } from "@/HOC/withPermission";
import SalaryAdvanceFollowUpPageComponent from "@/features/loan/salary-advance/v1/components/SalaryAdvanceFollowUpPageComponent";

function SalaryAdvanceFollowUpPage() {
  return <SalaryAdvanceFollowUpPageComponent />;
}

export default withPermission(SalaryAdvanceFollowUpPage, PERMISSION.REQUEST);
