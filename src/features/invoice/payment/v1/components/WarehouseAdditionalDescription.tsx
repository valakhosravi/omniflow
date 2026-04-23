// import { GeneralResponse } from "@/services/commonApi/commonApi.type";
// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// // import { useCamunda } from "@/packages/camunda";
// import { Textarea } from "@heroui/react";
// import CustomButton from "@/ui/Button";
// // import { addToaster } from "@/ui/Toaster";
// import { getInvoiceByRequestId } from "../invoice.type";
// // import { useUpdateWarehouseReceipeFileMutation } from "../Invoice.services";
// import AppFile from "@/components/common/AppFile";
// import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
// import { FileType } from "@/components/common/AppFile/AppFile.types";

// interface WarehouseAdditionalDescriptionProps {
//   title: string;
//   invoiceDetails: GeneralResponse<getInvoiceByRequestId> | undefined;
// }

// export default function WarehouseAdditionalDescription({
//   title,
//   // invoiceDetails,
// }: WarehouseAdditionalDescriptionProps) {
//   const searchParams = useSearchParams();
//   // const router = useRouter();
//   const taskId = searchParams?.get("taskId");
//   const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
//   // const { completeTaskWithPayload } = useCamunda();

//   // const [updateReceipeFile] = useUpdateWarehouseReceipeFileMutation();
//   const [managerDescription, setManagerDescription] = useState("");
//   const [managerRejectDescriptionError, setManagerRejectDescriptionError] =
//     useState(false);

//   const onSubmit = async () => {
//     if (!files) {
//       setIsAcceptingRequest(false);
//       return;
//     }
//     if (!taskId) return;
//     // try {
//     setIsAcceptingRequest(true);
//     // await updateReceipeFile({
//     //   id: invoiceDetails?.Data?.InvoiceId ?? 0,
//     //   receipeFile: files,
//     //   }).then(() => {
//     //     completeTaskWithPayload(taskId, {
//     //       WarehouseApprove: true,
//     //       WarehouseDescription: managerDescription,
//     //     }).then(() => {
//     //       router.replace("/task-inbox/completed-tasks");
//     //     });
//     //   });
//     // } catch (error: any) {
//     //   addToaster({
//     //     color: "danger",
//     //     title: error.data.message,
//     //   });
//     // } finally {
//     //   setIsAcceptingRequest(false);
//     // }
//   };

//   return (
//     <div className="border border-primary-950/[.1] rounded-[20px] px-[20px] py-[16px]">
//       <h3 className="font-medium text-[14px]/[23px] text-primary-950">
//         {title}
//       </h3>
//       <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-4" />
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           onSubmit();
//         }}
//         className="flex flex-col space-y-[30px]"
//       >
//         <Textarea
//           label="توضیحات"
//           labelPlacement="outside"
//           name="description"
//           placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
//           fullWidth={true}
//           type="text"
//           variant="bordered"
//           isInvalid={!!managerRejectDescriptionError}
//           errorMessage="در صورت رد یا ارجاع درخواست باید توضیحات مربوطه وارد شود."
//           classNames={{
//             inputWrapper: "border border-secondary-950/[.2] rounded-[16px]",
//             input: "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
//             label: `font-medium text-[14px]/[23px] text-secondary-950`,
//           }}
//           value={managerDescription}
//           onChange={(e) => {
//             setManagerDescription(e.target.value);

//             if (managerRejectDescriptionError) {
//               setManagerRejectDescriptionError(false);
//             }
//           }}
//         />

//         <div className="flex items-center self-end gap-x-[12px] mt-4">
//           <CustomButton
//             key="approve-button"
//             buttonSize="sm"
//             buttonVariant="primary"
//             className="!rounded-[12px]"
//             type="submit"
//             isLoading={isAcceptingRequest}
//           >
//             تایید درخواست
//           </CustomButton>
//         </div>
//       </form>
//     </div>
//   );
// }
