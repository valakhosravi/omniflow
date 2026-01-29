import { FormDataItem } from "@/packages/features/development-ticket/types/FormDataItem";

export default function ApplicantDetail({
  applicantData,
}: {
  applicantData: FormDataItem[];
}) {
  return (
    <div className="border border-[#26272B33] rounded-[20px] p-4">
      <div className="flex items-center gap-x-1">
        <h2 className="font-medium text-[16px]/[30px] text-primary-950">
          اطلاعات درخواست دهنده
        </h2>
        {/* <Copy size={20} className="text-secondary-400" /> */}
      </div>
      <div className="h-[1px] bg-primary-950/[.1] mt-3 mb-4" />
      <div className="flex flex-col space-y-[20px]">
        {applicantData.map((data: FormDataItem, index: number) => {
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
  );
}
