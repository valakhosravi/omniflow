import { toLocalDateShort } from "@/utils/dateFormatter";
// import CustomButton from "@/ui/Button";
// import { Eye } from "iconsax-reactjs";
// import CertificatePreviewModal from "./CertificatePreviewModal";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import { GetContractorInfo } from "../contractors.type";
import Image from "next/image";

export default function ContractorDetails({
  contractorInfoData,
}: {
  contractorInfoData: GeneralResponse<GetContractorInfo> | undefined;
}) {
  const data = [
    { title: "شماره تماس", value: contractorInfoData?.Data?.Phones },
    { title: "دسته", value: contractorInfoData?.Data?.CategoryName },
    {
      title: "آخرین همکاری",
      value:
        contractorInfoData?.Data?.LastCollabrationDate === null
          ? "-"
          : toLocalDateShort(contractorInfoData?.Data?.LastCollabrationDate),
    },
  ];

  return (
    <>
      <div
        className="border border-secondary-200/[.15] rounded-[20px] p-4 
      bg-secondary-50 grid grid-cols-5 justify-between gap-x-[64px]"
      >
        <div className="flex gap-2 col-span-3 ">
          <div className="border p-2 rounded-2xl border-secondary-100">
            <Image alt="profile" src={""} />
          </div>

          <div className="flex flex-col justify-between">
            <div className="flex flex-col space-y-1 ">
              <span className="font-semibold text-[16px]/[24px] text-secondary-950">
                {contractorInfoData?.Data?.Name}
              </span>
              <span className="font-normal text-[12px]/[18px] text-secondary-400">
                {contractorInfoData?.Data?.Address}
              </span>
            </div>

            <div className="bg-white rounded-[12px] px-[12px] py-[25px] flex items-center">
              <div className="flex flex-col items-center space-y-2">
                <span className="font-medium text-[14px]/[23px] text-secondary-400">
                  تعداد پروژه ها
                </span>
                <span className="font-medium text-[20px]/[28px] text-secondary-950">
                  {contractorInfoData?.Data?.TotalProjects}
                </span>
              </div>
              <div className="w-[1.5px] h-[79px] bg-[#E6E6E6] mx-[28px]" />
              <div className="flex flex-col items-center space-y-2">
                <span className="font-medium text-[14px]/[23px] text-secondary-400">
                  شروع همکاری
                </span>
                <span className="font-medium text-[20px]/[28px] text-secondary-950">
                  {toLocalDateShort(
                    contractorInfoData?.Data?.FirstCollabrationDate,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center col-span-2 space-y-[20px]">
          {data.map((d, index) => {
            const isLast = index === data.length - 1;
            return (
              <div key={index}>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[14px]/[23px] text-secondary-400">
                    {d.title}
                  </span>
                  <span>{d.value}</span>
                </div>
                {!isLast && (
                  <div className="h-[1px] w-full bg-secondary-100 mt-[12px]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* <CertificatePreviewModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        certificate={contractorInfoData?.Data?.VATCertificateAddress}
      /> */}
    </>
  );
}
