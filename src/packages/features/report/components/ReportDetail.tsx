import { JSX } from "react";

interface ReportDetailProps {
  formData: (
    | {
        icon: JSX.Element;
        title: string;
        value: string | undefined;
        type?: undefined;
      }
    | {
        icon: JSX.Element;
        title: string;
        value: JSX.Element;
        type?: undefined;
      }
    | {
        icon: JSX.Element;
        title: string;
        type: string;
        value: string | undefined;
      }
  )[];
  requestId: string;
  isLong: boolean;
}

export default function ReportDetail({
  formData,
  requestId,
  isLong,
}: ReportDetailProps) {
  return (
    <div
      className="bg-primary-950/[.03] border border-primary-950/[.1] rounded-[20px]
          px-5 py-4"
    >
      <h4 className="font-medium text-[14px]/[27px] text-primary-950">
        خلاصه درخواست پرداخت صورتحساب
      </h4>
      <div className="h-[1px] bg-primary-950/[.1] w-full mt-3 mb-4" />
      <div className="flex flex-col gap-y-4">
        {formData.map((data, index) => {
          return (
            <div key={index} className="flex flex-col gap-y-1">
              <div
                className={`flex justify-between ${
                  isLong
                    ? "flex-col items-start gap-y-2"
                    : "flex-row items-center"
                }`}
              >
                <div className="flex items-center gap-x-2 text-[14px]/[27px]">
                  <div className="p-2 bg-white rounded-[8px] border border-primary-950/[.1]">
                    {data.icon}
                  </div>
                  <h6 className="font-medium text-primary-950/[.5]">
                    {data.title}
                  </h6>
                </div>
                {typeof data.value === "string" ? (
                  <p className="font-medium text-primary-950">{data.value}</p>
                ) : (
                  <div className="font-medium text-primary-950">
                    {data.value}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
