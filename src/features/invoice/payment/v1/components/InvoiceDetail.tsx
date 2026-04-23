import AppFile from "@/components/common/AppFile";
import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
import { toLocalDateShortExel } from "@/utils/dateFormatter";
import { formatNumberWithCommas } from "@/utils/formatNumber";
import {
  Calendar,
  Coin,
  Data,
  Document,
  Mobile,
  SmsTracking,
  Solana,
  TimerStart,
  Truck,
  User,
} from "iconsax-reactjs";
import { getInvoiceByRequestId } from "../invoice.type";
import { useState } from "react";
import { FileType } from "@/components/common/AppFile/AppFile.types";

interface InvoiceDetailProps {
  invoiceData: getInvoiceByRequestId;
  title?: string;
  requestId: string;
  isLong: boolean;
}

export default function InvoiceDetail({
  title,
  isLong,
  requestId,
  invoiceData,
}: InvoiceDetailProps) {
  const [files, setFiles] = useState<FileType[] | []>([]);
  const formData = [
    {
      icon: <User size={16} />,
      title: "نام پیمانکار",
      value: invoiceData.ContractorName || "",
    },
    {
      icon: <Truck size={16} />,
      title: "کالا یا خدمت ارایه شده",
      value: invoiceData.ProvidedItemName || "",
    },
    {
      icon: <Solana size={16} />,
      title: " توضیحات کالا یا خدمت خریداری شده",
      value: invoiceData.ProvidedItemDescription || "",
    },
    {
      icon: <Data size={16} />,
      title: "موضوع صورت حساب",
      value: invoiceData.Title || "",
    },
    {
      icon: <Mobile size={16} />,
      title: "موبایل",
      value: invoiceData.Mobile || "",
    },
    {
      icon: <TimerStart size={16} />,
      title: "تاریخ صورتحساب",
      value: toLocalDateShortExel(invoiceData.InvoiceDate) || "",
    },
    {
      icon: <SmsTracking size={16} />,
      title: "شماره فاکتور",
      value: invoiceData.FactorNumber || "",
    },
    {
      icon: <Coin size={16} />,
      title: "مبلغ فاکتور",
      value: formatNumberWithCommas(String(invoiceData.Amount)) || "",
    },
    {
      icon: <Calendar size={16} />,
      title: "اعتبار گواهی مالیاتی",
      value: invoiceData.VatEndDate?.startsWith("0001")
        ? ""
        : toLocalDateShortExel(invoiceData.VatEndDate) || "",
    },
    {
      icon: <Document size={16} />,
      title: "پیوست‌ها",
      value: (
        <div>
          {requestId && (
            <AppFile
              setFiles={setFiles}
              requestId={requestId}
              files={files}
              enableUpload={false}
              featureName={FeatureNamesEnum.INVOICE}
            />
          )}
        </div>
      ),
    },
  ];
  return (
    <div
      className="bg-primary-950/[.03] border border-primary-950/[.1] rounded-[20px]
      px-5 py-4"
    >
      <h4 className="font-medium text-[14px]/[27px] text-primary-950">
        {title ? title : "خلاصه درخواست پرداخت صورتحساب"}
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
                    {data.value || "----"}
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
