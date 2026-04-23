import CreateDatePlanInput from "@/models/food/plan/CreateDatePlanInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema: yup.ObjectSchema<CreateDatePlanInput> = yup
  .object({
    Name: yup.string().required("نام برنامه غذایی را وارد کنید"),
    Date: yup
      .array()
      .of(yup.mixed())
      .min(1, "حداقل یک تاریخ را انتخاب کنید")
      .required("تاریخ برنامه غذایی را وارد کنید"),
  })
  .required();

export default function useCreateDatePlanValidation(
  defaultValues?: CreateDatePlanInput
) {
  return useForm<CreateDatePlanInput>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: defaultValues || {
      Name: "",
      Date: [],
    },
  });
}
