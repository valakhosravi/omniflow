import BugEditPageComponent from "@/features/support/bug/v1/components/Edit/[requestId]/BugEditPageComponent";
import withPermission, { PERMISSION } from "@/HOC/withPermission";
function EditPage() {
  return <BugEditPageComponent />;
}

export default withPermission(EditPage, PERMISSION.TASK);
