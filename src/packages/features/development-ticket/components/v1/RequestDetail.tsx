import Review from "@/packages/features/task-inbox/pages/requests/contract-request/components/Review";
import { FormDataItem } from "../../types/FormDataItem";
import ApplicantDetail from "@/packages/features/task-inbox/pages/requests/contract-request/components/ApplicantDetail";

interface RequestDetailProps {
  formData: FormDataItem[];
  CreatedDate?: string | undefined;
  reviewOfUnits?: boolean;
  applicantDetail?: boolean;
  applicantData?: FormDataItem[];
}

export default function RequestDetail({
  formData,
  CreatedDate,
  reviewOfUnits,
  applicantDetail,
  applicantData,
}: RequestDetailProps) {
  return (
    <div className="col-span-4 space-y-3 sticky top-4 self-start">
      <Review reviewOfUnits={reviewOfUnits ?? false} />
      {applicantDetail && applicantData && (
        <ApplicantDetail applicantData={applicantData} />
      )}
      <div className="border border-[#26272B33] rounded-[20px] p-4">
        <div className="flex items-center gap-x-1">
          <h2 className="font-medium text-[16px]/[30px] text-primary-950">
            آخرین وضعیت درخواست
          </h2>
          {/* <Copy size={20} className="text-secondary-400" /> */}
        </div>
        <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-4" />
        <div className="flex flex-col space-y-[20px]">
          {formData.map((data: FormDataItem, index: number) => {
            return (
              <div key={index} className="flex flex-col gap-y-1">
                <div className={`flex justify-between flex-row items-center`}>
                  <div className="flex items-center gap-x-2">
                    <div className="p-2 bg-white rounded-[8px] border border-primary-950/[.1]">
                      {data.icon}
                    </div>
                    <h6 className="font-medium text-primary-950/[.5] text-[14px]/[27px]">
                      {data.title}
                    </h6>
                  </div>
                  <div className="font-medium text-primary-950 text-[14px]/[27px]">
                    {data.description || data.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col font-medium text-[12px]/[22px] text-primary-950/[.5]">
        <div className="text-xs text-[#1C3A6380]">
          آخرین بروزرسانی در{" "}
          {(() => {
            const date = new Date(CreatedDate || "")
              .toLocaleString("fa-IR")
              ?.split(", ");
            return `تاریخ ${date[0]} ساعت ${date[1]?.split(":")[0]}:${
              date[1]?.split(":")[1]
            }`;
          })()}
        </div>
        {/* <p>
          به‌روزرسانی شده: ۱۵ دقیقه پیش توسط
          <span className="text-primary-950 font-semibold">امیر رضایی</span>
        </p> */}
      </div>
    </div>
  );
}
