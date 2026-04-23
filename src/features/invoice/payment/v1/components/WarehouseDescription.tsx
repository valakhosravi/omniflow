// import { GetLastRequestStatus } from "@/models/camunda-process/GetRequests";
// import { GeneralResponse } from "@/services/commonApi/commonApi.type";
// import { JSX, useEffect, useState } from "react";
// import InvoiceDetail from "./InvoiceDetail";
// import {
//   Calendar,
//   Coin,
//   Data,
//   Document,
//   ImportCurve,
//   Mobile,
//   SmsTracking,
//   Solana,
//   TimerStart,
//   Truck,
//   User,
//   Image as ImageIcon,
// } from "iconsax-reactjs";
// import { Button } from "@heroui/react";
// import { toLocalDateShortExel } from "@/utils/dateFormatter";
// import { formatNumberWithCommas } from "@/utils/formatNumber";
// import Image from "next/image";

// import fetchImageFile from "@/components/food/FetchImageFile";
// import Loading from "@/ui/Loading";
// import WarehouseAdditionalDescription from "./WarehouseAdditionalDescription";
// import AppFile from "@/components/common/AppFile";
// import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
// import { FileType } from "@/components/common/AppFile/AppFile.types";
// import {
//   formatFileSize,
//   getFileTypeLabel,
// } from "@/components/common/AppFile/AppFile.utils";
// import { getInvoiceByRequestId } from "../invoice.type";

// interface WarehouseDescriptionProps {
//   requestId?: string;
//   requestStatus: GetLastRequestStatus | undefined;
//   refetch: () => void;
//   invoiceDetails: GeneralResponse<getInvoiceByRequestId> | undefined;
// }

// export default function WarehouseDescription({
//   invoiceDetails,
//   requestId,
// }: WarehouseDescriptionProps) {
//   const [warehouseFile, setWarehouseFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [imageLoading, setImageLoading] = useState<boolean>(false);
//   const [files, setFiles] = useState<FileType[] | []>([]);

//   useEffect(() => {
//     const fileAddress = invoiceDetails?.Data?.WarehouseFileAddress;

//     if (invoiceDetails?.Data === undefined) return;

//     setImageLoading(true);

//     async function loadFile() {
//       if (!fileAddress) {
//         setWarehouseFile(null);
//         setPreviewUrl(null);
//         setImageLoading(false);
//         return;
//       }

//       const file = await fetchImageFile("invoice", fileAddress);

//       if (file) {
//         setWarehouseFile(file);
//         setPreviewUrl(URL.createObjectURL(file));
//       }

//       setImageLoading(false);
//     }

//     loadFile();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [invoiceDetails?.Data?.WarehouseFileAddress]);

//   function downloadFile() {
//     if (!warehouseFile) return;

//     const url = URL.createObjectURL(warehouseFile);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = warehouseFile.name;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   }

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
//       icon: <Calendar size={16} />,
//       title: "اعتبار گواهی مالیاتی",
//       value: invoiceDetails?.Data?.VatEndDate?.startsWith("0001")
//         ? ""
//         : toLocalDateShortExel(invoiceDetails?.Data?.VatEndDate) || "",
//     },
//     {
//       icon: <Document size={16} />,
//       title: "فایل انبار",
//       value: invoiceDetails?.Data?.WarehouseFileAddress ? (
//         <div
//           key={"warehousefile"}
//           className="flex items-center justify-between border border-neutral-200 rounded-[12px] p-[12px]"
//         >
//           {imageLoading ? (
//             <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 rounded">
//               <Loading />
//             </div>
//           ) : (
//             <div className="flex gap-x-[10px] items-center">
//               <div className="relative w-[58px] h-[58px] flex items-center justify-center">
//                 {previewUrl && warehouseFile?.type.startsWith("image/") ? (
//                   <Image
//                     src={previewUrl}
//                     alt="preview"
//                     fill
//                     className="object-cover rounded-[6px]"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-pagination-dropdown rounded-[12px] flex items-center justify-center border border-primary-950/[.1]">
//                     <ImageIcon className="size-[32px] text-primary-950/[.2]" />
//                   </div>
//                 )}
//               </div>

//               {warehouseFile && (
//                 <div className="flex flex-col font-medium text-[12px]/[18px] space-y-1">
//                   <p className="text-secondary-950 truncate max-w-[150px]">
//                     {warehouseFile.name}
//                   </p>
//                   <div className="flex items-center gap-x-2 text-secondary-400">
//                     <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
//                       {getFileTypeLabel(warehouseFile.type, warehouseFile.name)}
//                     </span>
//                     <span>
//                       {warehouseFile.size !== 0 &&
//                         formatFileSize(warehouseFile.size)}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//           <Button
//             isIconOnly
//             onPress={downloadFile}
//             className="group bg-transparent hover:bg-accent-600"
//             size="sm"
//           >
//             <ImportCurve className="size-[20px] text-secondary-300 group-hover:text-accent-700 transition-colors duration-200" />
//           </Button>
//         </div>
//       ) : (
//         "آپلود نشده"
//       ),
//     } as {
//       icon: JSX.Element;
//       title: string;
//       value: JSX.Element;
//       type?: undefined;
//     },
//     {
//       icon: <Document size={16} />,
//       title: "پیوست‌ها",
//       value: (
//         <div>
//           {requestId && (
//             <AppFile
//               requestId={requestId}
//               files={files}
//               setFiles={setFiles}
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
//         invoiceData={invoiceData}
//         requestId={requestId ?? ""}
//         isLong={isLong}
//       />
//       <WarehouseAdditionalDescription
//         title="اطلاعات تکمیلی صورتحساب"
//         invoiceDetails={invoiceDetails}
//       />
//     </div>
//   );
// }
