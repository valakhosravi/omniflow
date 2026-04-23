import { GetUserRequests } from "@/models/camunda-process/GetRequests";
import { Chip } from "@/ui/NextUi";

type StatusBadgeModel = {
  request: GetUserRequests;
};

export default function StatusBadge({ request }: StatusBadgeModel) {
  const getStatusColor = (statusCode: number) => {
    switch (statusCode) {
      case 1:
        return "bg-accent-600 text-accent-700 border-accent-600";
      case 2:
        return "bg-accent-400 text-trash border-accent-400";
      case 3:
        return "bg-accent-S-C text-accent-100 border-accent-S-C";
      default:
        return "bg-gray-100 text-gray-600 border-gray-100";
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Chip
        key={request.StatusName}
        variant="bordered"
        classNames={{
          base: `border-1 rounded-[24px] px-[10px] py-[3px] max-w-[93px] gap-x-1 ${getStatusColor(
            request.StateCode
          )}`,
          content: `font-medium text-[12px]/[18px] p-0`,
          closeButton: `text-secondary-400`,
        }}
      >
        {request.StatusName}
      </Chip>
    </div>
  );
}
