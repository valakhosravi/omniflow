import {
  UserRequestsTaskModel,
  GetRequestsByInstanceIds,
} from "@/models/camunda-process/GetRequestsByInstanceIds";

export async function fetchAndMapTasks({
  rawTasks,
  getRequestsAsync,
}: {
  rawTasks: any[];
  getRequestsAsync: (args: { ids: string[] }) => Promise<any>;
}): Promise<UserRequestsTaskModel[]> {
  const instanceIds = rawTasks.map((t) => t.processInstanceId);
  const response = await getRequestsAsync({ ids: instanceIds });
  const items = response?.data?.Data?.Items ?? [];

  return items.map((item: GetRequestsByInstanceIds) => {
    const matched = rawTasks.find(
      (t) => t.processInstanceId === item.InstanceId
    );
    return {
      requestId: item.RequestId,
      processId: item.ProcessId,
      userId: item.UserId,
      personnelId: item.PersonnelId,
      instanceId: item.InstanceId,
      isTerminated: item.IsTerminated,
      terminatedDate: item.TerminatedDate,
      createdDate: item.CreatedDate,
      fullName: item.FullName,
      name: item.Name,
      formName: matched?.taskDefinitionKey ?? "",
      formTitle: matched?.name ?? "",
      taskId: matched?.id ?? "",
    };
  });
}
