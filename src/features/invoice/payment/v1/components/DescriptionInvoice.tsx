// import { Input, Select, SelectItem, Textarea } from "@heroui/react";
// import { AppSwitch as Switch } from "@/components/common/AppSwitch";
// import { useState } from "react";
// import {
//   useGetInvoiceApproverQuery,
//   useGetProvidedItemsQuery,
//   useSaveInvoiceDetailMutation,
// } from "../Invoice.services";
// import { Profile2User } from "iconsax-reactjs";
// import CustomButton from "@/ui/Button";
// import { useCamunda } from "@/packages/camunda";
// import { useRouter, useSearchParams } from "next/navigation";
// import { addToaster } from "@/ui/Toaster";
// import { GeneralResponse } from "@/services/commonApi/commonApi.type";
// import { getInvoiceByRequestId } from "../invoice.type";
// import AppFile from "@/components/common/AppFile";
// import { FeatureNamesEnum } from "@/components/common/AppFile/AppFile.const";
// import { FileType } from "@/components/common/AppFile/AppFile.types";

// interface DescriptionInvoiceProps {
//   title: string;
//   invoiceDetails: GeneralResponse<getInvoiceByRequestId> | undefined;
// }

// export default function DescriptionInvoice({
//   title,
//   invoiceDetails,
// }: DescriptionInvoiceProps) {
//   const searchParams = useSearchParams();
//   const taskId = searchParams?.get("taskId");
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     approver: "",
//     product: "",
//     productDescription: "",
//     managerDescription: "",
//   });

//   const [formErrors, setFormErrors] = useState({
//     approver: "",
//     product: "",
//     productDescription: "",
//     managerDescription: "",
//   });

//   const [needWarehouseCheck, setNeedWarehouseCheck] = useState(false);
//   const [files, setFiles] = useState<FileType[] | []>([]);
//   const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
//   const [isRejectingRequest, setIsRejectingRequest] = useState(false);

//   const { data: invoiceApprovers } = useGetInvoiceApproverQuery();
//   const { data: providedItems } = useGetProvidedItemsQuery();
//   const [saveInvoiceDetail] = useSaveInvoiceDetailMutation();
//   const { completeTaskWithPayload } = useCamunda();

//   // Options for selects
//   const approverOptions =
//     invoiceApprovers?.Data?.map((approver) => ({
//       label: approver.Name,
//       value: approver.GroupId,
//     })) || [];

//   const providedOptions =
//     providedItems?.Data?.map((item) => ({
//       label: item.Name,
//       value: item.ProvidedItemId,
//     })) || [];

//   const handleSubmit = async () => {
//     const errors: typeof formErrors = {
//       approver: "",
//       product: "",
//       productDescription: "",
//       managerDescription: "",
//     };

//     if (!formData.approver) errors.approver = "انتخاب تایید‌کننده الزامی است";
//     if (!formData.product) errors.product = "انتخاب کالا یا خدمات الزامی است";
//     if (!formData.productDescription)
//       errors.productDescription = "کالا یا خدمت خریداری شده الزامی است";

//     setFormErrors(errors);

//     if (Object.values(errors).some((err) => err)) return;

//     try {
//       setIsAcceptingRequest(true);
//       const selectedApprover = invoiceApprovers?.Data?.find(
//         (a) => String(a.GroupId) === formData.approver,
//       );

//       await saveInvoiceDetail({
//         ApproverGroupKey: selectedApprover?.GroupKey ?? "",
//         InvoiceId: invoiceDetails?.Data?.InvoiceId ?? 0,
//         ProvidedItemId: Number(formData.product),
//         Description: formData.managerDescription,
//         WarehouseRequired: needWarehouseCheck,
//         // WarehouseFile: (files[0] as File) ?? undefined,
//         ProvidedItemDescription: formData.productDescription,
//       });

