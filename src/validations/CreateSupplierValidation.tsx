import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import CreateSupplierInput from "@/models/food/supplier/CreateSupplierInput";

const schema: yup.ObjectSchema<CreateSupplierInput> = yup.object({
  Name: yup.string().required("نام تأمین‌کننده را وارد کنید"),
  Phone: yup.string().required("تلفن را وارد کنید"),
  Address: yup.string().required("آدرس را وارد کنید"),
});

export default function useCreateSupplierValidation(
  defaultValues?: CreateSupplierInput
) {
  return useForm<CreateSupplierInput>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: defaultValues || {
      Name: "",
      Phone: "",
      Address: "",
    },
  });
}
