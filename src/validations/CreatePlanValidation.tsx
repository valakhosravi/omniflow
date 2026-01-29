import CreatePlanInput from "@/models/food/plan/CreatePlanInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema: yup.ObjectSchema<CreatePlanInput> = yup.object({
  Name: yup.string().required("نام برنامه غذایی را وارد کنید"),
  FromDate: yup.string().required("تاریخ برنامه غذایی را وارد کنید"),
  ToDate: yup.string().required("تاریخ برنامه غذایی را وارد کنید"),
  DailyMeals: yup
    .array()
    .of(
      yup.object().shape({
        MealId: yup.number().required("شناسه وعده غذایی را وارد کنید"),
        MealDate: yup.string().required("تاریخ وعده غذایی را وارد کنید"),
        MealSideIds: yup
          .array()
          .of(yup.number().required("لطفا حداقل یک آیتم را انتخاب کنید"))
          .min(1, "حداقل یک غذای جانبی باید انتخاب شود")
          .required("لطفا حداقل یک غذای جانبی را وارد کنید"),
      })
    )
    .required("حداقل یک وعده غذایی باید اضافه شود")
    .default([]),
});

export default function useCreatePlanValidation(
  defaultValues?: CreatePlanInput
) {
  return useForm<CreatePlanInput>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: defaultValues || {
      Name: "",
      FromDate: "",
      ToDate: "",
      DailyMeals: [],
    },
  });
}
