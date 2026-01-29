import { GetRequestTimelineModel } from "@/models/camunda-process/GetRequests";
import { Chip } from "@/ui/NextUi";
import { toJalaliDate } from "../utils/dateFormatter";
import StepperBadge from "./StepperBadge";

const statuses = [
  { id: 100, classname: "text-accent-700 bg-accent-600" },
  { id: 101, classname: "text-accent-500 bg-accent-400" },
  { id: 105, classname: "text-accent-700 bg-accent-600" },
  { id: 110, classname: "text-accent-700 bg-accent-600" },
  { id: 102, classname: "text-accent-100 bg-accent-S-C" },
  { id: 103, classname: "text-accent-500 bg-accent-400" },
  { id: 112, classname: "text-accent-700 bg-accent-600" },
];

interface TimelineItemProps {
  formattedIndex: string;
  timeline: GetRequestTimelineModel;
  isLast: boolean;
}

export default function TimelineItem({
  timeline,
  formattedIndex,
  isLast,
}: TimelineItemProps) {
  const status = statuses.find((s) => s.id === timeline.StatusCode);
  const isAccepted = timeline.StateCode === 3;

  return (
    <div className="flex items-start gap-x-3.5">
      <div className="flex flex-col items-center">
        <StepperBadge
          isLast={isLast}
          formattedIndex={formattedIndex}
          StateCode={timeline.StateCode}
        />
        {!isLast && (
          <div
            className={`w-[2px] ${
              timeline.StatusDescription ? "h-[90px]" : "h-[50px]"
            } ${isAccepted ? "bg-primary-950/[.2]" : "bg-primary-950"}`}
          />
        )}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-x-2 font-medium text-[14px]/[27px]">
          <p className="text-primary-950">{timeline.Fullname}</p>
          <span className="text-primary-950/[.5]">|</span>
          <p className="text-primary-950/[.5]">{timeline.JobPositionName}</p>
          <Chip
            className={`!font-semibold !text-[10px]/[21px] rounded-[24px] py-[0.5px] px-[6px] h-[20px]
            ${status?.classname ?? ""}`}
          >
            {timeline.StatusName}
          </Chip>
        </div>
        <div className="flex items-center font-medium text-[12px]/[22px] text-primary-950/[.4]">
          <span>دریافت {toJalaliDate(timeline.StatusDate)}</span>
        </div>
        {timeline.StatusDescription && (
          <div
            className="border border-primary-950/[.05] p-4 rounded-[16px] bg-primary-950/[.03]
          mt-2 text-primary-950 font-medium text-[12px]/[22px] w-full"
          >
            {timeline.StatusDescription}
          </div>
        )}
      </div>
    </div>
  );
}
