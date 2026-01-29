import { Spinner } from "@heroui/react";
import { useGetBugInfoByRequestIdQuery } from "../api/BugFixApi";
import BugFixForm from "./BugFixCreateForm";
import TaskInboxLayout from "../../task-inbox/layouts";
import { BugFixComponentType } from "../BugFix.types";

const BugFixUserEdit = ({ requestId }: { requestId: string }) => {
  const {
    data: bugFixRequestData,
    isLoading: isBugFixDataLoading,
    error: bugFixDataError,
  } = useGetBugInfoByRequestIdQuery(Number(requestId), { skip: !requestId });
  if (isBugFixDataLoading) {
    return (
      <TaskInboxLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </TaskInboxLayout>
    );
  }

  if (bugFixDataError || !bugFixRequestData) {
    return (
      <TaskInboxLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">خطا در بارگذاری اطلاعات</div>
        </div>
      </TaskInboxLayout>
    );
  }
  return (
    <BugFixForm
      pageType={BugFixComponentType.EDIT}
      requestId={requestId}
      data={bugFixRequestData?.Data}
    />
  );
};

export default BugFixUserEdit;