//       await completeTaskWithPayload(taskId!, {
//         CPOApprove: true,
//         ApproverGroup: selectedApprover?.GroupKey,
//         WarehouseRequired: needWarehouseCheck,
//         CPODescription: formData.managerDescription,
//         Edit: false,
//       });

//       router.replace("/task-inbox/completed-tasks");
//     } catch (error: any) {
//       addToaster({
//         color: "danger",
//         title: error.data?.message ?? "خطا در تایید درخواست",
//       });
//     } finally {
//       setIsAcceptingRequest(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!formData.managerDescription.trim()) {
//       setFormErrors((prev) => ({
//         ...prev,
//         managerDescription:
//           "در صورت رد یا ارجاع درخواست باید توضیحات وارد شود.",
//       }));
//       return;
//     }

//     try {
//       setIsRejectingRequest(true);
//       await completeTaskWithPayload(taskId!, {
//         CPOApprove: false,
//         CPODescription: formData.managerDescription,
//         WarehouseRequired: needWarehouseCheck,
//       });
//       router.replace("/task-inbox/completed-tasks");
//     } catch (error: any) {
//       addToaster({
//         color: "danger",
//         title: error.data?.message || "خطا در رد درخواست",
//       });
//     } finally {
//       setIsRejectingRequest(false);
//     }
//   };

//   return (
//     <div className="border border-primary-950/[.1] rounded-[20px] px-[20px] py-[16px]">
//       <h3 className="font-medium text-[14px]/[23px] text-primary-950">
//         {title}
//       </h3>
//       <div className="h-[1px] w-full bg-primary-950/[.1] mt-3 mb-4" />

//       <div className="flex flex-col space-y-[30px]">
//         <div className="flex items-center gap-x-4 justify-between">
//           <div className="w-full flex flex-col gap-y-3">
//             <label className="font-bold text-[14px]/[20px]">
//               تایید‌کننده <span className="text-accent-500">*</span>
//             </label>
//             <Select
//               selectedKeys={formData.approver ? [formData.approver] : []}
//               onSelectionChange={(keys) => {
//                 const value = Array.from(keys)[0];
//                 setFormData((prev) => ({
//                   ...prev,
//                   approver: value ? String(value) : "",
//                 }));
//                 setFormErrors((prev) => ({ ...prev, approver: "" }));
//               }}
//               isInvalid={!!formErrors.approver}
//               isRequired
//               className="w-full"
//               classNames={{
//                 base: "w-full",
//                 trigger:
//                   "w-full border border-default-300 rounded-[12px] shadow-none min-h-[48px] h-[48px] bg-transparent",
//                 value: `text-sm text-secondary-950`,
//                 popoverContent: `border border-default-300`,
//               }}
//             >
//               {approverOptions.map((option) => (
//                 <SelectItem key={option.value} textValue={option.label}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </Select>
//             {formErrors.approver && (
//               <p className="text-red-500 text-sm mt-1">{formErrors.approver}</p>
//             )}
//           </div>

//           <div className="w-full flex flex-col gap-y-3">
//             <label className="font-bold text-[14px]/[20px]">
//               کالا یا خدمات ارايه شده <span className="text-accent-500">*</span>
//             </label>
//             <Select
//               selectedKeys={formData.product ? [formData.product] : []}
//               onSelectionChange={(keys) => {
//                 const value = Array.from(keys)[0];
//                 setFormData((prev) => ({
//                   ...prev,
//                   product: value ? String(value) : "",
//                 }));
//                 setFormErrors((prev) => ({ ...prev, product: "" }));
//               }}
//               isInvalid={!!formErrors.product}
//               isRequired
//               className="w-full"
//               classNames={{
//                 base: "w-full",
//                 trigger:
//                   "w-full border border-default-300 rounded-[12px] shadow-none min-h-[48px] h-[48px] bg-transparent",
//                 value: `text-sm text-secondary-950`,
//                 popoverContent: `border border-default-300`,
//               }}
//             >
//               {providedOptions.map((option) => (
//                 <SelectItem key={option.value} textValue={option.label}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </Select>
//             {formErrors.product && (
//               <p className="text-red-500 text-sm mt-1">{formErrors.product}</p>
//             )}
//           </div>
//         </div>

