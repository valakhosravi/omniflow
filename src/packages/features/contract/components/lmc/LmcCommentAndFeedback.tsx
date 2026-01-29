import GeneralResponse from "@/packages/core/types/api/general_response";
import { toJalaliDate } from "@/packages/features/task-inbox/utils/dateFormatter";
import { Chip } from "@heroui/react";
import { GetTermAssigneeDetails } from "../../types/contractModel";
import { useGetUserByIdQuery } from "@/packages/auth/api/authApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface LmcCommentAndFeedbackProps {
  termAssignee: GeneralResponse<GetTermAssigneeDetails[]>;
  termId: number;
}

const status = [
  {
    statusCode: 1,
    statusTitle: "در دست اقدام",
    className: "bg-accent-200 text-[#ffad45]",
  },
  {
    statusCode: 2,
    statusTitle: "تایید",
    className: "bg-accent-100/[.15] text-accent-100",
  },
  {
    statusCode: 3,
    statusTitle: "عدم تایید",
    className: "bg-accent-400 text-trash",
  },
];

export default function LmcCommentAndFeedback({
  termAssignee,
  termId,
}: LmcCommentAndFeedbackProps) {
  const activeTerm = termAssignee.Data?.filter((t) => t.TermId === termId);

  const filteredTermAssignee =
    (termAssignee.Data && termAssignee.Data.map((term) => term.Comment)) ?? [];

  const { requestId } = useSelector((state: RootState) => state.lmcData);

  return (
    <div
      className="border border-primary-950/[.1] rounded-[16px]
      flex flex-col gap-y-4 mt-5 px-4 py-3"
    >
      <div className="flex flex-col gap-y-6">
        <h2
          className="flex items-center gap-x-1 font-semibold 
          text-[16px]/[30px] text-primary-950"
        >
          <span>نظرات و بازخورد‌ها</span>
          <span>({filteredTermAssignee.length})</span>
        </h2>
        {/* <div className="flex flex-col gap-y-[24px]">
          {activeTerm &&
            filteredTermAssignee.map((term) => {
              const { data: userData, isLoading } = useGetUserByIdQuery(
                term?.UserId
              );

              const currentStatus = status.find(
                (s) => s.statusCode === activeTerm.StatusCode
              );
              return (
                <div key={activeTerm.UserId} className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-x-2">
                      <div className="flex items-center gap-x-2 font-medium text-[14px]/[23px]">
                        <div className="text-primary-950">
                          {userData?.Data?.UserDetail.FullName}
                        </div>
                        <div className="w-[2px] h-[20px] bg-primary-950/[.3]" />
                        <div className="text-primary-950/[.5]">
                          {userData?.Data?.UserDetail.Title}
                        </div>
                      </div>
                      <Chip className={currentStatus?.className || ""}>
                        {currentStatus?.statusTitle || term.TermId}
                      </Chip>
                    </div>
                    <div className="font-medium text-[12px]/[22px] text-primary-950/[.4]">
                      پاسخ {toJalaliDate(term.CreatedDate)}
                    </div>
                  </div>
                  {activeTerm.Comment != null && (
                    <div
                      className="border border-primary-950/[.05] rounded-[16px] 
                      p-4 font-medium text-[12px]/[22px] text-primary-950 
                    bg-primary-950/[.03]"
                    >
                      {activeTerm.Comment}
                    </div>
                  )}
                </div>
              );
            })}
        </div> */}
      </div>
    </div>
  );
}
