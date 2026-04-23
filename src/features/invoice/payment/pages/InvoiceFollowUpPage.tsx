// import { useGetInvoiceByRequestIdQuery } from "../v1/Invoice.services";
// import { useDisclosure } from "@heroui/react";
// import { Refresh, User } from "iconsax-reactjs";
// import CustomButton from "@/ui/Button";
// import AppRequestDetail from "@/components/common/AppRequestDetails";
// import AppRequestFlowModal from "@/components/common/AppRequestFlowModal";
// import {
//   useGetLastRequestStatusQuery,
//   useGetRequestTimelineQuery,
// } from "@/services/commonApi/commonApi";
// import { STATUS_STYLES } from "@/components/common/AppRequestDetails/AppRequestDetails.const";
// import InvoiceFollowUpDescription from "../v1/components/InvoiceFollowUpDescription";

// export default function InvoiceFollowUpPage({
//   requestId,
// }: {
//   formKey: string;
//   requestId: string;
// }) {
//   const { data: requestTimeline } =
//     useGetRequestTimelineQuery(Number(requestId), {
//       skip: !requestId,
//       refetchOnMountOrArgChange: true,
//     });
//   const { data: requestStatus, refetch } = useGetLastRequestStatusQuery(
//     Number(requestId),
//     {
//       skip: !requestId,
//       refetchOnMountOrArgChange: true,
//     },
//   );
//   const { data: invoiceData } = useGetInvoiceByRequestIdQuery(
//     Number(requestId),
//     { refetchOnMountOrArgChange: true },
//   );
//   const {
//     isOpen: isRequestFlowOpen,
//     onOpen: onRequestFlowOpen,
//     onOpenChange: onOpenChangeRequestFlow,
//   } = useDisclosure();

//   const formData = [
//     {
//       title: "وضعیت درخواست",
//       value: (
//         <div
//           className={`text-[14px] py-1 px-3 font-[600] rounded-[24px] ${
//             STATUS_STYLES[requestStatus?.Data?.StatusCode || 0]
//           }`}
//         >
//           {requestStatus?.Data?.StatusName || ""}
//         </div>
//       ),
//       icon: <Refresh size={16} />,
//     },
//     {
//       title: "نام و نام خانوادگی",
//       value: requestStatus?.Data?.FullName || "",
//       icon: <User size={16} />,
//     },
//     {
//       title: "سمت",
//       value: requestStatus?.Data?.JobPositionName || "",
//       icon: <User size={16} />,
//     },
//   ];

//   return (
//     <>
//       <div className="flex items-center mb-4 justify-between px-4 pt-6">
//         <div className="inline-flex items-center gap-2">
//           <span className="text-[#1C3A63] text-[16px] font-[500]">
//             درخواست پرداخت صورتحساب
//           </span>
//         </div>

//         <CustomButton
//           buttonVariant="outline"
//           buttonSize="md"
//           startContent={<Refresh size={20} />}
//           onPress={onRequestFlowOpen}
//         >
//           مراحل گردش درخواست
//         </CustomButton>
//       </div>
//       <div className="h-[calc(100%-105px)] grid grid-cols-12 gap-4 px-4 py-6">
//         <InvoiceFollowUpDescription
//           requestId={requestId}
//           requestStatus={requestStatus?.Data}
//           refetch={refetch}
//           invoiceDetails={invoiceData}
//         />
//         <AppRequestDetail
//           formData={formData}
//           CreatedDate={requestStatus?.Data?.CreatedDate}
//         />
//       </div>
//       <AppRequestFlowModal
//         isOpen={isRequestFlowOpen}
//         onOpenChange={onOpenChangeRequestFlow}
//         requestTimeline={requestTimeline}
//       />
//     </>
//   );
// }
