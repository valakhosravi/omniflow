import { ReactNode } from "react";
import ReqPermission from "@/components/common/Wrappers/ReqPermission";
import TaskPermission from "@/components/common/Wrappers/TaskPermission";

type AsyncPage<P> = (props: P) => ReactNode | Promise<ReactNode>;
export enum PERMISSION {
  TASK = "TASK",
  REQUEST = "REQUEST",
}

export default function withPermission<P>(
  PageComponent: AsyncPage<P>,
  permissionType: PERMISSION,
): AsyncPage<P> {
  return async function WrappedPage(props: P) {
    const content = await PageComponent(props);

    if (permissionType === PERMISSION.REQUEST) {
      return <ReqPermission>{content}</ReqPermission>;
    } else if (permissionType === PERMISSION.TASK) {
      return <TaskPermission>{content}</TaskPermission>;
    }
  };
}
