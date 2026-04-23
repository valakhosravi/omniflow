// import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
// import { useState } from "react";
// import InvoiceDetail from "./InvoiceDetail";
// import {
//   Calendar,
//   Coin,
//   Data,
//   Document,
//   Mobile,
//   SmsTracking,
//   Solana,
//   TimerStart,
//   Truck,
//   User,
// } from "iconsax-reactjs";
// import { toLocalDateShortExel } from "@/utils/dateFormatter";
// import { formatNumberWithCommas } from "@/utils/formatNumber";
// import AuditAdditionalDescription from "./AuditAdditionalDescription";
// import AppFile from "@/components/common/AppFile";
// import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
// import { FileType } from "@/components/common/AppFile/AppFile.types";
// import { GeneralResponse } from "@/services/commonApi/commonApi.type";
// import { getInvoiceByRequestId } from "../invoice.type";

// interface AuditDescriptionProps {
//   requestId?: string;
//   requestStatus: GetLastRequestStatus | undefined;
//   refetch: () => void;
//   invoiceDetails: GeneralResponse<getInvoiceByRequestId> | undefined;
// }

// export default function AuditDescription({
//   invoiceDetails,
//   requestId,
// }: AuditDescriptionProps) {
//   const [files, setFiles] = useState<FileType[] | []>([]);

//   const formData = [
//     {
//       icon: <User size={16} />,
//       title: "نام پیمانکار",
//       value: invoiceDetails?.Data?.ContractorName || "",
//     },
//     {
//       icon: <Truck size={16} />,
//       title: "کالا یا خدمت ارایه شده",
//       value: invoiceDetails?.Data?.ProvidedItemName || "",
//     },
//     {
//       icon: <Solana size={16} />,
//       title: " توضیحات کالا یا خدمت خریداری شده",
//       value: invoiceDetails?.Data?.ProvidedItemDescription || "",
//     },
//     {
//       icon: <Data size={16} />,
//       title: "موضوع صورت حساب",
//       value: invoiceDetails?.Data?.Title || "",
//     },
//     {
//       icon: <Mobile size={16} />,
//       title: "موبایل",
//       value: invoiceDetails?.Data?.Mobile || "",
//     },
//     {
//       icon: <TimerStart size={16} />,
//       title: "تاریخ صورتحساب",
//       value: toLocalDateShortExel(invoiceDetails?.Data?.InvoiceDate) || "",
//     },
//     {
//       icon: <SmsTracking size={16} />,
//       title: "شماره فاکتور",
//       value: invoiceDetails?.Data?.FactorNumber || "",
//     },
//     {
//       icon: <Coin size={16} />,
//       title: "مبلغ فاکتور",
//       value: formatNumberWithCommas(String(invoiceDetails?.Data?.Amount)) || "",
//     },
//     {
//       icon: <Coin size={16} />,
//       title: "مبلغ قابل پرداخت",
//       value:
//         formatNumberWithCommas(String(invoiceDetails?.Data?.NewAmount)) || "",
//     },
//     {
//       icon: <Calendar size={16} />,
//       title: "اعتبار گواهی مالیاتی",
//       value: invoiceDetails?.Data?.VatEndDate?.startsWith("0001")
//         ? ""
//         : toLocalDateShortExel(invoiceDetails?.Data?.VatEndDate) || "",
//     },
//     {
//       icon: <Document size={16} />,
//       title: "پیوست‌ها",
//       value: (
//         <div>
//           {requestId && (
//             <AppFile
//               setFiles={setFiles}
//               requestId={requestId}
//               files={files}
//               enableUpload={false}
//               featureName={FeatureNamesEnum.REPORT}
//             />
//           )}
//         </div>
//       ),
//     },
//   ];

//   const isLong = (invoiceDetails?.Data?.Description ?? "").length > 100;
//   return (
//     <div className="col-span-8 border border-primary-950/[.1] rounded-[20px] p-4 space-y-[24px] mb-4">
//       <h4 className="font-medium text-[16px]/[30px] text-primary-950">
//         شرح درخواست
//       </h4>
//       <div className="h-[1px] bg-primary-950/[.1] w-full mt-3 mb-4" />
//       <InvoiceDetail
//         formData={formData}
//         requestId={requestId ?? ""}
//         isLong={isLong}
//       />
//       <AuditAdditionalDescription
//         title="اطلاعات تکمیلی صورتحساب"
//         invoiceDetails={invoiceDetails}
//       />
//     </div>
//   );
// }
