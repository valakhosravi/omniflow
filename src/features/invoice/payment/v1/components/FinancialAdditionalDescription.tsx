// import { useEffect } from "react";
// import { Input, Select, SelectItem } from "@heroui/react";
// import { Controller, useForm } from "react-hook-form";

// import { useGetRejectionReasonsQuery } from "../Invoice.services";

// type FormValues = {
//   paymentMethod: number | null;
//   paymentAmount: number | null;
//   rejectReason: number | null;
// };

// export default function FinancialAdditionalDescription() {

//   const {
//     formState: { errors },
//     setValue,
//     watch,
//     clearErrors,
//     control,
//   } = useForm<FormValues>({
//     defaultValues: {
//       paymentMethod: 1,
//       paymentAmount: null,
//       rejectReason: null,
//     },
//   });

//   const paymentMethod = watch("paymentMethod");

//   useEffect(() => {
//     if (paymentMethod !== 2) {
//       setValue("paymentAmount", null);
//       clearErrors("paymentAmount");
//     }
//   }, [paymentMethod, setValue, clearErrors]);

//   return (
    
//   );
// }
