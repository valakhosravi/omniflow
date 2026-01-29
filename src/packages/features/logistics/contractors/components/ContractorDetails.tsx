import { GetContractorInfo } from "../api/contractorApi";
import { useEffect, useState } from "react";
import fetchImageFile from "@/components/food/FetchImageFile";
import { toLocalDateShort } from "@/utils/dateFormatter";
import CustomButton from "@/ui/Button";
import { Eye } from "iconsax-reactjs";
import { Spinner, useDisclosure } from "@heroui/react";
import CertificatePreviewModal from "./CertificatePreviewModal";
import GeneralResponse from "@/packages/core/types/api/general_response";

export default function ContractorDetails({
  contractorInfoData,
}: {
  contractorInfoData: GeneralResponse<GetContractorInfo> | undefined;
}) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  useEffect(() => {
    async function loadLogo() {
      setLoadingImg(true);
      if (contractorInfoData?.Data?.LogoAddress) {
        const file = await fetchImageFile(
          "invoice",
          contractorInfoData.Data.LogoAddress
        );
        setLogoFile(file);
      } else {
        setLogoFile(null);
      }
      setLoadingImg(false);
    }
    loadLogo();
  }, [contractorInfoData?.Data?.LogoAddress]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!logoFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(logoFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const handleDownloadVATCertificate = () => {
    onOpen();
  };

  const certificate =
    contractorInfoData?.Data?.VATCertificateAddress === null ? (
      "آپلود نشده"
    ) : (
      <CustomButton
        buttonSize="xs"
        buttonVariant="outline"
        startContent={<Eye size={16} />}
        onPress={handleDownloadVATCertificate}
      >
        مشاهده
      </CustomButton>
    );

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
    {
      title: "گواهی مالیات بر ارزش افزوده",
      value: certificate,
    },
  ];

  return (
    <>
      <div
        className="border border-secondary-200/[.15] rounded-[20px] p-4 
      bg-secondary-50 grid grid-cols-5 justify-between gap-x-[64px]"
      >
        <div className="flex flex-col justify-between col-span-3 space-y-3">
          <div
            className="flex items-center gap-x-[10px] bg-white rounded-[12px] 
          px-[12px] py-[25px]"
          >
            <div className="flex items-center">
              {loadingImg ? (
                <Spinner />
              ) : (
                previewUrl && (
                  <img
                    src={previewUrl}
                    alt="contractor logo"
                    className="size-[70px] rounded-[16px] object-cover"
                  />
                )
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-semibold text-[16px]/[24px] text-secondary-950">
                {contractorInfoData?.Data?.Name}
              </span>
              <span className="font-normal text-[12px]/[18px] text-secondary-400">
                {contractorInfoData?.Data?.Address}
              </span>
            </div>
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
                {toLocalDateShort(contractorInfoData?.Data?.FirstCollabrationDate)}
              </span>
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
      <CertificatePreviewModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        certificate={contractorInfoData?.Data?.VATCertificateAddress}
      />
    </>
  );
}
