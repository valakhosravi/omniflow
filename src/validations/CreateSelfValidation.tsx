import CreateSelfInput from "@/models/food/self/CreateSelfInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema: yup.ObjectSchema<CreateSelfInput> = yup.object({
  Name: yup.string().required("نام سلف را وارد کنید"),
  Phone: yup.string().required("تلفن را وارد کنید"),
  Address: yup.string().required("آدرس سلف را وارد کنید"),
  BuildingId: yup.number().nullable().required("انتخاب ساختمان الزامی است"),
});

export default function useCreateSelfValidation(
  defaultValues?: CreateSelfInput
) {
  return useForm<CreateSelfInput>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: defaultValues || {
      Name: "",
      Phone: "",
      Address: "",
      BuildingId: null,
    },
  });
}