//         <div className="w-full flex flex-col gap-y-3">
//           <label className="font-bold text-[14px]/[20px]">
//             کالا یا خدمت خریداری شده <span className="text-accent-500">*</span>
//           </label>
//           <Input
//             value={formData.productDescription}
//             onChange={(e) => {
//               const value = e.target.value;
//               setFormData((prev) => ({
//                 ...prev,
//                 productDescription: value,
//               }));

//               if (formErrors.productDescription) {
//                 setFormErrors((prev) => ({ ...prev, productDescription: "" }));
//               }
//             }}
//             variant="bordered"
//             classNames={{
//               inputWrapper: "border border-secondary-950/[.2] rounded-[12px]",
//               input:
//                 "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
//               label:
//                 "font-bold text-[14px]/[20px] text-secondary-950 mb-[8.5px]",
//             }}
//             isInvalid={!!formErrors.productDescription}
//             errorMessage={formErrors.productDescription}
//           />
//         </div>

//         <Textarea
//           label="توضیحات"
//           labelPlacement="outside"
//           placeholder="در صورتی که توضیحاتی دارید در این قسمت وارد کنید."
//           fullWidth
//           variant="bordered"
//           value={formData.managerDescription}
//           onChange={(e) => {
//             const value = e.target.value;
//             setFormData((prev) => ({
//               ...prev,
//               managerDescription: value,
//             }));
//             if (formErrors.managerDescription) {
//               setFormErrors((prev) => ({ ...prev, managerDescription: "" }));
//             }
//           }}
//           isInvalid={!!formErrors.managerDescription}
//           errorMessage={formErrors.managerDescription}
//           classNames={{
//             inputWrapper: "border border-secondary-950/[.2] rounded-[16px]",
//             input: "text-right dir-rtl font-normal text-[12px]/[18px] p-[16px]",
//             label: `font-medium text-[14px]/[23px] text-secondary-950`,
//           }}
//         />

//         <div
//           className={`p-[8px] flex justify-between items-center border border-[#D8D9DF] rounded-[12px] opacity-80`}
//         >
//           <div className="flex items-center">
//             <div className="w-[40px] h-[40px] rounded-[12px] border border-primary-950/[.1] flex items-center justify-center">
//               <Profile2User className="w-[20px] h-[20px] text-primary-950" />
//             </div>
//             <div className="text-[16px] text-[#26272B] ms-[10px] font-medium">
//               نیاز به بررسی انبار دارد.
//             </div>
//           </div>
//           <Switch
//             isSelected={needWarehouseCheck}
//             onValueChange={(value) => setNeedWarehouseCheck(value)}
//             classNames={{
//               wrapper: "group-data-[selected=true]:!bg-[#1C3A63]",
//             }}
//           />
//         </div>

//         {needWarehouseCheck && (
//           <AppFile
//             enableUpload
//             featureName={FeatureNamesEnum.INVOICE}
//             files={files}
//             setFiles={setFiles}
//             isMultiple={false}
//           />
//         )}

//         <div className="flex items-center self-end gap-x-[12px]">
//           <CustomButton
//             buttonSize="sm"
//             buttonVariant="outline"
//             className="!text-trash !rounded-[12px]"
//             onPress={handleReject}
//             isLoading={isRejectingRequest}
//           >
//             رد درخواست
//           </CustomButton>
//           <CustomButton
//             buttonSize="sm"
//             buttonVariant="primary"
//             className="!rounded-[12px]"
//             onPress={handleSubmit}
//             isLoading={isAcceptingRequest}
//           >
//             تایید درخواست
//           </CustomButton>
//         </div>
//       </div>
//     </div>
//   );
// }
