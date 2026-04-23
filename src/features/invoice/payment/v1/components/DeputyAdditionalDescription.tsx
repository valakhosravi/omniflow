// import { Controller, useForm } from "react-hook-form";
// import { useAuth } from "@/packages/auth/hooks/useAuth";
// import { useCamunda } from "@/packages/camunda";
// import { useRouter, useSearchParams } from "next/navigation";
// import { addToaster } from "@/ui/Toaster";
// import { InvoiceFormData, InvoicePageTypes } from "../invoice.type";
// import { useGetDeputyUsersQuery } from "@/services/commonApi/commonApi";
// import { AppButton, AppButtonProps } from "@/components/common/AppButton";
// import { invoicePayloadGenerators } from "../invoice.utils";
// import { Select, SelectItem, Textarea } from "@heroui/react";

// export default function DeputyAdditionalDescription({
//   pageType,
//   buttonList,
// }: {
//   pageType: InvoicePageTypes;
//   buttonList: AppButtonProps[];
// }) {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const taskId = searchParams?.get("taskId");
//   const { userDetail } = useAuth();

//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<InvoiceFormData>({
//     defaultValues: {
//       referral: null,
//     },
//   });
//   // const [isAcceptingRequest, setIsAcceptingRequest] = useState(false);
//   // const [isRejectingRequest, setIsRejectingRequest] = useState(false);
//   const { completeTaskWithPayload } = useCamunda();

//   const usersOptions =
//     (deputyUsers?.Data &&
//       deputyUsers?.Data.map((user) => ({
//         label: user.FullName,
//         value: user.PersonnelId,
//       }))) ??
//     [];

//   const onSubmit = (data: InvoiceFormData) => {
//     if (!taskId) return;

//     const payload = invoicePayloadGenerators[pageType];

//     const assigneeUser =
//       deputyUsers?.Data &&
//       deputyUsers?.Data.find((user) => user.PersonnelId === data.referral);

//     completeTaskWithPayload(taskId, payload)
//       .then(() => {
//         router.replace("/task-inbox/completed-tasks");
//       })
//       .catch((error) =>
//         addToaster({
//           color: "danger",
//           title: error.data.message,
//         }),
//       );
//   };

//   // const onRejectRequestClick = handleSubmit(async () => {
//   //   if (!taskId) return;
//   //   if (!managerDescription.trim()) {
//   //     setManagerRejectDescriptionError(true);
//   //     return;
//   //   }

//   //   try {
//   //     setIsRejectingRequest(true);
//   //     await completeTaskWithPayload(taskId, {
//   //       DeputyApprove: false,
//   //       DeputyDescription: managerDescription,
//   //       Assign: false,
//   //       AssigneePersonnelId: "0",
//   //       AssigneeUserId: 0,
//   //     }).then(() => {
//   //       router.replace("/task-inbox/completed-tasks");
//   //     });
//   //   } catch (error: any) {
//   //     addToaster({
//   //       color: "danger",
//   //       title: error.data?.message || "خطا در رد درخواست",
//   //     });
//   //   } finally {
//   //     setIsRejectingRequest(false);
//   //   }
//   // });

//   return (

//   );
// }
