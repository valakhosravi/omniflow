import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { GetTermAssigneeDetails } from "../../contract.types";

interface LmcCommentAndFeedbackProps {
  termAssignee: GeneralResponse<GetTermAssigneeDetails[]>;
  termId: number;
}

export default function LmcCommentAndFeedback({
  termAssignee,
}: LmcCommentAndFeedbackProps) {
  const filteredTermAssignee =
    (termAssignee.Data && termAssignee.Data.map((term) => term.Comment)) ?? [];

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
